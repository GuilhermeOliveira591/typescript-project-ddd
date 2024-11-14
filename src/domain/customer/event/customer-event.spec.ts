import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerChangeAddressEvent from "./customer-change-address.event";
import CustomerCreatedEvent from "./customer-created.event";
import EnviaConsoleLog1Handler from "./handler/envia-console-log-1.handler";
import EnviaConsoleLog2Handler from "./handler/envia-console-log-2.handler";
import EnviaConsoleLogHandler from "./handler/envia-console-log.handler";

describe("Domain events tests", () => {

    it("should notify all customer event handlers", () => {
        
      const eventDispatcher = new EventDispatcher();

      const handler1 = new EnviaConsoleLog1Handler();

      const handler2 = new EnviaConsoleLog2Handler();

      const spyEventHandler1 = jest.spyOn(handler1, "handle");
      const spyEventHandler2 = jest.spyOn(handler2, "handle");
  
      eventDispatcher.register("CustomerCreatedEvent", handler1);
      eventDispatcher.register("CustomerCreatedEvent", handler2);
  
      expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(handler1);

      expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(handler2);
  
      const customerCreatedEvent = new CustomerCreatedEvent({
        id: "1",
        name: "Customer 1"
      });
  
      eventDispatcher.notify(customerCreatedEvent);
  
      expect(spyEventHandler1).toHaveBeenCalled();
      expect(spyEventHandler2).toHaveBeenCalled();
    });
  
    it("should notify when a customer address is changed", () => {
      const eventDispatcher = new EventDispatcher();
      const eventHandler = new EnviaConsoleLogHandler();
  
      const spyEventHandler = jest.spyOn(eventHandler, "handle");
  
      eventDispatcher.register("CustomerChangeAddressEvent", eventHandler);
  
      expect(eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"][0]).toMatchObject(eventHandler);
    
      const customerChangeAddressEvent = new CustomerChangeAddressEvent({
        id: "1",
        name: "Customer",
        address: {
          street: "Rua ABC"
        }
      });
  
      eventDispatcher.notify(customerChangeAddressEvent);
  
      expect(spyEventHandler).toHaveBeenCalled();
    });

  });