import { useState } from "react";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";

function SignUp() {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');

    async function LogIn(e) {
    e.preventDefault();
        const Data = { email, password };

        try {
            const response = await fetch("http://localhost:5100/bread_network/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(Data)
            });

            // Leer el body UNA sola vez
            const result = await response.json();

            // Manejar error HTTP antes de usar result
            if (!response.ok) {
                throw new Error(result?.message || `HTTP ${response.status}`);
            }

            // Guardar token y continuar
            const token = result.token;
            if (token) localStorage.setItem('token', token);

            console.log('User logged:', result);
            alert('User logged successfully!');
            // aquí puedes redirigir o actualizar estado global
        } catch (error) {
            console.error('Error:', error);
            alert(`Login failed: ${error.message}`);
        }
    }


    return (
        <div className="main-div">
        <div className="login-div">
            <h1>Log In Page</h1>
            <form 
                className="login-form"
                onSubmit={LogIn}
                >
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
                type={"submit"}
                text={"Log In"}
            />
            </form>
        </div>
        </div>
    );
    }

export default SignUp;