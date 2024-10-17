import Order from "./order";
import OrderItem from "./order_item";

describe("Order unit tests", () => {
    
    it("Should throw error when id is empty", () =>{

        expect(() => {
            let order = new Order("", "123", [])
        }).toThrow("Id is required");

    });

    it("Should throw error when customerId is empty", () =>{

        expect(() => {
            let order = new Order("123", "", [])
        }).toThrow("CustomerId is required");

    });

    it("Should throw error when orderItem is empty", () =>{

        expect(() => {
            let order = new Order("123", "15", [])
        }).toThrow("Items are required");

    });

    it("Should calculate total", () =>{

        const item1 = new OrderItem("1", "Item 1", 100, "p1", 2);
        const item2 = new OrderItem("2", "Item 2", 200, "p2", 2);

        const order = new Order("14", "20", [item1]);

        let total = order.total();

        expect(total).toBe(200);

        const order2 = new Order("15", "25", [item1, item2]);
        total = order2.total();
        expect(total).toBe(600);

    });

    it("Should throw error item quantity is less or greater than zero", () =>{

        expect(() => {
            const item = new OrderItem("1", "Item 1", 100, "p1", 0);
            const order = new Order("14", "20", [item]);
        }).toThrow("Quantity must be greater than zero");

    });

})