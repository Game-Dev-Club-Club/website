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
                <Link to="/" onClick={closeMenu}>
                    Home
                </Link>

                <Link to="/contact-us" onClick={closeMenu}>
                    Contact Us
                </Link>
                
                <Link to="/map" onClick={closeMenu}>
                    Map
                </Link>

                <Link to="/jam" onClick={closeMenu}>
                    Jam
                </Link>


            </div>
        </>
    );
};

export default Navbar;