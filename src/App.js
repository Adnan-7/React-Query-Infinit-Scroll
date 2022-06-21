import axios from 'axios';
import { useQuery } from 'react-query';
import Photo from './Photo';
import { FaSearch } from 'react-icons/fa';

const clientId = '?client_id=v5wSKgw6sq_2PTU5dI2fEh0fbI4eXmGq-MnOeMJX2TA';
const mainUrl = 'https://api.unsplash.com/photos/';
const searchUrl = 'https://api.unsplash.com/search/photos/';

const fetchPhotos = async () => {
  try {
    const { data } = await axios(`${mainUrl}${clientId}`);

    return data;
  } catch (error) {
    console.log(error.message);
  }
};

function App() {
  const { isLoading, isError, data, isSuccess, isFetching } = useQuery(
    'photos',
    fetchPhotos
  );
  if (isError) {
    return <h2 className='loading'>Error...</h2>;
  }

  return (
    <main>
      <section className='search'>
        <form className='search-form'>
          <input type='text' className='form-input' placeholder='search' />
          <button type='submit' className='submit-btn'>
            <FaSearch />
          </button>
        </form>
      </section>

      <section className='photos'>
        <div className='photos-center'>
          {data?.map((photo, index) => {
            return <Photo key={index} {...photo} />;
          })}
        </div>
        {isLoading && <h2 className='loading'>Loading...</h2>}
      </section>
    </main>
  );
}

export default App;
