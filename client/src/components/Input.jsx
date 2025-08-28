function Inputs({placeholder,value,onChange,type}) {

  return (
    <div>
      <input 
        className="input" 
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        />
    </div>
  );
}   

export default Inputs;