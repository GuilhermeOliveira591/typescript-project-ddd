import { AllowNull, BelongsTo, Column, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import CustomerModel from "../../customer/sequelize/customer.model";
import OrderItemModel from "./order-item.model";

@Table({
    tableName: "orders",
    timestamps: false,
})

export default class OrderModel extends Model {

    @PrimaryKey
    @Column
    declare id: string;

    @Column({allowNull: false})
    declare total: number;

    // ---- FOREIGN KEY
    @ForeignKey(() => CustomerModel)
    @Column({allowNull: false})
    declare customer_id: string;

    // ---- BELONGS TO
    @BelongsTo(() => CustomerModel)
    declare customer: CustomerModel;

    // ---- HAS MANY
    @HasMany(() => OrderItemModel)
    declare items: OrderItemModel[];

}