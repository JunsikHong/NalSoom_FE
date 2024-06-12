//css
import '@Style/MapInfo.css'

//component
import MapData from '@MapComponent/MapData';
import Favorites from '@MapComponent/MapData';
import Shelter from '@MapComponent/MapData';

export default function MapInfo() {
    return(
        <div>
            <div className="map-info-container">
                <div className="map-info">
                    <Shelter/>
                    <MapData/>
                    <Favorites/>
                </div>
            </div>
        </div>
    );
}