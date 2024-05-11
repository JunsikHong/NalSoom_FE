//css
import 'style/WeatherInfo.css'

//component
import * as componentDepth1 from './componentDepth1';

export default function WeatherInfo() {
    return (
        <>
            <div className="weather-info-container">
                <div className="weather-info">
                    <componentDepth1.Tempurature/>
                    <componentDepth1.FineDust/>
                </div>
            </div>
        </>
    );
}