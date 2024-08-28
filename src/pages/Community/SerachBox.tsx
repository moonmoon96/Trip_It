import { useState } from "react";
import SearchResult from "./SearchResult";
import { Posts } from "./InterfacePost";

interface SearchBoxProps {
    value: string;
    debouncedQuery: string | number;
    countries: Posts[];
    searching: boolean;
    setSearching: React.Dispatch<React.SetStateAction<boolean>>;
    onchange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    metroId: number;
    setMetroId: React.Dispatch<React.SetStateAction<number>>;
}

function SearchBox({value, debouncedQuery, countries, searching, setSearching, onchange, metroId, setMetroId}: SearchBoxProps){
    
    const [metro, setMetro] = useState(['도시 검색' , '전체', '서울', '인천', '대전', '대구', '광주', '부산', '울산', '세종', '경기도', '강원도', '충청북도', '충청남도', '경상북도', '경상남도', '전라북도', '전라남도', '제주도']);
    const [focused, setFocused] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [searchValue, setSearchValue] = useState(metro[0]);

    const handleInputFocus = () => {
        setFocused(true);
    };

    const handleInputBlur = () => {
        setFocused(false);
    };

    const handleButtonClick = (value : any) => {
        setSearchValue(value);
        setIsVisible(false);   
    };

    const handleMetro = (e : number) => {
        if(e<9){
            setMetroId(e);
        }else{
            setMetroId(e+22);
        }
    }

    const handleVisible = (e : any) => {
        e.preventDefault();
        setIsVisible(prevState => !prevState);
    }

    return(
        <>
            <div className="sea-rel">
                <div className="sea-rel-atm">
                    <div className="sea-rel-jb">
                        <div className="sea-rel-ho" onClick={(e)=>{handleVisible(e)}}>
                            <label className="sea-rel-di">
                                <div className="sea-rel-mk">
                                    <div className="sea-rel-ik">
                                        여행지
                                    </div>
                                    <input className="sea-rel-kh" autoComplete="off" autoCorrect="off" type="search" placeholder={searchValue} value={searchValue} readOnly>
                                    </input>
                                </div>                                
                            </label>
                        </div>
                        <div className={`sea-rel-fq ${isVisible ? 'visible' : 'hidden'}`}>
                            <div className="sea-rel-vq">
                                <div className="sea-rel-tc">
                                    <div className="sea-rel-p5">
                                        <div className="sea-rel-kb">
                                            <div className="sea-rel-bl">
                                                <div className="sea-rel-gq">
                                                    한국
                                                </div>
                                                <div className="sea-rel-wa">
                                                    <div className="sea-rel-fw">
                                                {
                                                    metro.slice(1).map((a, i)=>(
                                                                <div className="sea-rel-ks" key={i}>
                                                                    <button className="sea-rel-bu" onClick={()=>{handleButtonClick(a); handleMetro(i);}}>
                                                                        <div className="sea-rel-id">
                                                                            <div className="sea-rel-eo">
                                                                                {metro[i+1]}
                                                                            </div>                                                                
                                                                        </div>                                                                
                                                                    </button>
                                                                </div>
                                                    ))
                                                }                                
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="sea-rel-lin"></div>
                        <div className="sea-rel-ho">
                            <label className="sea-rel-di">
                                <div className="sea-rel-mk">
                                    <div className="sea-rel-ik">검색어</div>
                                    <input className="sea-rel-kh" value={value} autoComplete="off" autoCorrect="off" type="search" placeholder="검색어를 입력하세요" maxLength={20} onChange={onchange} onFocus={handleInputFocus} onBlur={handleInputBlur}></input>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            {
                <SearchResult debouncedQuery={debouncedQuery} countries={countries} searching={searching} setSearching={setSearching} focused={focused} metroId={metroId}></SearchResult>
            }
        </>
    )
}

export default SearchBox;