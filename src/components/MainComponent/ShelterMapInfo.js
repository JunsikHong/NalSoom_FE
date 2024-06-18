//css
import '@Style/ShelterMapInfo.css'

//component
import MapData from '@/components/MainComponent/MapComponent/MapData';
import Favorites from '@/components/MainComponent/MapComponent/Shelter';
import Shelter from '@/components/MainComponent/MapComponent/Favorites';

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