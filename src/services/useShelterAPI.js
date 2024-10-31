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

    const date = new Date();
    const formattedDate = date.toLocaleDateString(); // 오늘 날짜
    const formattedTime = date.getHours(); // 현재 시간
    
    for(var k = 0 ; k < result.coolingCentreData.length; k++) {
        result.coolingCentreData[k].type = 'TbGtnHwcwP';
        result.coolingCentreData[k].latitude = result.coolingCentreData[k].LA;
        result.coolingCentreData[k].longitude = result.coolingCentreData[k].LO;
        result.coolingCentreData[k].shelterSN = result.coolingCentreData[k].R_SEQ_NO;

        if(result.coolingCentreData[k].OPER_BGNG_YMD && result.coolingCentreData[k].OPER_END_YMD) {
            let operBeginDate = new Date(result.coolingCentreData[k].OPER_BGNG_YMD);
            let operEndDate = new Date(result.coolingCentreData[k].OPER_END_YMD);
            if(formattedDate > operBeginDate &&
                formattedDate < operEndDate
            ) {
                result.coolingCentreData[k].useYN = true;
            } else {
                result.coolingCentreData[k].useYN = false;
            }
        } else {
            result.coolingCentreData[k].useYN = true;
        }

    }
    
    for(var l = 0 ; l < result.heatingCentreData.length; l++) {
        result.heatingCentreData[l].type = 'TbGtnCwP';
        result.heatingCentreData[l].latitude = result.heatingCentreData[l].LAT;
        result.heatingCentreData[l].longitude = result.heatingCentreData[l].LOT;    
        result.heatingCentreData[l].shelterSN = result.heatingCentreData[l].R_SEQ_NO;
        
        if(result.heatingCentreData[l].DT_START && result.heatingCentreData[l].DT_END) {
            let dtStartDate = new Date(result.heatingCentreData[l].DT_START);
            let dtEndDate = new Date(result.heatingCentreData[l].DT_END);
            if (formattedDate > dtStartDate &&
                formattedDate < dtEndDate
            ) {
                result.heatingCentreData[l].useYN = true;
            } else {
                result.heatingCentreData[l].useYN = false;
            }
        } else {
            result.heatingCentreData[l].useYN = true;
        }
    }

    for(var m = 0; m < result.shuntPlaceData.length; m++) {
        result.shuntPlaceData[m].type = 'shuntPlace';
        result.shuntPlaceData[m].latitude = result.shuntPlaceData[m].MAP_COORD_Y;
        result.shuntPlaceData[m].longitude = result.shuntPlaceData[m].MAP_COORD_X;
        result.shuntPlaceData[m].shelterSN = result.shuntPlaceData[m].SN;
        result.shuntPlaceData[m].R_AREA_NM = result.shuntPlaceData[m].SHUNT_NAM;

        if(result.shuntPlaceData[m].WKDY_USE_HR === '04:00-익일01:00') {
            if(formattedTime > 1 && formattedTime < 4) {
                result.shuntPlaceData[m].useYN = false;
            } else {
                result.shuntPlaceData[m].useYN = true;
            }
        } else if(result.shuntPlaceData[m].WKDY_USE_HR === '24시간') {
            result.shuntPlaceData[m].useYN = true;
        } else if(result.shuntPlaceData[m].WKDY_USE_HR === '05:00-24:00'){
            if(formattedTime > 0 && formattedTime < 5) {
                result.shuntPlaceData[m].useYN = false;
            } else {
                result.shuntPlaceData[m].useYN = true;
            }
        } else {
            let beginTime = result.shuntPlaceData[m].WKDY_USE_HR.slice(0,1);
            let endTime = result.shuntPlaceData[m].WKDY_USE_HR.slice(3,4);
            if(formattedTime > beginTime && formattedTime < endTime) {
                result.shuntPlaceData[m].useYN = true;
            } else { 
                result.shuntPlaceData[m].useYN = false;
            }
        }
    }
    
    return [...result.coolingCentreData, ...result.heatingCentreData, ...result.shuntPlaceData];
}

