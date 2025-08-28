import { useState } from "react";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";

function Register() {

  const [email,setEmail] = useState('');
  const [name,setName] = useState('');
  const [lastname,setLastName] = useState('');
  const [password,setPassword] = useState('');

  async function RegisterUser(e) {
    e.preventDefault();

    const Data = {
      email,
      name,
      lastname, // ← match the backend key
      password
    };

    try {
      const response = await fetch('http://localhost:5100/bread_network/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(Data)
      })

      if(!response.ok) throw new Error('Network response was not ok');

      const result = await response.json();
      console.log('User registered:', result);
      alert('User registered successfully!');  

    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <div className="main-div">
      <div>
        <h1>Register Page</h1>
        <form 
          className="Register-form"
          onSubmit={RegisterUser}
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

export default Register;