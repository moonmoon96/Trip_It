import banner from './image/banner.webp';
import Post from './Post';
import Paging from '../../Utility/Paging';
import SearchBox from './SerachBox';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Posts } from './InterfacePost';

function Community() {

  const [msg, setMsg] = useState('');
  const [city, setCity] = useState([]);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [countries, setCountries] = useState<Posts[]>([]);
  const [searching, setSearching] = useState(false);
  const [metroId, setMetroId] = useState(0);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setSearching(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/community/communitySearch?metroId=${metroId}&query=${debouncedQuery}`);
        if (response.data.length === 0) {
          setMsg('none');
        } else {
          setCountries(response.data);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setSearching(false);
      }
    };

    if (debouncedQuery !== '') {
      fetchSearchResults();
    } else {
      setCountries([]);
    }

  }, [debouncedQuery]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [query]);

    return (
      <>         
        <div className='community'>        
          <div className='top'>
            <div className='top-banner'>
              {/* <img src={banner} alt='banner' className='banner'></img>           */}
            </div>
            <div className='search'>
                <SearchBox value={query} debouncedQuery={debouncedQuery} countries={countries} searching={searching} setSearching={setSearching} metroId={metroId} setMetroId={setMetroId} onchange={(e) => setQuery(e.target.value)}></SearchBox>
            </div>

            <div className='bar'></div>
  
            <div className='main'>
              <Post></Post>
            </div>
            
          </div>
        </div>
      </>
    );
  }
  
  export default Community;
  