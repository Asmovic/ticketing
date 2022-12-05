import Queue from "bull";

interface payload {
    orderId: string;
}

const expirationQueue = new Queue<payload>("order:expiration", {
    redis: {
        host: process.env.REDIS_HOST
    }
});

expirationQueue.process(async (job) => {
    console.log("I want publish.....", job.data.orderId)
});

export { expirationQueue }