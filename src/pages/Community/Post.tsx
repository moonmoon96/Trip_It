import React, {useEffect, useRef, useState} from 'react';
import calendar from './image/calendar.png';
import eye from './image/eye.png';
import chat from './image/chat.png';
import {Link} from 'react-router-dom';
import axios from 'axios';
import { Posts } from './InterfacePost';

function Post(){

  const [posts, setPosts] = useState<Posts[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostRef = useRef<HTMLDivElement | null>(null);

  function formatDate(dateString : any) {
    const date = new Date(dateString);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day =  ('0' + date.getDate()).slice(-2);

    return `${month}/${day}`;
}

function calculateAge(birthDate : any) {
  const birthYear = parseInt(birthDate.substring(0, 4), 10);
  const birthMonth = parseInt(birthDate.substring(4, 6), 10) - 1;
  const birthDay = parseInt(birthDate.substring(6, 8), 10);
  
  const today = new Date();
  let age = today.getFullYear() - birthYear;
  
  if (today.getMonth() < birthMonth || (today.getMonth() === birthMonth && today.getDate() < birthDay)) {
      age--;
  }
  
  return age;
}

function getAgeGroup(birthDate : any) {
  const age = calculateAge(birthDate);

  if (age < 10) {
      return '10대 미만';
  } else {
      const ageGroup = Math.floor(age / 10) * 10;
      return `${ageGroup}대`;
  }
}

function calculateDuration(startDate : any, endDate : any){
  const start = new Date(startDate);
  const end = new Date(endDate);

  let timeDifference = end.getTime() - start.getTime();

  let daysDifference = timeDifference / (1000 * 3600 * 24);

  daysDifference = Math.floor(daysDifference) + 1;

  return daysDifference + "일";
}

function changeGender(gender : any){
    if (gender === 'm') {
      return '남';
  } else if (gender === 'f') {
      return '여';
  }
}

const buttonsNameList = ['최신 순', '인기 순', '많이 본 순']
    const [clicked, setClicked] = useState(0);
    
    const toggleActive = (index: number) => {
        setClicked(index);
        setPage(0);
        setPosts([]);
      };

      useEffect(() => {
        const fetchPosts = async () => {
    
          setLoading(true);
          try {

            await new Promise(resolve => setTimeout(resolve, 500));

            const response = await axios.get(
              `${process.env.REACT_APP_BASE_URL}/community/communityList${clicked === 2 ? 'ByView' : ''}?page=${page}&size=8`
            );
            setPosts((prevPosts) => [...prevPosts, ...response.data]);
            setHasMore(response.data.length > 0);
          } catch (err) {
            console.error("Error", err);
          } finally {
            setLoading(false);
          }
        };
    
        fetchPosts();
      }, [clicked, page]);
      
      useEffect(() => {
        const options = {
          root: null, 
          rootMargin: '0px',
          threshold: 1.0,
        };
    
        const handleIntersect = (entries : any) => {
          const entry = entries[0];
          if (entry.isIntersecting && hasMore && !loading) {
            setPage((prevPage) => prevPage + 1);
          }
        };
    
        observer.current = new IntersectionObserver(handleIntersect, options);
    
        if (lastPostRef.current) {
          observer.current.observe(lastPostRef.current);
        }
    
        return () => {
          if (observer.current && lastPostRef.current) {
            observer.current.unobserve(lastPostRef.current);
          }
        };
      }, [hasMore, loading]);

    return(
      <>
        <div className='option'>
            {buttonsNameList.map(function(a, i){
              return(
                  <button value={i} className={'button' + (i == clicked ? "active" : "")} key={i} onClick={()=>toggleActive(i)}>
                      {a}
                  </button>
              )
            })}
        </div>
        <section className='post'>
            {posts.map((post, index) => (
            <div key={post.postId} className='post-col' ref={index === posts.length - 1 ? lastPostRef : null}>
              <Link
                to={{
                  pathname: `/detail`,
                  search: `?post=${post.postId}&user=${post.userId}`
                }}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
              <div className='post-col-head'>
                <div className='post-col-head-profile'>
                  <div className='post-profile-img'>
                    <img src={post.userpic || '/img/defaultImage.jpg'} alt='profile'></img>
                  </div>
                  <div className='post-profile-name'>
                    <p className='post-profile-name-font'>{post.nickname}</p>
                    <div className='post-profile-name-spec'>
                      <p className='post-profile-name-spec-font'>{getAgeGroup(post.birth)}</p>
                      <div className='post-profile-name-spec-dot'></div>
                      <p className='post-profile-name-spec-font'>{changeGender(post.gender)}</p>
                    </div>
                  </div>
                </div>
                <div className='post-col-head-bar'></div>
                <div className='post-col-head-duration'>
                  <div className='post-duration-bar'></div>
                  <div className='post-duration-img'>
                    <img src={calendar} alt="icon" className='post-duration-imgfile'></img>
                    <p className='post-duration-font'>여행기간</p>
                  </div>
                  <div className='post-duration-spec'>
                    <p className='post-duration-spec-day'>{calculateDuration(post.startDate, post.endDate)}</p>
                    <div className='post-duration-spec-dot'></div>
                    <p className='post-duration-spec-schedule'>
                      {formatDate(post.startDate)} - {formatDate(post.endDate)}
                    </p>                    
                  </div>
                </div>
              </div>
              <div className='post-col-img'>
                <div className='post-col-img-main'>
                  {post.postPic && (
                  <img 
                  src={post.postPic.startsWith('/img') ? `${post.postPic}` : `data:image/${post.postPic.substring(post.postPic.lastIndexOf('.') + 1)};base64, ${post.postPic}`}
                    alt='area_img' 
                    className='post-img-imgfile' 
                  />
                  )}
                </div>
                <div className='post-col-img-location'>
                  <div className='post-location-img'>
                    <svg width="13" height="17" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.7244 7.11371C12.7244 10.6866 6.49995 16.3557 6.49995 16.3557C6.49995 16.3557 0.275513 10.6866 0.275513 7.11371C0.275513 3.54077 3.06229 0.644341 6.49995 0.644341C9.93761 0.644341 12.7244 3.54077 12.7244 7.11371Z" fill="#008FF6"></path><ellipse cx="6.50063" cy="6.40462" rx="2.81106" ry="2.81106" fill="#fff"></ellipse></svg>
                  </div>
                  <p className='post-location-font'>{post.metroName}</p>
                </div>
                <div className={'post-col-hide' + (post.exposureStatus ? '' : 'no')}>
                  <div className='post-col-hide-left'>
                    <p className='post-left-font'>{post.exposureStatus ? '현재 모집중' : '모집완료'}</p>
                  </div>
                  <div className='post-col-hide-right'>
                    <div className='post-right-box'>
                      <img src={eye} alt='icon' className='post-hide-imgfile'></img>
                      <p className='post-right-font'>{post.viewCount}</p>
                    </div>
                    <div className='post-right-box'>
                      <img src={chat} alt='icon' className='post-hide-imgfile'></img>
                      <p className='post-right-font'>3</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='post-col-text'>
                <p className='post-text-title'>{post.postTitle}</p>
                <p className='post-text-body'>{post.postContent}</p>
              </div>
              </Link>
            </div>
            ))}
        </section>
        <div className='spinner-container'>
          {loading && <div className='spinner'></div>}
        </div>
        </>   
    )
}

export default Post;