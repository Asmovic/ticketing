import { Message } from "node-nats-streaming";
import { Listener, OrderCreatedEvent, Subjects } from "@asmovictickets/common";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queue/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    async onMessage(data:OrderCreatedEvent["data"], msg: Message){
        await expirationQueue.add({
            orderId: data.id
        });

        msg.ack();
    }
}