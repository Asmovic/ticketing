import { Publisher, ExpirationCompleteEvent, Subjects } from "@asmovictickets/common"

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete
}
