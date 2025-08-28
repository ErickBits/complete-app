import { useState } from "react";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";

function SignUp() {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');



    return (
        <div className="main-div">
        <div className="login-div">
            <h1>Log In Page</h1>
            <form className="login-form">
            <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
            />
            <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
            />
            <Button
                text={"Log In"}
            />
            </form>
        </div>
        </div>
    );
    }

export default SignUp;