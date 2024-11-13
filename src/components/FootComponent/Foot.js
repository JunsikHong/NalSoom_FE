//css
import '@Style/Foot.css';

//images
import nalsoomlogo from '@Images/nalsoomlogo.png';

export default function Foot() {

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section about">
                    <h2 className="logo">WeatherShelter</h2>
                    <p>Your go-to source for weather updates and shelter information. Stay safe and informed with our reliable and up-to-date data.</p>
                </div>
                <div className="footer-section contact">
                    <h3>Contact Us</h3>
                    <p>Email: nalsoom@nalsoom.com</p>
                    <p>Phone: 000=0000=0000</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2024 WeatherShelter | All Rights Reserved</p>
            </div>
        </footer>
    );
}