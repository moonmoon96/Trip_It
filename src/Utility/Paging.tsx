import React, {useEffect, useState} from 'react';
import { SlArrowLeft } from "react-icons/sl";
import { SlArrowRight } from "react-icons/sl";

function Paging(){
    const [pagingNum, setPagingNum] = useState([1,2,3,4,5]);
    const [clicked, setClicked] = useState(0);
    
    const toggleActive = (e: any) => {
        setClicked(() => {
          return e.target.value;
        });
      };

    return(
        <div className='paging'>
            <button className='left-button'><SlArrowLeft></SlArrowLeft></button>
              <div className='paging-buttons'>
                {pagingNum.map(function(a, i){
                    return(
                        <button value={i} className={'paging-button'+(i == clicked ? "active" : "")} key={i} onClick={toggleActive}>
                            {a}
                        </button>                        
                    )
                })}
              </div>
            <button className='right-button'><SlArrowRight></SlArrowRight></button>
        </div>
    )
}

export default Paging;