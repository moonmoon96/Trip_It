import axios from "axios";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../../Utility/Cookie";

function Delete (props : any){
    
    const modalRef = useRef<HTMLDivElement>(null);
    const modalOutClick = (e : any) => {
        if(modalRef.current === e.target){
            props.setDel('')
        }
    }

    async function deletePost(){
        
        await axios.delete(process.env.REACT_APP_BASE_URL+`/community/communityDetail/delete/${props.postId}`,
            {
                headers : {
                    "Content-Type" : "application/json",
                    "Access" : `${localStorage.getItem('access')}`,
                    "Refresh" : `${getCookie("refresh")}`
                },
                withCredentials : true
            }
        )
        .then((response)=>{
            console.log('삭제함');
            navigate('/community');
        })
        .catch((err)=>{
            console.log('err' + err);
        }) 
    }

    let navigate = useNavigate();

    return(
        <>
            <div className="valid" ref={modalRef} onClick={(e)=>{modalOutClick(e)}}>
                <div className="valid-modal">
                    <div className="valid-modal-all">
                        <p className="valid-modal-font">정말 삭제하시겠습니까?</p>
                        <div className="valid-modal-button">
                            <button className="valid-modal-cancel" onClick={()=>{props.setDel(0)}}>
                                취소
                            </button>
                            <button className="valid-modal-check2" onClick={()=>{deletePost()}}>
                                확인
                            </button>
                        </div>
                    </div>
                </div>            
            </div>        
        </>
    )
}

export default Delete;