import { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";

function Update() {

    const [email, setEmail] = useState(''); 
    const [name, setName] = useState(''); 
    const [lastname, setLastName] = useState(''); 
    const [password, setPassword] = useState('');   

    async function UpdateUser(e) {
        e.preventDefault();    

         const Data = [email,name,lastname,password];

         try {
            const response = await fetch("http://localhost:5100/bread_network/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(Data)
            });

            // Leer el body UNA sola vez
            const result = await response.json();

            // Manejar error HTTP 
            if (!response.ok) {
                throw new Error(result?.message || `HTTP ${response.status}`);
            }

            // Guardar token y continuar
            const token = result.token;
            if (token) localStorage.setItem('token', token);

            console.log('User updated:', result);
            alert('User updated successfully!');
            // aquí puedes redirigir o actualizar estado global
        } catch (error) {
            console.error('Error:', error);
            alert(`update failed: ${error.message}`);
        }
        
    }

    return (
        <div className="main-div">
        <div>
            <h1>Update Page</h1>
            <form 
            className="Update-form"
            onSubmit={UpdateUser}
            >
            <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
            />
            <Input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="jhon"
                required
            />
            <Input
                type="text"
                value={lastname}
                onChange={e => setLastName(e.target.value)}
                placeholder="Doe"
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
                text={"Register"}
            />
            </form>
        </div>
        </div>  
    );

}

export default Update;