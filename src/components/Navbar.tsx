import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(prev => !prev);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    return (
        <>
            <button
                className={`hamburger ${isOpen ? 'active' : ''}`}
                onClick={toggleMenu}
                aria-label="Toggle navigation"
            >
                <span />
                <span />
                <span />
            </button>

            <div className={`ml-5 font-cascadia side-menu ${isOpen ? 'open' : ''}`}>
                <Link to="/" onClick={closeMenu} className="mt-2">
                    Home
                </Link>

                <Link to="/contact-us" onClick={closeMenu} className="mt-2">
                    Contact Us
                </Link>

                <Link to="/map" onClick={closeMenu} className="mt-2">
                    Map
                </Link>

                <Link to="/jam" onClick={closeMenu} className="mt-2">
                    Jam
                </Link>


            </div>
        </>
    );
};

export default Navbar;