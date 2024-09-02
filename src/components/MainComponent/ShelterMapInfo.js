//css
import '@Style/ShelterMapInfo.css'

//component
import MapData from '@MapComponent/MapData';
import Favorites from '@MapComponent/Shelter';
import Shelter from '@MapComponent/Favorites';

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