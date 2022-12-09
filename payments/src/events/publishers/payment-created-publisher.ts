import { PaymentCreatedEvent, Publisher, Subjects } from "@asmovictickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}