import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Valid from "./Valid";
import { useNavigate } from "react-router-dom";

function Join(){

    let navigate = useNavigate();

    async function postInfo(e : any) {
        e.preventDefault(); 
        await axios
            .post(process.env.REACT_APP_BASE_URL+"/join",{
                email : inputValue.email,
                password : inputValue.pw,
                username : inputValue.name,
                nickname : inputValue.nick,
                gender : (inputValue.gender === '남' ? 'm' : 'f'),
                birth : inputValue.year + inputValue.month.replace('월', '').padStart(2, '0') + inputValue.date.replace('일', '').padStart(2, '0')
            }).then((response)=>{
                console.log("성공" + response)         
                navigate('/login/normal');
            }).catch((err)=>{
                const msg = err.response.data.code;

                    if(msg==1){
                        setVal('이메일')
                    } else if(msg==2){
                        setVal('닉네임')
                    } else {
                        setVal('')
                    }
                    console.log("에러" + msg); 
                
            })     
    }

    const [open, setOpen] = useState('');
    const [gender, setGender] = useState('성별');
    const [month, setMonth] = useState('월');
    const [date, setDate] = useState('일');
    const monthList = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
    const dateList = ['1일','2일','3일','4일','5일','6일','7일','8일','9일','10일','11일','12일','13일','14일','15일','16일','17일','18일','19일','20일','21일','22일','23일','24일','25일','26일','27일','28일','29일','30일','31일'];
    const [keepClicked, setKeepClicked] = useState(0);
    const [val, setVal] = useState('');

    const changeGender = (e : any) => {
        setGender(e.target.value === 1 ? '남' : '여');
        setOpen('');
    }

    const changeMonth = (e : any) => {
        setMonth(e.target.value+'월')
        setOpen('');
    }

    const changeDate = (e : any) => {
        setDate(e.target.value+'일');
        setOpen('');
    }

    const emailTag = useRef<HTMLInputElement>(null);

    useEffect(()=>{
        if(emailTag.current)
        emailTag.current.focus();
    },[])

    const [inputValue, setInputValue] = useState({
        email : '',
        validEmail : false,
        nonEmailDuplication : false,   //이메일 중복확인 여부
        pw : '',
        validPw : false,
        name : '',
        validName : false,
        nick : '',
        validNick : false,
        gender : '',
        validGender : false,
        year : '',
        validYear : false,
        month : '',
        validMonth : false,
        date : '',
        validDate : false
    })

    const submitRequirements = inputValue.email &&
                                inputValue.validEmail &&                                
                                inputValue.pw &&
                                inputValue.validPw &&
                                inputValue.name &&
                                inputValue.validName &&
                                inputValue.nick &&
                                inputValue.validNick &&
                                inputValue.gender &&
                                inputValue.validGender &&
                                inputValue.year &&
                                inputValue.validYear &&
                                inputValue.month &&
                                inputValue.validMonth &&
                                inputValue.date &&
                                inputValue.validDate &&
                                keepClicked == 1;    

    useEffect(() => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
        setInputValue(prev => ({ ...prev, validEmail: emailRegex.test(inputValue.email) }));
    }, [inputValue.email]);

    useEffect(() => {
        const pwRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,12}$/;
        setInputValue(prev => ({ ...prev, validPw: pwRegex.test(inputValue.pw) }));
    }, [inputValue.pw]);

    useEffect(() => {
        const nameRegex = /^[가-힣]{2,5}$/;        
        setInputValue(prev => ({ ...prev, validName: nameRegex.test(inputValue.name) }));
    }, [inputValue.name]);

    useEffect(() => {
        const nickRegex = /^[a-zA-Z가-힣0-9_]{2,20}$/;
        setInputValue(prev => ({ ...prev, validNick: nickRegex.test(inputValue.nick) }));
    }, [inputValue.nick]);

    useEffect(() => {
        setInputValue(prev => ({ ...prev, gender: gender, validGender: gender !== '' }));
    }, [gender]);

    useEffect(() => {
        const yearRegex = /^[0-9]{4}$/;
        setInputValue(prev => ({ ...prev, validYear: yearRegex.test(inputValue.year) }));
    }, [inputValue.year]);

    useEffect(() => {
        setInputValue(prev => ({ ...prev, month: month, validMonth: month !== '월' }));
    }, [month]);

    useEffect(() => {
        setInputValue(prev => ({ ...prev, date: date, validDate: date !== '일' }));
    }, [date]);
    
    return(
        <>
        <div className="join">
            <h3 className="join-title">회원가입</h3>
            <div className="join-body">
                <div className="join-body-title">
                    입력사항
                    <span className="join-body-title-sub">(필수)</span>
                </div>
                <div className="join-body-main">
                    <div className="join-body-input">
                        <input  value={inputValue.email} className={"join-body-inputbox" + (inputValue.validEmail === true ? 'confirm' : '')}  ref={emailTag} type="text" placeholder="이메일 주소" onChange={(e)=>setInputValue({...inputValue, email:e.target.value})}></input>
                    </div>
                    <div className="join-body-input">
                        <input value={inputValue.pw} className={"join-body-inputbox" + (inputValue.validPw === true ? 'confirm' : '')} type="password" placeholder="비밀번호(8자~12자, 영문+숫자+특수문자 사용)" onChange={(e)=>setInputValue({...inputValue, pw:e.target.value})}></input>
                    </div>
                    <div className="join-body-input">
                        <input value={inputValue.name} className={"join-body-inputbox" + (inputValue.validName === true ? 'confirm' : '')} type="text" placeholder="이름" onChange={(e)=>setInputValue({...inputValue, name:e.target.value})}></input>
                    </div>
                    <div className="join-body-input">
                        <input value={inputValue.nick} className={"join-body-inputbox" + (inputValue.validNick === true ? 'confirm' : '')} type="text" placeholder="닉네임" onChange={(e)=>setInputValue({...inputValue, nick:e.target.value})}></input>
                    </div>
                    <div className="join-body-input">
                        <li className={"join-li" + (inputValue.gender === '성별' ? '' : 'confirm')} onClick={()=>setOpen('gender')}>{gender}</li>
                        <ul className={"join-ul" + (open === 'gender' ? "-gender" : "")}>
                            <li className="join-ul-li" value={1} onClick={changeGender}>남</li>
                            <li className="join-ul-li" value={2} onClick={changeGender}>여</li>
                        </ul>
                    </div>
                    
                    <div className="join-body-grid">
                        <div className="join-body-grid-year">
                            <input value={inputValue.year} className={"join-body-year-font" + (inputValue.validYear === true ? 'confirm' : '')} type="text" placeholder="년(예 1996)" maxLength={4} onChange={(e)=>setInputValue({...inputValue, year:e.target.value})}></input>
                        </div>
                        <div className="join-body-input">
                            <li className={"join-li" + (inputValue.month === '월' ? '' : 'confirm')} onClick={()=>setOpen('month')}>{month}</li>
                            <ul className={"join-ul" + (open === 'month' ? "-month" : "")}>
                                {monthList.map(function(a,i){
                                    return(
                                        <li className="join-ul-li" value={i+1} key={i} onClick={changeMonth}>{a}</li>                                
                                    )
                                })}
                                
                            </ul>
                        </div>
                        <div className="join-body-input">
                            <li className={"join-li"  + (inputValue.date === '일' ? '' : 'confirm')} onClick={()=>setOpen('date')}>{date}</li>
                            <ul className={"join-ul" + (open === 'date' ? "-date" : "")}>
                                {dateList.map(function(a,i){
                                    return(
                                        <li value={i+1} className="join-ul-li" key={i} onClick={changeDate}>{a}</li>            
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="join-body-footer">
                    <div className="join-body-footer-agree">
                        <button className={"keep-button" + (keepClicked === 1 ? 'able' : '')} onClick={()=>{keepClicked === 0 ? setKeepClicked(1) : setKeepClicked(0)}}>
                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 6.65217L5.58333 11L12 1" stroke="#fff" stroke-width="1.5"></path></svg>
                        </button>
                        <p className="join-agree-font" onClick={()=>{keepClicked === 0 ? setKeepClicked(1) : setKeepClicked(0)}}>이용약관 동의</p>
                    </div>
                </div>
                <button type="submit" className={"join-body-button" + (submitRequirements === true ? 'active' : '')} onClick={postInfo} disabled={!submitRequirements}>회원가입</button>
            </div>
        </div>
        {
            val == '이메일' ? <Valid val={val} setValid={setVal}></Valid> : val == '닉네임' ? <Valid val={val} setValid={setVal}></Valid> : null                      
        }
        </>
    )
}

export default Join;