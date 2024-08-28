import { useState } from "react";
import Chatroom from "./Chatroom";

function Chat(){

    const [click, setClick] = useState('close');

    return(
        <>
            <div className="launcher">
                <button className="lau-button" onClick={()=>{click === 'close' ? setClick('open') : setClick('close')}}>
                    <div className="lau-contain">
                        <span className="lau-hide">채팅 버튼</span>
                        <div className={click === 'open' ? 'x' : 'lau-icon'}>
                        </div>
                    </div>
                </button>
            </div>
            {
                click === 'open' ? <Chatroom click={click} setClick={setClick}></Chatroom> : null 
            }
        </>
    )
}

export default Chat;