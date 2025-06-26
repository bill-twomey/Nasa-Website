import {Link} from 'react-router-dom'


const Header =() => {
    return (
        <header className="bg-black text-white py-4">
            <div className="max-w-6xl mx-auto flex flex-col items-center px-4 ">
           
            <nav className="space-x-4">
                
                   <Link to="/" className="hover:underline"> Home page</Link>
                    <Link to="/apod" className="hover:underline"> Astronomy Picture of the Day</Link>
                   <Link to="/asteroid" className="hover:underline">Asteroids - Near Earth Object</Link>
              
            </nav>
            </div>
        </header>

    )

}

export default Header