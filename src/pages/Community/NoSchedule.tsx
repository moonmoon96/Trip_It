import { useRef, useState } from "react";
import WriteTwo from './WriteTwo';
import { useNavigate } from "react-router-dom";

function NoSchedule(props : any) {

    const modalRef = useRef<HTMLDivElement>(null);

    const [click, setClick] = useState(-1);
    const [check, setCheck] = useState(0);

    let navigate = useNavigate();

    return(
        <>
            <div className="write" ref={modalRef}>
                <div className="write-frame"></div>
                <div className="write-start">
                    <div className="write-white">
                        <div className="write-content">
                            <div className="write-content-head">
                                <div className="write-header">
                                    <div className="write-back" onClick={()=>{props.setClick(0)}}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 3L7 12L16 21" stroke="#252525" stroke-width="1.5"></path></svg>
                                    </div>
                                    <div className="write-getsc">
                                        저장된 일정이 없습니다.
                                    </div>
                                </div>
                                <div className="write-content-body">
                                    <br></br><br></br><br></br><br></br><br></br>
                                </div>
                                <div className="write-getsc-button">
                                    <button className={"write-buttonact"} onClick={()=>{props.setWrite(0); props.setNav(0); navigate('/planner');}}>
                                        <span className="write-button-text">일정 만들러 가기</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </>
    )
}

export default NoSchedule;