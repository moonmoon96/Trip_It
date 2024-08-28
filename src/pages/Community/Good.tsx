import { useNavigate } from "react-router-dom";

const Good = ({ onclose, good, setGood } : any) => {
   
    let navigate = useNavigate();

    function bye () {
        onclose(0);
        setGood(0);
        navigate('/');
    }
    
    return (
    <div className="valid">
        <div className="valid-modal">
            <div className="valid-modal-all">
                <p className="valid-modal-font">성공했습니다</p>
                <div className="valid-modal-button">
                    <button className="valid-modal-check" onClick={()=>{bye()}}>
                        확인
                    </button>
                </div>
            </div>
        </div>            
    </div>          
    );
  };

export default Good;