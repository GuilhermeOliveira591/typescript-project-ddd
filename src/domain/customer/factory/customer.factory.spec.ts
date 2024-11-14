import Address from "../value-object/address";
import CustomerFactory from "./customer.factory";

describe("customer factory unit test", () => {

    it("Should create a customer", () => {
        let customer = CustomerFactory.create("John");

        expect(customer.id).toBeDefined();
        expect(customer.name).toBe("John");
        expect(customer.Address).toBeUndefined();
    });


    it("Should create a customer with an address", () => {
        const address = new Address("RUA", 1, "12334098", "SP");
        let customer = CustomerFactory.createWithAddress("John", address);

        expect(customer.id).toBeDefined();
        expect(customer.name).toBe("John");
        expect(customer.Address).toBe(address);
    });

    


});