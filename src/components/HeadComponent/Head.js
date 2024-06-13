//css
import '@Style/Head.css';

//lib
import { NavLink } from 'react-router-dom';

//icon
import { FaUser, FaBell } from "react-icons/fa6";

//images
import nalsoomlogo from '@Images/nalsoomlogo.png';

export default function Head() {

    return (
        <div>
            <div className="head-wrap">
                <div className="head">
                    <div className='head-left'>
                        <ul className='head-logo-wrap'>
                            <li className='head-nalsoom'>
                                <NavLink to="/"><img className='head-logo' src={nalsoomlogo} alt='logo'/></NavLink>
                            </li>
                        </ul>
                    </div>
                    <div className='head-right'>
                        <ul className="head-content-wrap">
                            <li className="head-notification">
                                <NavLink to="/notification"><FaBell size={25}/></NavLink>
                            </li>
                            <li className="head-login">
                                <NavLink to="/login"><FaUser size={25}/></NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}