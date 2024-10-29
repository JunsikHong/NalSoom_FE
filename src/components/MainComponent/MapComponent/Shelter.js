//css
import '@Style/Shelter.css'

//lib
import useShelterStore from '@Store/shelterStore';

export default function Shelter() {

    const { setCurrentShelterType } = useShelterStore();
    
    function shelterTypeClick(clickType) {
        setCurrentShelterType(clickType);
    }
    
    return(
        <div>
            <div className="shelter-wrap">
                <ul className="shelter">
                    {/* <li className="total-centre" onClick={() => {shelterTypeClick('totalCentre')}} >전체</li> */}
                    <li className="cooling-centre" onClick={() => {shelterTypeClick('coolingCentre')}} >무더위쉼터</li>
                    <li className="heating-centre" onClick={() => {shelterTypeClick('heatingCentre')}}>한파쉼터</li>
                    <li className="finedust-shelter" onClick={() => {shelterTypeClick('finedustShelter')}}>미세먼지대피소</li>
                </ul>
            </div>
        </div>
    )
}