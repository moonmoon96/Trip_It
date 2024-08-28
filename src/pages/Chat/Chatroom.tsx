import axios from "axios";
import { useEffect, useState } from "react";

interface ChatroomProps {
    click : string;
    setClick : any;
}

function Chatroom({click, setClick} : ChatroomProps){

    const [chatRoomList, setChatRoomList] = useState([]);

    useEffect(()=>{
        const loadChatRoomHistory = async () => {
            try {
                const response =await axios.get('');
                const chatRoomList = response.data.map((i : any) => {
                    return;
                })
            }catch(err){
                console.log("채팅 내역 로드 실패", err)
            }
        };
        loadChatRoomHistory();
    }, []);
    
    return(
        <div className="chat-body">
            <div className="chat-frame">
                <div className="frame-pos">
                    <div className="pos-body">
                        <div className="body-header">
                            <h1 className="body-headerline">
                                <span className="headerline-font">Chat</span>
                            </h1>
                        </div>
                        <div className="body-main">
                            <span className="main-font">대화를 시작해보세요</span>
                        </div>
                        <div className="body-footer">
                            <div className="footer-body">
                                <span className="footer-font">1:1대화</span>
                                <div className="footer-img">
                                    <svg className="footer-chat" xmlns="http://www.w3.org/2000/svg">
                                        <path fill="currentColor" fill-rule="evenodd" d="M20.822 16.683c-.246.461-.265 1.011-.099 1.507l.638 1.915a1 1 0 0 1-1.264 1.265l-1.37-.457-.553-.184c-.493-.164-1.037-.145-1.496.1-1.949 1.039-4.275 1.461-6.73.967-4.002-.805-7.166-4.093-7.819-8.121A10.013 10.013 0 0 1 13.664 2.137c4.03.652 7.318 3.817 8.123 7.817.494 2.455.074 4.78-.965 6.729m-14.616-4.69c0 .744.609 1.353 1.353 1.353.745 0 1.353-.609 1.353-1.353S8.304 10.64 7.56 10.64c-.744 0-1.353.608-1.353 1.352m5.834 1.353a1.357 1.357 0 0 1-1.353-1.353c0-.744.61-1.352 1.353-1.352.745 0 1.353.608 1.353 1.352s-.609 1.353-1.353 1.353m3.128-1.353c0 .744.608 1.353 1.353 1.353.744 0 1.353-.609 1.353-1.353s-.61-1.352-1.353-1.352c-.745 0-1.353.608-1.353 1.352" clip-rule="evenodd"></path>
                                    </svg>                                        
                                </div>
                                <span className="footer-font">단체대화</span>
                            </div>                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chatroom;