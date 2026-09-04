import { useState } from 'react';
import { NavLink } from 'react-router-dom';
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
                <NavLink to="/" end onClick={closeMenu} className="mt-2">
                    Home
                </NavLink>

                <NavLink to="/contact-us" onClick={closeMenu} className="mt-2">
                    Contact Us
                </NavLink>

                <NavLink to="/map" onClick={closeMenu} className="mt-2">
                    Map
                </NavLink>

                <NavLink to="/jam" onClick={closeMenu} className="mt-2">
                    Jam
                </NavLink>

                <NavLink to="/sponsors" onClick={closeMenu} className="mt-2">
                    Sponsors
                </NavLink>


            </div>
        </>
    );
};

export default Navbar;