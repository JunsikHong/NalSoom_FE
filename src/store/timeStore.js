//lib
import { create } from "zustand";

const useTimeStore = create((set) => ({
    currentDate : '', //현재 날짜
    currentTime : '', //현재 시간 -1

    //현재 날짜, 시간 불러오는 함수
    formatDateTime : () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()-1).padStart(2, '0');
        set({currentDate : `${year}${month}${day}`});
        set({currentTime : `${hours}00`});
    }
}));

export default useTimeStore;
