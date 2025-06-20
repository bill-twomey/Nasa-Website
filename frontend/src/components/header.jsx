import {Link} from 'react-router-dom'


const Header =() => {
    return (
        <header className="bg-black text-white ">
            <h1 className='font-bold text-center'>Nasa website</h1>
            <nav className="">
                <ul className='flex flex-row justify-center space-x-6' >
                    <li><Link to="/"> Home page</Link></li>
                    <li><Link to="/apod"> Apod page</Link></li>
                    <li><Link to="/asteroid">Asteroid page</Link></li>
                </ul>
            </nav>
        </header>

    )

}

export default Header