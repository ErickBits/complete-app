function Button({type,text}) {
    return(
        <div className="btn-container">
            <button 
                class="btn-effect-5"
                type={type}
            >
            {text}</button>
        </div>
    );
}

export default Button;