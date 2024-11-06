import Address from "../../domain/entity/address";
import { Sequelize } from "sequelize-typescript";
import ProductModel from "../db/sequelize/model/product.model";
import CustomerModel from "../db/sequelize/model/customer.model";
import Customer from "../../domain/entity/customer";
import CustomerRepository from "./customer.repository";
import OrderModel from "../db/sequelize/model/order.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import Order from "../../domain/entity/order";
import ProductRepository from "./product.repository";
import Product from "../../domain/entity/product";
import OrderItem from "../../domain/entity/order_item";
import OrderRepository from "./order.repository";


describe("Order repository test", () => {

    let sequelize: Sequelize;   

    beforeEach(async () => {

        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory',
            logging: false,
            sync: {force: true}
        });

        sequelize.addModels([CustomerModel, OrderModel,OrderItemModel, ProductModel, ]);
        await sequelize.sync();

    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("Should create a new order", async () => {

        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address  = new Address("Street 1", 123, "01234-567", "São Paulo");
        customer.changeAddress(address);

        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem("1",product.name, product.price, product.id, 2);
        const order = new Order("123", customer.id, [orderItem]);
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "123",
            total: order.total(),
            items:[ 
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: "123",
                    product_id: "123",
                },
            ],
        });
    });

    it("Should update an Order", async () =>{

        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address  = new Address("Street 1", 123, "01234-567", "São Paulo");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id, 
            2
        );

        const order = new Order("123", customer.id, [orderItem]);
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const productShoes = new Product("456", "Product 2 - New Shoes", 200);
        await productRepository.create(productShoes);

        const orderItem2 = new OrderItem(
            "2",
            productShoes.name,
            productShoes.price,
            productShoes.id,
            1
        );

        order.items.push(orderItem2);

        await orderRepository.update(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "123",
            total: order.total(),
            items:[ 
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: order.id,
                    product_id: product.id,
                },
                {
                    id: orderItem2.id,
                    name: orderItem2.name,
                    price: orderItem2.price,
                    quantity: orderItem2.quantity,
                    order_id: order.id,
                    product_id: productShoes.id,
                }
            ]
        });

    });

    it("should find an order", async () => {
        
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address  = new Address("Street 1", 123, "01234-567", "São Paulo");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id, 
            2
        );

        const order = new Order("123", customer.id, [orderItem]);
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderResult = await orderRepository.find(order.id)

        expect(order).toStrictEqual(orderResult)
    })

    it("Should throw an error when an order is not found", async () =>{
    
        const orderRepository = new OrderRepository();

        expect(async () => {
            await orderRepository.find("akdjhfvgajs0");
        }).rejects.toThrow("Order not found");

    });

    it("should find all orders", async () => {

        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address  = new Address("Street 1", 123, "01234-567", "São Paulo");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const productShoes = new Product("456", "Product 2 - New Shoes", 200);
        await productRepository.create(productShoes);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        )

        const orderItem2 = new OrderItem(
            "2",
            productShoes.name,
            productShoes.price,
            productShoes.id,
            1
        )

        const orderRepository = new OrderRepository()
        const order = new Order("123", customer.id, [orderItem])
        await orderRepository.create(order)

        const order2 = new Order("456", customer.id, [orderItem2])
        await orderRepository.create(order2)

        const orders = await orderRepository.findAll()

        expect(orders).toHaveLength(2)
        expect(orders).toContainEqual(order)
        expect(orders).toContainEqual(order2)
    })



});