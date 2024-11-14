import Customer from "../../entity/customer";
import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerChangeAddressEvent from "../customer-change-address.event";


export default class EnviaConsoleLogHandler
  implements EventHandlerInterface<CustomerChangeAddressEvent>
{

  address: string

  handle(event: CustomerChangeAddressEvent): void {
    const customer = new Customer(event.eventData.id, event.eventData.name);
    customer.changeAddress(event.eventData.address.street);
    console.log(`Endereço do cliente: ${event.eventData.id}, ${event.eventData.name} alterado para: ${event.eventData.address.street}`);
  }
}