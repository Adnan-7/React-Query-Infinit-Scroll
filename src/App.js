import { useEffect, useState } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import Photo from './Photo';
import { FaSearch } from 'react-icons/fa';

const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`;
const mainUrl = 'https://api.unsplash.com/photos/';
const searchUrl = 'https://api.unsplash.com/search/photos/';

// App Component
function App() {
  const [disa, setDisa] = useState(true);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');

  // Fetch Function
  const fetchPhotos = async () => {
    const urlPage = `&page=${page}`;
    const urlQuery = `&query=${query}`;

    let url;
    if (query) {
      url = `${searchUrl}${clientID}${urlPage}${urlQuery}`;
    } else {
      url = `${mainUrl}${clientID}${urlPage}`;
    }

    const { data } = await axios(url);
    if (query) {
      return data.results;
    }
    return data;
  };

  //Use qeury
  const { isLoading, isError, error, data, refetch } = useQuery(
    'photos',
    fetchPhotos
  );

  //  Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    refetch();
  };

  return (
    <main>
      <section className='search'>
        <form className='search-form'>
          <input
            type='text'
            className='form-input'
            placeholder='search'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type='submit' className='submit-btn' onClick={handleSubmit}>
            <FaSearch />
          </button>
        </form>
      </section>

      {isLoading ? (
        <h2 className='loading'>Loading...</h2>
      ) : isError ? (
        <h2 className='loading'>{error.message}</h2>
      ) : (
        <section className='photos'>
          <div className='photos-center'>
            {data?.map((photo, index) => {
              return <Photo key={index} {...photo} />;
            })}
          </div>
        </section>
      )}
    </main>
  );
}

export default App;
