import { seoulDataServer } from '@/axiosConfig';

export const getSheltersData = async () => {

    const shelterList = ['TbGtnHwcwP', 'TbGtnCwP', 'shuntPlace'];
    var shelterListEndNum = [];
    var pageStartNum = 1;
    var pageEndNum = 1000;

    const result = {
        coolingCentreData : [],
        heatingCentreData : [],
        shuntPlaceData : []
    };

    for(var i = 0 ; i < shelterList.length; i++) {
        const tempApiResult = await seoulDataServer.get('/' + process.env.REACT_APP_SEOUL_DATA_KEY + '/JSON/' + shelterList[i] + '/1/1/');
        
        switch (shelterList[i]) {
            case 'TbGtnHwcwP' :
                shelterListEndNum.push(tempApiResult.data.TbGtnHwcwP.list_total_count);
                break;
            case 'TbGtnCwP' :
                shelterListEndNum.push(tempApiResult.data.TbGtnCwP.list_total_count);
                break;
            case 'shuntPlace' :
                shelterListEndNum.push(tempApiResult.data.shuntPlace.list_total_count);
                break;
            default : 
                break;
        }
    }

    for(var j = 0 ; j < shelterList.length; j++) {
        pageStartNum = 1;
        pageEndNum = 1000;

        while (true) {
            if (pageEndNum > shelterListEndNum[j]) {
                pageEndNum = shelterListEndNum[j];
            }

            var apiResult = await seoulDataServer.get('/' + process.env.REACT_APP_SEOUL_DATA_KEY + '/JSON/' + shelterList[j] + '/' + pageStartNum + '/' + pageEndNum + '/');
            
            switch (shelterList[j]) {
                case 'TbGtnHwcwP' :
                    result.coolingCentreData.push(...apiResult.data.TbGtnHwcwP.row);
                    break;
                case 'TbGtnCwP' :
                    result.heatingCentreData.push(...apiResult.data.TbGtnCwP.row);
                    break;
                case 'shuntPlace' :
                    result.shuntPlaceData.push(...apiResult.data.shuntPlace.row);
                    break;
                default : 
                    break;
            }

            if (pageEndNum === shelterListEndNum[j]) {
                break;
            }

            pageStartNum += 1000;
            pageEndNum += 1000;
        }

    }
    
    for(var k = 0 ; k < result.coolingCentreData.length; k++) {
        result.coolingCentreData[k].type = 'TbGtnHwcwP';
        result.coolingCentreData[k].latitude = result.coolingCentreData[k].LA;
        result.coolingCentreData[k].longitude = result.coolingCentreData[k].LO;
        result.coolingCentreData[k].shelterSN = result.coolingCentreData[k].R_SEQ_NO;    
    }
    
    for(var l = 0 ; l < result.heatingCentreData.length; l++) {
        result.heatingCentreData[l].type = 'TbGtnCwP';
        result.heatingCentreData[l].latitude = result.heatingCentreData[l].LAT;
        result.heatingCentreData[l].longitude = result.heatingCentreData[l].LOT;    
        result.heatingCentreData[l].shelterSN = result.heatingCentreData[l].R_SEQ_NO;    
    }

    for(var m = 0; m < result.shuntPlaceData.length; m++) {
        result.shuntPlaceData[m].type = 'shuntPlace';
        result.shuntPlaceData[m].latitude = result.shuntPlaceData[m].MAP_COORD_Y;
        result.shuntPlaceData[m].longitude = result.shuntPlaceData[m].MAP_COORD_X;
        result.shuntPlaceData[m].shelterSN = result.shuntPlaceData[m].SN;
        result.shuntPlaceData[m].R_AREA_NM = result.shuntPlaceData[m].ADR_NAM;
    }
    
    return [...result.coolingCentreData, ...result.heatingCentreData, ...result.shuntPlaceData];
}

