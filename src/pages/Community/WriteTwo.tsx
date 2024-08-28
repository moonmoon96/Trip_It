import axios from "axios";
import { useRef, useState } from "react"
import { getCookie } from "../../Utility/Cookie";
import { useNavigate } from "react-router-dom";

export default function WriteTwo(props : any){

    async function subPost(){
        await axios
            .post(process.env.REACT_APP_BASE_URL+"/community/submitPost",{
                userId : props.userId,
                scheduleId : props.scheduleId,
                postTitle : title,
                postContent : content,
                personnel : 1,
                postPic : file,
                recruitStatus : 1,
                viewCount : 0 ,
                exposureStatus : 1,               
            },
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
                console.log(props.scheduleId);
                navigate('/community');
                window.location.reload();
            })
            .catch((err)=>{
                console.log(err);
            })
    }

    let navigate = useNavigate();

    const modalRef = useRef<HTMLDivElement>(null);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState<string | null>(null);
    const [inputTitleCount, setInputTitleCount] = useState(0);
    const [inputContentCount, setInputContentCount] = useState(0);
    const [check, setCheck] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);

    if (file == null) {
        const randomNumber = getRandomNumber();
        setFile(`/img/metros/metro-${randomNumber}.jpg`);
    }

    function getRandomNumber() {
        const range = Math.random() < 0.5 ? 1 : 2;
      
        if (range === 1) {
          return Math.floor(Math.random() * 8) + 1;
        } else {
          return Math.floor(Math.random() * 9) + 31;
        }
      }

    const onTitleHandler = (e : any) => {
        setInputTitleCount(e.target.value.length);

        const newText = e.target.value;
        const processedText = newText.replace(/\r?\n|\r/g, '');
        setTitle(processedText);
    }

    const onContentHandler = (e: any) => {
        setInputContentCount(e.target.value.length);
    }

    const handleFileChange = (e : any) => {
        const file = e.target.files[0];
        if(file){
            const reader = new FileReader();
            reader.onload = (e : any) => {
                setSelectedFile(e.target.result);
                const base64String = reader.result?.toString().split(',')[1];
                setFile(base64String || null);
            };
            reader.readAsDataURL(file);
        }else{
            setSelectedFile(null);
            setFile(null);
        }
    }

    const handleRemovePreview = () => {
        setSelectedFile(null);
        const fileInput = document.getElementById('write-photo-input') as HTMLInputElement;
        if(fileInput){
            fileInput.value= '';
        }
    }

    return(
        <>
            <div className="write" ref={modalRef}>
                <div className="write-frame"></div>
                <div className="write-start">
                    <div className="write-white">
                        <div className="write-content2">
                            <div className="write-content-head">
                                <div className="write-header">
                                    <div className="write-back" onClick={()=>{props.setCheck(0)}}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 3L7 12L16 21" stroke="#252525" stroke-width="1.5"></path></svg>
                                    </div>
                                    <div className="write-header-title">
                                        <p className="font">"2/2 모집 상세"</p>
                                        <span className="write-header-title-sub">
                                            (필수)
                                        </span>
                                    </div>
                                    <div className="write-xx" onClick={()=>{props.setWrite(0)}}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" cursor="pointer"><path d="M4 4L20 20" stroke="#252525" stroke-width="1.5"></path><path d="M20 4L4 20" stroke="#252525" stroke-width="1.5"></path></svg>
                                    </div>
                                </div>
                                <div className="write-line">
                                    <div className="write-linegreen"></div>
                                    <div className="write-linegreen"></div>
                                </div>
                            </div>
                            <div className="write-content-body">
                                <div className="write-content-bodycheck">
                                    <div className="bodycheck-title">
                                        <div className="bodycheck-titlefont">
                                            제목
                                        </div>
                                        <p className={(inputTitleCount > 0 && inputTitleCount <5 ? 'bodycheck-titlecountred' : inputTitleCount >= 5 ? 'bodycheck-titlecountgreen' : 'bodycheck-titlecount')}>
                                            ({inputTitleCount}/100)
                                        </p>                                    
                                    </div>
                                    <div className="write-titlebody">
                                        <div className={"write-titlebody-ex" + (inputTitleCount != 0 ? 'no' : '')}>
                                            <span className={"write-titlebody-exfont"}>ex. 12월 3박 4일 제주 바다 보러가실 3분 구해요.</span>
                                            <div className={"write-titlebody-exsub"}>(최소 5자 이상 / 최대 100자 이내)</div>
                                        </div>                                
                                        <textarea className="write-titlebody-text" name="title" maxLength={100} value={title} onChange={(e)=>{onTitleHandler(e)}}></textarea>
                                    </div>
                                    <div className="write-titlebody-pad"></div>
                                </div>
                                <div className="controlheight"></div>
                                <div className="bodycheck-title">
                                    <div className="bodycheck-titlefont">
                                        내용
                                    </div>
                                    <p className={(inputContentCount > 0 && inputContentCount <20 ? 'bodycheck-titlecountred' : inputContentCount >= 20 ? 'bodycheck-titlecountgreen' : 'bodycheck-titlecount')}>
                                        ({inputContentCount}/1000)
                                    </p>                                    
                                </div>
                                <div className="write-titlebody">
                                    <div className={"write-titlebody-ex2" + (inputContentCount != 0 ? 'no' : '')}>
                                        <span className="write-titlebody-exfont">ex. 혼자에요, 맛집 탐방을 좋아하는 분들 찾아요! 걸어서 맛집 탐방 하려고 합니다^^</span>
                                        <div className="write-titlebody-exsub">(최소 20자 이상 / 최대 1000자 이내)</div>
                                    </div>
                                    <textarea className="write-content-text" name="content" maxLength={1000} value={content} onChange={(e)=>{onContentHandler(e); setContent(e.target.value)}}></textarea>
                                    <div className="write-photo">
                                        <div className="write-photobody">
                                            <div className="write-photo-content">
                                                <>
                                                    {selectedFile ? (
                                                        <div className="preview">
                                                            <img src={selectedFile} alt="preview" className="preview-image"></img>
                                                            <div className="preview-close" onClick={handleRemovePreview}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" cursor="pointer"><path d="M4 4L20 20" stroke="white" stroke-width="1.5"></path><path d="M20 4L4 20" stroke="white" stroke-width="1.5"></path></svg>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <label className="write-photo-label">
                                                            <input className="write-photo-input" id="write-photo-input" type="file" accept="image/*" onChange={handleFileChange}></input>
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M8.33286 11.4169C9.02321 11.4169 9.58286 10.8573 9.58286 10.1669C9.58286 9.47655 9.02321 8.91691 8.33286 8.91691C7.6425 8.91691 7.08286 9.47655 7.08286 10.1669C7.08286 10.8573 7.6425 11.4169 8.33286 11.4169ZM8.33286 12.9169C9.85164 12.9169 11.0829 11.6857 11.0829 10.1669C11.0829 8.64813 9.85164 7.41691 8.33286 7.41691C6.81407 7.41691 5.58286 8.64813 5.58286 10.1669C5.58286 11.6857 6.81407 12.9169 8.33286 12.9169Z" fill="#00ce7c"></path>
                                                                <mask id="mask0_197_358" maskUnits="userSpaceOnUse" x="2" y="4" width="20" height="16"><path d="M2.83286 6.66691C2.83286 5.56234 3.72829 4.66691 4.83286 4.66691H19.1662C20.2708 4.66691 21.1662 5.56234 21.1662 6.66691V17.3336C21.1662 18.4381 20.2708 19.3336 19.1662 19.3336H4.83286C3.72829 19.3336 2.83286 18.4381 2.83286 17.3336V6.66691Z" fill="#D9D9D9"></path></mask>
                                                                <g mask="url(#mask0_197_358)"><path fill-rule="evenodd" clip-rule="evenodd" d="M21.2553 16.6929L16.6019 11.7351C16.4129 11.5337 16.0965 11.5237 15.8951 11.7127L7.15014 19.9208C6.94879 20.1097 6.93877 20.4262 7.12775 20.6275L11.7812 25.5853C11.9702 25.7867 12.2866 25.7967 12.4879 25.6077L21.2329 17.3996C21.4343 17.2107 21.4443 16.8942 21.2553 16.6929ZM17.6956 10.7085C16.9396 9.90314 15.674 9.86305 14.8686 10.619L6.12358 18.8271C5.3182 19.583 5.27812 20.8487 6.03405 21.6541L10.6875 26.6119C11.4434 27.4173 12.7091 27.4574 13.5145 26.7014L22.2595 18.4933C23.0649 17.7374 23.1049 16.4717 22.349 15.6663L17.6956 10.7085Z" fill="#00ce7c"></path></g>
                                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M4.83383 4.66642H14.2498C14.6641 4.66642 14.9998 5.00221 14.9998 5.41642V5.41642C14.9998 5.83064 14.6641 6.16643 14.2498 6.16643H4.83383C4.55769 6.16643 4.33383 6.39028 4.33383 6.66643V12.2497C4.33383 12.6639 3.99805 12.9997 3.58383 12.9997V12.9997C3.16962 12.9997 2.83383 12.6639 2.83383 12.2497V6.66643C2.83383 5.56186 3.72926 4.66642 4.83383 4.66642ZM3.58383 15.9997C3.16962 15.9997 2.83383 16.3355 2.83383 16.7497V17.3331C2.83383 18.4377 3.72926 19.3331 4.83383 19.3331H19.1672C20.2717 19.3331 21.1672 18.4377 21.1672 17.3331V6.66643C21.1672 5.56186 20.2717 4.66642 19.1672 4.66642H18.7499C18.3356 4.66642 17.9998 5.00221 17.9998 5.41642V5.41642C17.9998 5.83064 18.3356 6.16643 18.7499 6.16643H19.1672C19.4433 6.16643 19.6672 6.39029 19.6672 6.66643V17.3331C19.6672 17.6092 19.4433 17.8331 19.1672 17.8331H4.83383C4.55769 17.8331 4.33383 17.6092 4.33383 17.3331V16.7497C4.33383 16.3355 3.99805 15.9997 3.58383 15.9997V15.9997Z" fill="#00ce7c"></path>
                                                            </svg>
                                                        </label>
                                                    )}
                                                </>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="controlpad"></div>
                                </div>                                
                            </div>
                            <div className="write-footer">
                                <button className={"write-button" + (inputTitleCount >= 5 && inputContentCount >= 20 ? "act" : "")} onClick={()=>{setCheck(1); subPost();}}>
                                    <span className="write-button-text">작성 완료</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
