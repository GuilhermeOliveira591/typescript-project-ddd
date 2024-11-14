import ProductFactory from "./product.factory";

describe("Product factory unit test", () => {

    it("Should create a product type A", () => {
        const product = ProductFactory.create("a", "Product A", 1);

        expect(product.id).toBeDefined();
        expect(product.name).toBe("Product A");
        expect(product.price).toBe(1);
        expect(product.constructor.name).toBe("Product");
    })

    it("Should throw an error when product type is not supported", () => {
        expect(() => ProductFactory.create("c", "Product C", 1)).toThrowError("Product type not supported");       
    })


});