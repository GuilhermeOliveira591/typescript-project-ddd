import Order from "../../../domain/checkout/entity/order";
import OrderItem from "../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "../sequelize/order-item.model";
import OrderModel from "../sequelize/order.model";


export default class OrderRepository implements OrderRepositoryInterface {

    async create(entity: Order): Promise<void> {
        await OrderModel.create({
            id: entity.id,
            customer_id: entity.customerId,
            total: entity.total(),
            items: entity.items.map((item) => ({
              id: item.id,
              name: item.name,
              price: item.price,
              product_id: item.productId,
              quantity: item.quantity
            })),
        },
        {
          include: [{model: OrderItemModel}]
        }
        );
    }

    async update(entity: Order): Promise<void> {
      await OrderModel.update(

        {
          customer_id: entity.customerId,
          total: entity.total(),
        },
        {
          where: { id: entity.id },
        }

      );

      for (const orderItem of entity.items) {

        await OrderItemModel.upsert({
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          product_id: orderItem.productId,
          order_id: entity.id, 
          quantity: orderItem.quantity,
        });  

      }

    }

    async find(id: string): Promise<Order> {

      let orderModel;

        try {
          orderModel = await OrderModel.findOne({ 
            where: { 
              id 
            }, 
            include: ["items"], 
            rejectOnEmpty: true,
          });
        } catch {
            throw new Error('Order not found');
        }

        const items = orderModel.items.map((item) => {
          const orderItem = new OrderItem(
            item.id,
            item.name,
            item.price,
            item.product_id,
            item.quantity
          );
      
          return orderItem;
        });

        const order = new Order(orderModel.id, orderModel.customer_id, items);

        return order;
    }

    async findAll(): Promise<Order[]> {
      const orderModels = await OrderModel.findAll({
        include: ["items"],
      });

      const orders = await orderModels.map((orderModel) => {

        const items = orderModel.items.map((item) => {
          
          const orderItem = new OrderItem(
            item.id,
            item.name,
            item.price,
            item.product_id,
            item.quantity
          );

          return orderItem;

        });

        const order = new Order(
          orderModel.id,
          orderModel.customer_id,
          items
        );

        return order;

      });
    
      return orders;

    }   

}