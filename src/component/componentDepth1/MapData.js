import * as componentDepth2 from './componentDepth2';
export default function MapData() {

    return (
        <div>
            <div className="map-wrap">
                <div className="map">
                    <componentDepth2.useKakaMapLoader/>
                </div>
            </div>
        </div>
    );
}
