import { Ticket } from "../ticket";

it("implements optimistic concurrency control", async()=> {
    // Create an instance of a ticket
    const ticket = Ticket.build({
        title: "Quran Recitation",
        price: 10,
        userId: "1427"
    })

    // Save the ticket to the database
    await ticket.save();

    // Fetch the ticket twice
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    // Make two separate changes to the tickets we fetched
    firstInstance!.set({ price: 90})
    secondInstance!.set({ price: 70})

    // Save the first fetched ticket
    await firstInstance!.save();

    // Save the second fetched ticket and expect an error
    try {
        await secondInstance!.save();
    } catch(err) {
        console.log(err);
        return;
    }
    
    throw new Error("Should never reach this point.");

});

it("increments the version number on multiple saves", async()=> {
    // Create an instance of a ticket
    const ticket = Ticket.build({
        title: "Quran Recitation",
        price: 10,
        userId: "1427"
    });

    // Save the ticket to the database multiple times
    await ticket.save();
    expect(ticket.version).toEqual(0)
    await ticket.save();
    expect(ticket.version).toEqual(1)
    await ticket.save();
    expect(ticket.version).toEqual(2)
})