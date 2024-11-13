//lib
import { create } from "zustand";

const useShelterStore = create((set) => ({
    currentShelterType: '', //nav 메뉴에서 선택한 타입
    currentShelter: null, //지도에서 선택한 대피소
    mapShelters: [], //지도 상에 나타나 있는 대피소 -> 리뷰 목록에 뜰 리스트

    setCurrentShelterType : (currentShelterType) => {
        set({currentShelterType : currentShelterType});
    },
    
    setCurrentShelter : (currentShelterInfo) => {
        set({currentShelter : currentShelterInfo});
    },

    setMapShelters : (mapShelterInfo) => {
        set({ mapShelters : [...mapShelterInfo] });
    }
}));

export default useShelterStore;
