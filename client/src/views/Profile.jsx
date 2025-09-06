function Profile(e) {
    e.preventDefault();

    function showData() {
        try {
            fetch('http://localhost:5100/bread_network/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
        })
        } catch (error) {
            
        }
    }

  return (
    <div>
      <h1>Profile Page</h1>
      <div>
        <p>Name: {name}</p>
        <p>Email: {email}</p>
        <p>Last Name: {lastname}</p>
      </div>
    </div>
  );
}

export default Profile;