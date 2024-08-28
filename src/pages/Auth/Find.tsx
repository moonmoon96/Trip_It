import { useRef } from "react";

function Find(props : any){

    const modalRef = useRef<HTMLDivElement>(null);
    const modalOutClick = (e : any) => {
        if(modalRef.current === e.target){
            props.setFind('');
        }
    }

    return(
        <div className="find" ref={modalRef} onClick={(e)=>{modalOutClick(e)}}>
            <div className="find-modal">
                <div className="find-modal-all">
                    <div className="find-modal-main">
                        <p className="find-modal-text">{props.find}</p>
                    </div>
                    <div className="find-modal-input"> 
                        <input className="find-modal-inputbox" type="text" placeholder="이름"></input>
                    </div>
                    <div className="find-modal-input">
                        <input className="find-modal-inputbox" type="text" placeholder="생년월일 (예) 19961104)"></input>
                    </div>
                    <div className="find-modal-footer">
                        <button className="find-modal-cancel" onClick={()=>{props.setFind('')}}>
                            취소
                        </button>
                        <button className="find-modal-auth">
                            인증하기
                        </button>
                    </div>
                </div>
            </div>            
        </div>        
    )
}

export default Find;