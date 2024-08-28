import { useRef, useState } from "react";
import WriteTwo from './WriteTwo';

function GetSchedule(props : any) {

    const modalRef = useRef<HTMLDivElement>(null);

    const [click, setClick] = useState(-1);
    const [check, setCheck] = useState(0);

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
                                        일정 유형
                                    </div>
                                </div>
                                <div className="write-content-body">
                                    {props.list.slice(0, 5).map(function(a:any, i:number){
                                        return(
                                            <div className="getsc-name" key={i} onClick={()=>{setClick(i); props.setScheduleId(props.scheduleId.slice(0, 5)[i]);}}>
                                                <div className={"getsc-title" + (click == i ? 'act' : '')}>{a}</div>
                                                <div className={"getsc-checkbox" + (click == i ? 'act' : '')}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 13.6464L10.4118 20L21 4" stroke="white" stroke-width="1.5"></path></svg>
                                                </div>
                                            </div>
                                        )
                                    })} 
                                </div>
                                <div className="write-getsc-button">
                                    <button className={"write-button" + (click != -1 ? 'act' : '')} disabled={click==-1} onClick={()=>{setCheck(1)}}>
                                        <span className="write-button-text">선택완료</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                check == 1 ? <WriteTwo check={check} setCheck={setCheck} write={props.write} setWrite={props.setWrite} userId={props.userId} scheduleId={props.scheduleId} setScheduleId={props.setScheduleId}></WriteTwo> : null
            }
        </>
    )
}

export default GetSchedule;