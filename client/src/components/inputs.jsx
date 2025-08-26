function Inputs(props) {
    
    const IsPassword = value => {
        return value === 'password';
    };
    
  return (
    <div>
      <input 
        className="input" 
        type={`${IsPassword(props.children) ? 'text' : 'password'}`} />
    </div>
  );
}   

export default Inputs;