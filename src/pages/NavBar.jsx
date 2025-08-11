import { Link, NavLink } from 'react-router-dom';



const NavBar = () => {
        return(
            <nav>
                <div className='left-links'>
                <NavLink to="/" className='navLink'>Home</NavLink>
                <NavLink to="/about" className='navLink'>About Us</NavLink>
                <NavLink to="/faqs" className='navLink'>FAQs</NavLink>
                <NavLink to="/contact" className='navLink'>Contact Us</NavLink>
                <NavLink to="/socials" className='navLink'>Social Links</NavLink>
                </div>

                <div className='right-links'>
                    <Link to="/login" className='navLink'>Log In</Link> | 
                    <Link to="/register" className='navLink'> Register</Link>
                </div>
            </nav>



        );
};

export default NavBar;