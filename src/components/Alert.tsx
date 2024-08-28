const Alert = ({ message, onClose } : any) => {
    return (
    <div className="valid">
        <div className="valid-modal">
            <div className="valid-modal-all">
                <p className="valid-modal-font">{message}</p>
                <div className="valid-modal-button">
                    <button className="valid-modal-check" onClick={onClose}>
                        확인
                    </button>
                </div>
            </div>
        </div>            
    </div>          
    );
  };

export default Alert;