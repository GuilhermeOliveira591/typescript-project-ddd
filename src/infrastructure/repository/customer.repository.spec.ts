import Address from "../../domain/entity/address";
import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../db/sequelize/model/customer.model";
import Customer from "../../domain/entity/customer";
import CustomerRepository from "./customer.repository";


describe("Customer repository test", () => {

    let sequelize: Sequelize;   

    beforeEach(async () => {

        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: {force: true}
        });

        await sequelize.addModels([CustomerModel]);
        await sequelize.sync();

    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("Should create a customer", async () =>{

        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address =  new Address("Street 1", 1, "zipcode 1", "city 1");
        customer.Address = address;

        await customerRepository.create(customer);

        const customerModel = await CustomerModel.findOne( {where: { id: "123" } } );

        expect(customerModel.toJSON()).toStrictEqual({
            id: customer.id,
            name: customer.name,
            street: customer.Address.street,
            number: customer.Address.number,
            zip: customer.Address.zip,
            city: customer.Address.city,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints
        });

    });

    it("Should update a customer", async () =>{

        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address =  new Address("Street 1", 1, "zipcode 1", "city 1");
        customer.Address = address;
        await customerRepository.create(customer);

        customer.changeName("Customer 2");

        customerRepository.update(customer);

        const customerModel = await CustomerModel.findOne( {where: { id: "123" } } );

        expect(customerModel.toJSON()).toStrictEqual({
            id: customer.id,
            name: customer.name,
            street: customer.Address.street,
            number: customer.Address.number,
            zip: customer.Address.zip,
            city: customer.Address.city,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints
        });

    });

    it("Should find a customer", async () =>{

        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address =  new Address("Street 1", 1, "zipcode 1", "city 1");
        customer.Address = address;
        await customerRepository.create(customer);

        const customerResult = await customerRepository.find(customer.id);

        expect(customer).toStrictEqual(customerResult);

    });

    it("Should throw an error when a customer is not found", async () =>{
    
        const customerRepository = new CustomerRepository();

        expect(async () => {
            await customerRepository.find("akdjhfvgajs0");
        }).rejects.toThrow("Customer not found");

    });

    it("Should find all customers", async () =>{

        const customerRepository = new CustomerRepository();

        const customer1 = new Customer("123", "customer 1");
        const address1 =  new Address("Street 1", 1, "zipcode 1", "city 1");
        customer1.Address = address1;
        customer1.addRewardPoints(10);
        customer1.activate();

        const customer2 = new Customer("456", "customer 2");
        const address2 =  new Address("Street 2", 2, "zipcode 2", "city 2");
        customer2.Address = address2;
        customer2.addRewardPoints(20);
        customer2.activate();
    
        await customerRepository.create(customer1);
        await customerRepository.create(customer2);

        const customers = await customerRepository.findAll();

        expect(customers).toHaveLength(2);
        expect(customers).toContainEqual(customer1);
        expect(customers).toContainEqual(customer2);

    });

});