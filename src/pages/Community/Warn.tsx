import axios from "axios";
import { useRef } from "react";
import { getCookie } from "../../Utility/Cookie";

function Warn(props : any){

    async function collect() {
        await axios
            .post(process.env.REACT_APP_BASE_URL+`/community/communityDetail/CompletedPost/${props.postId}`,
            {},
            {
                headers : {
                    "Content-Type": "application/json",
                    "Access" : `${localStorage.getItem('access')}`,
                    "Refresh": `${getCookie('refresh')}`
                },
                withCredentials : true
            })
            .then((response)=>{
                console.log("성공" + response);
            })
            .catch((err)=>{
                console.log(err);
            })
    }

    const modalRef = useRef<HTMLDivElement>(null);
    const modalOutClick = (e : any) => {
        if(modalRef.current === e.target){
             props.setWarn(0);
        }
    }

    return(
        <div className="valid" ref={modalRef} onClick={(e)=>{modalOutClick(e)}}>
            <div className="valid-modal">
                <div className="valid-modal-all">
                    <p className="valid-modal-font">완료하면 복구가 불가능합니다.
                                                    <br></br>
                                                    진행하시겠습니까?
                    </p>
                    <div className="valid-modal-button">
                        <button className="valid-modal-cancel" onClick={()=>{props.setWarn(0); props.setOnclick(false);}}>
                            취소
                        </button>
                        <button className="valid-modal-check2" onClick={()=>{props.setWarn(0); props.setText('모집완료'); props.setOnclick(false); collect()}}>
                            확인
                        </button>
                    </div>
                </div>
            </div>            
        </div>
    )
}

export default Warn;