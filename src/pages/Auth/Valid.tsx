import { useRef } from "react";

function Valid(props : any){
    const modalRef = useRef<HTMLDivElement>(null);
    const modalOutClick = (e : any) => {
        if(modalRef.current === e.target){
            props.setValid('')
        }
    }

    return(
        <div className="valid" ref={modalRef} onClick={(e)=>{modalOutClick(e)}}>
            <div className="valid-modal">
                <div className="valid-modal-all">
                    <p className="valid-modal-font">이미 중복된 {props.val}입니다</p>
                    <div className="valid-modal-button">
                        <button className="valid-modal-check" onClick={()=>{props.setValid('')}}>
                            확인
                        </button>
                    </div>
                </div>
            </div>            
        </div>        
    )
}

export default Valid;