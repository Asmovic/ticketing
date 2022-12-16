import "bootstrap/dist/css/bootstrap.css";
import Link from "next/link"


const LandingPage = ({ currentUser, tickets }) => {
    const ticketList = tickets.map(({id, title, price}) => {
        return (
            <tr key={id}>
                <td>{title}</td>
                <td>{price}</td>
                <td>
                    <Link href="/tickets/[ticketId]" as={`/tickets/${id}`}>
                        View
                    </Link>
                </td>
            </tr>
        )
    })
    return (
        <div>
            <h2>Tickets</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Link</th>
                    </tr>
                </thead>
                <tbody>{ticketList}</tbody>
            </table>
        </div>
    )
}

LandingPage.getInitialProps = async (context, client, currentUser) => {
    const { data } = await client.get("/api/tickets");
    return { tickets: data }
}

export default LandingPage;