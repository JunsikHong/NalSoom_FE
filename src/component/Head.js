//css
import 'style/Head.css';

import { NavLink } from 'react-router-dom';

//icon
import { FaUser, FaBell } from "react-icons/fa6";

//images
import logo from 'images/nalsoomlogo.png';

export default function Head() {

    return (
        <div>
            <div className="head-wrap">
                <div className="head">
                    <div className='head-left'>
                        <ul className='head-logo-wrap'>
                            <li className='head-nalsoom'>
                                <NavLink to="/"><img className='head-logo' src={logo} alt='logo'/></NavLink>
                            </li>
                        </ul>
                    </div>
                    <div className='head-right'>
                        <ul className="head-content-wrap">
                            <li className="head-notification">
                                <FaBell size={25}/>
                            </li>
                            <li className="head-login">
                                <FaUser size={25}/>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}