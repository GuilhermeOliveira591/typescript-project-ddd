import { AllowNull, BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import CustomerModel from "../../customer/sequelize/customer.model";
import ProductModel from "../../product/sequelize/product.model";
import OrderModel from "./order.model";

@Table({
    tableName: "order_items",
    timestamps: false,
})

export default class OrderItemModel extends Model{

    @PrimaryKey
    @Column
    declare id: string;

    @Column({allowNull: false})
    declare name: string;

    @Column({allowNull: false})
    declare quantity: number;

    @Column({allowNull: false})
    declare price: number;

    // ---- FOREIGN KEY
    @ForeignKey(() => ProductModel)
    @Column({allowNull: false})
    declare product_id: string;

    @ForeignKey(() => OrderModel)
    @Column({allowNull: false})
    declare order_id: string;

    // ---- BELONGS TO
    
    @BelongsTo(() => OrderModel)
    declare order: ProductModel;

    @BelongsTo(() => ProductModel)
    declare product: ProductModel;



}