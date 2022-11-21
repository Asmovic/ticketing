import { useState } from "react";
import axios from "axios";

export default () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const onSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.post("/api/users/signup", {
            email, password
        });

        console.log(response.data);
    }
    return <form onSubmit={onSubmit} className="container">
        <h1>Sign up</h1>
        <div className="form-group">
            <label>Email Address</label>
            <input value={email} onChange={(e)=> setEmail(e.target.value)} className="form-control" />
        </div>
        <div value={password} onChange={(e)=> setPassword(e.target.value)} className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" />
        </div>
        <button type="submit" className="btn btn-primary mt-3">Sign Up</button>
    </form>
}