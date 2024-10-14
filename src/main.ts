import Address from "./entity/address";
import Customer from "./entity/customer";
import Order from "./entity/order";
import OrderItem from "./entity/order_item";

let customer = new Customer("123", "Guilherme Gomes");
const address = new Address("Rua 7", 10, "12345-678", "São Paulo" );
customer._address = address;
customer.activate();

const item1 = new OrderItem("1", "Alicate de pressão", 10);
const item2 = new OrderItem("2", "Trena 5 metros", 20);

cons Order = new Order("1", "123", [item1, item2]);