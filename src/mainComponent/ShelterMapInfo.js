//css
import 'style/MapInfo.css'

//component
import * as componentDepth1 from './mainComponentDepth1';

export default function MapInfo() {
    return(
        <div>
            <div className="map-info-container">
                <div className="map-info">
                    <componentDepth1.useKakaMapLoader/>
                    <componentDepth1.Shelter/>
                    <componentDepth1.MapData/>
                    <componentDepth1.Favorites/>
                </div>
            </div>
        </div>
    );
}