import React, {useEffect, useState} from 'react';

function Board(){
    const buttonsNameList = ['최신 순', '인기 순', '많이 본 순']
    const [clicked, setClicked] = useState(0);
    
    const toggleActive = (e: any) => {
        setClicked(() => {
          return e.target.value;
        });
      };

    return(
      <div className='option'>
          {buttonsNameList.map(function(a, i){
            return(
                <button value={i} className={'button' + (i == clicked ? "active" : "")} key={i} onClick={toggleActive}>
                    {a}
                </button>
            )
          })}
      </div>
    )
}

export default Board;