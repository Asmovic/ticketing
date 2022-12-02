import { Publisher, OrderCreatedEvent, Subjects } from "@asmovictickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
}