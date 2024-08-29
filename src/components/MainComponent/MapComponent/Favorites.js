//css
import '@Style/Favorites.css'

//lib
import useLocationStore from '@Store/locationStore';

export default function Favorites() {

    const { setLocation } = useLocationStore();

    function selectLocation() {
        setLocation();
    }

    return (
        <div>
            <div className="favorites-wrap">
                <ul className="favorites">
                    <li className="favorites1">내위치</li>
                    <li className="favorites2">서울시 도봉구</li>
                    <li className="favorites3">서울시 강남구</li>
                    <li className="favorites4">서울시 서초구</li>
                    <li className="favorites5">서울시 구로구</li>
                </ul>      
            </div>
        </div>
    );
}