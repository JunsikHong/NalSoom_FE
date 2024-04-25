//css
import 'style/MapInfo.css'

//component
import * as componentDepth1 from './componentDepth1';

export default function MapInfo() {
    return(
        <div>
            <div className="map-info-container">
                <div className="map-info">
                    <componentDepth1.Shelter/>
                    <componentDepth1.Map/>
                    <componentDepth1.Favorites/>
                </div>
            </div>
        </div>
    );
}