import { Publisher, OrderCancelledEvent, Subjects } from "@asmovictickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject:Subjects.OrderCancelled = Subjects.OrderCancelled;
}