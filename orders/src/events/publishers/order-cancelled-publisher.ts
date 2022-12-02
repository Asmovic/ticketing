import { Publisher, OrderCancelledEvent, Subjects } from "@asmovictickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}