import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { useInfiniteQuery } from 'react-query';
import axios from 'axios';
import { useQuery } from 'react-query';
import Photo from './Photo';
import { FaSearch } from 'react-icons/fa';

const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`;
const mainUrl = 'https://api.unsplash.com/photos/';
const searchUrl = 'https://api.unsplash.com/search/photos/';

// App Component
function App() {
  const [query, setQuery] = useState('');

  // Fetch Function
  const fetchPhotos = async ({ pageParam = 1 }) => {
    const urlQuery = `&query=${query}`;
    const urlPage = `&page=${pageParam}`;

    let url;
    if (query) {
      url = `${searchUrl}${clientID}${urlPage}${urlQuery}`;
    } else {
      url = `${mainUrl}${clientID}${urlPage}`;
    }

    const response = await axios(url);

    const { data, headers } = response;
    let totalItems = headers['x-total'];

    let totalPages = Math.ceil(totalItems / 10);

    if (query) {
      console.log({ data: data.results, nextPage: pageParam + 1, totalPages });
      return { data: data.results, nextPage: pageParam + 1, totalPages };
    } else {
      console.log({ data: data, nextPage: pageParam + 1, totalPages });
      return { data, nextPage: pageParam + 1, totalPages };
    }
  };

  //Use qeury
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    refetch,
    isFetching,
  } = useInfiniteQuery('photos', fetchPhotos, {
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.nextPage < lastPage.totalPages) return lastPage.nextPage;
      return undefined;
    },
  });

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
          {isFetching && <h2 className='loading'>Loading...</h2>}
          <InfiniteScroll hasMore={hasNextPage} loadMore={fetchNextPage}>
            <div className='photos-center'>
              {data.pages.map((page) =>
                page.data.map((photo, index) => {
                  return <Photo key={index} {...photo} />;
                })
              )}
            </div>
          </InfiniteScroll>
          {isFetching && <h2 className='loading'>Loading...</h2>}
        </section>
      )}
    </main>
  );
}
export default App;
