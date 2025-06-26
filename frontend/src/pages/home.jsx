import { Link } from 'react-router-dom';
import backgroundimage2 from '../assets/backgroundimage2.jpg'

const Home = () => {
  return (

    <div className="bg-cover bg-center min-h-screen text-white"
      style={{ backgroundImage: `url(${backgroundimage2})` }}>
    <div className=" bg-opacity-70 min-h-screen flex items-center justify-center px-4">
      <main className="max-w-4xl text-center space-y-8">
        <h1 className="text-4xl font-bold"> NASA Api Viewer</h1>

        {/* <img src={backgroundimage2} alt='a conjunction of comets' className='w-full max-h-[400px] object-contain max-w-4xl rounded-lg shadow-lg mb-4'
        /> */}
        <p className="text-lg text-gray-300">
          Discover Astronomy images and track near-Earth asteroids using NASA's public data.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-6">
          <Link
            to="/apod"
            className="bg-blue-900 hover:bg-blue-700 px-6 py-3 rounded-lg transition text-white font-semibold"
          >
            Astronomy Picture of the Day
          </Link>

          <Link
            to="/asteroid"
            className="bg-blue-900 hover:bg-blue-700 px-6 py-3 rounded-lg transition text-white font-semibold"
          >
            Explore Near-Earth Asteroids
          </Link>
        </div>

        <footer className="mt-12 text-sm text-gray-400">
          Built by Bill Twomey · Powered by NASA Open APIs
        </footer>
      </main>
    </div>
    </div>
  );
};

export default Home;