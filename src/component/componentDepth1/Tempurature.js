import 'style/WeatherInfo.css';
import * as componentDepth2 from './componentDepth2';

export default function Tempurature() {
    return (
        <div>
            <div className="tempurature-wrap">
                <componentDepth2.useForecasteInformation></componentDepth2.useForecasteInformation>
                <div className="weather-image-wrap">
                    해
                </div>
                <div className="weather-tempurature">
                    26도
                </div>
            </div>
        </div>
    );
}