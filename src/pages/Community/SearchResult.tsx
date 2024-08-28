import {Link} from 'react-router-dom';
import calendar from './image/calendar.png';
import eye from './image/eye.png';
import chat from './image/chat.png';
import { Posts } from './InterfacePost'
import { useEffect, useRef, useState } from 'react';

function SearchResult({ debouncedQuery, countries, searching, setSearching, focused, metroId }: { debouncedQuery: string | number ,countries: Posts[], searching: boolean, setSearching: React.Dispatch<React.SetStateAction<boolean>>, focused: boolean, metroId : number }){

  const [filteredCountries, setFilteredCountries] = useState<Posts[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    focused == true ? setOpen(true) : setOpen(true);

    const fetchData = async () => {
      setSearching(true);
      try {
        const validCountries = Array.isArray(countries) ? countries : [];
        const filtered = metroId === 0
          ? validCountries
          : validCountries.filter(post => post.metroId === String(metroId));
        setFilteredCountries(filtered);
      } catch (error) {
        console.error('err', error);
      } finally {
        setSearching(false);
      }
    };

    fetchData();
  }, [metroId, countries, setSearching]);

  if (debouncedQuery === '') {
    return <div className='searching'></div>
  }
  
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

return(
    <div className={'searching' + ( open == true ? 'active' : '')} ref={searchRef} aria-busy={searching}>
              {filteredCountries.length > 0 ? (
              <>
                <div>총 {filteredCountries.length}개의 검색결과가 있습니다.</div>
                <ul className='search-ul'>
                {filteredCountries.map(({postId, userId, userpic, nickname, gender, birth, startDate, endDate, metroId, postTitle, postContent, personnel, postPic, exposureStatus, viewCount, metroName})=>(
                    <li>
                      <section className='post'>
                        <div className='post-col'>
                          <Link
                            to={{
                              pathname: `/detail`,
                              search: `?post=${(postId)}&user=${(userId)}`
                            }}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                          >
                          <div className='post-col-head'>
                            <div className='post-col-head-profile'>
                              <div className='post-profile-img'>
                                <img src={userpic || '/img/defaultImage.jpg'} alt='profile'></img>
                              </div>
                              <div className='post-profile-name'>
                                <p className='post-profile-name-font'>{nickname}</p>
                                <div className='post-profile-name-spec'>
                                  <p className='post-profile-name-spec-font'>{getAgeGroup(birth)}</p>
                                  <div className='post-profile-name-spec-dot'></div>
                                  <p className='post-profile-name-spec-font'>{changeGender(gender)}</p>
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
                                <p className='post-duration-spec-day'>{calculateDuration(startDate, endDate)}</p>
                                <div className='post-duration-spec-dot'></div>
                                <p className='post-duration-spec-schedule'>
                                  {formatDate(startDate)} - {formatDate(endDate)}
                                </p>                    
                              </div>
                            </div>
                          </div>
                          <div className='post-col-img'>
                            <div className='post-col-img-main'>
                              {postPic && (
                              <img 
                                src={postPic.startsWith('/img') ? `${postPic}` : `data:image/${postPic.substring(postPic.lastIndexOf('.') + 1)};base64, ${postPic}`}
                                alt='area_img' 
                                className='post-img-imgfile' 
                              />
                              )}
                            </div>
                            <div className='post-col-img-location'>
                              <div className='post-location-img'>
                                <svg width="13" height="17" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.7244 7.11371C12.7244 10.6866 6.49995 16.3557 6.49995 16.3557C6.49995 16.3557 0.275513 10.6866 0.275513 7.11371C0.275513 3.54077 3.06229 0.644341 6.49995 0.644341C9.93761 0.644341 12.7244 3.54077 12.7244 7.11371Z" fill="#008FF6"></path><ellipse cx="6.50063" cy="6.40462" rx="2.81106" ry="2.81106" fill="#fff"></ellipse></svg>
                              </div>
                              <p className='post-location-font'>{metroName}</p>
                            </div>
                            <div className='post-col-hide'>
                              <div className='post-col-hide-left'>
                                <p className='post-left-font'>{personnel}명 모집중</p>
                              </div>
                              <div className='post-col-hide-right'>
                                <div className='post-right-box'>
                                  <img src={eye} alt='icon' className='post-hide-imgfile'></img>
                                  <p className='post-right-font'>{viewCount}</p>
                                </div>
                                <div className='post-right-box'>
                                  <img src={chat} alt='icon' className='post-hide-imgfile'></img>
                                  <p className='post-right-font'>3</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className='post-col-text'>
                            <p className='post-text-title'>{postTitle}</p>
                            <p className='post-text-body'>{postContent}</p>
                          </div>
                          </Link>
                        </div>
                        
                    </section>
                    </li>
                  ))}
                </ul>
                </>
                ) : (
                  searching ? (
                    "잠시만 기다려주세요. 검색하고 있습니다."
                  ) : (
                    "검색 결과가 없습니다."
                  )
                )}
    </div>
)

}

export default SearchResult;