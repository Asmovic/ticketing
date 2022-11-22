import { useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

export default () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { doRequest, errors } = useRequest({ url: "/api/users/signup", method: "post", 
    body: { email, password }, onSuccess: ()=> Router.push("/")})
    
    const onSubmit = async (e) => {
        e.preventDefault();
        doRequest();
    }
    return <form onSubmit={onSubmit} className="container">
        <h1>Sign In</h1>
        <div className="form-group">
            <label>Email Address</label>
            <input value={email} onChange={(e)=> setEmail(e.target.value)} className="form-control" />
        </div>
        <div value={password} onChange={(e)=> setPassword(e.target.value)} className="form-group mb-3">
            <label>Password</label>
            <input type="password" className="form-control" />
        </div>
        {errors}
        <button type="submit" className="btn btn-primary mt-3">Sign In</button>
    </form>
}