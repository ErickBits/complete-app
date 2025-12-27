import React, { useEffect, useState } from 'react';

function Profile({ name, email, lastname }) {
  // estado opcional para mostrar lo que trae la API
  const [user, setUser] = useState(null);

  // función showData 
  async function showData() {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5100/bread_network/profile', {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setUser(data); // guarda la respuesta para renderizarla
      return data;
    } catch (error) {
      console.error('Error en showData:', error);
      return null;
    }
  }

  // Ejecutar showData cuando el componente se monta (al entrar a /profile)
  useEffect(() => {
    showData();
    // opcional: exponer la función para poder llamarla manualmente desde la consola (solo para pruebas)
    // window.showData = showData;
  }, []); // [] => solo al montar

  return (
    <div>
      <h1>Profile Page</h1>
      <div>
        <p>Name: {user?.name ?? name}</p>
        <p>Email: {user?.email ?? email}</p>
        <p>Last Name: {user?.lastname ?? lastname}</p>
      </div>
    </div>
  );
}

export default Profile;
