import axios from "axios";
import { useRef, useState } from "react";
import { getCookie } from "Utility/Cookie";
import Good from "./Good";

function Cut(props : any){

    const modalRef = useRef<HTMLDivElement>(null);
    const modalOutClick = (e : any) => {
        if(modalRef.current === e.target){
             props.setCut(0)
        }
    }

    const [good, setGood] = useState(0);

    async function doCut(){
        await axios
            .post(
                process.env.REACT_APP_BASE_URL + "/add",
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                    Access: `${localStorage.getItem("access")}`,
                    Refresh: `${getCookie("refresh")}`,
                  },
                  withCredentials: true,
            }
        )
        .then((response) => {
            console.log("cut res : " + response);
            setGood(1);
        })
        .catch((err) => {
            console.log("cut err : " + err);
        })
    }

    return(
        <>
        <div className="valid" ref={modalRef} onClick={(e)=>{modalOutClick(e)}}>
            <div className="valid-modal">
                <div className="valid-modal-all">
                    <p className="valid-modal-font">정말 차단하시겠습니까?</p>
                    <div className="valid-modal-button">
                        <button className="valid-modal-cancel" onClick={()=>{props.setCut(0)}}>
                            취소
                        </button>
                        <button className="valid-modal-check2" onClick={()=>{doCut()}}>
                            확인
                        </button>
                    </div>
                </div>
            </div>            
        </div>
        {
          good == 1 ? (<Good onclose={props.setCut} good={good} setGood={setGood}></Good>) : null  
        }
        </>
    )
}

export default Cut;