//css
import 'style/Main.css'

//component
import * as component from 'component';

export default function Main() {

    return (
        <div>
            <div className='main-wrap'>
                <div className='main'>
                    <component.WeatherInfo/>
                    <component.MapInfo/>
                    <component.ShelterDetailInfo/>
                </div>
                <div className='main-etc'>
                    <component.Notification />
                    <component.Share />
                </div>
            </div>
        </div>
    );
}