//lib
import { create } from "zustand";

const useShelterStore = create((set) => ({
    currentShelterType: 'coolingCentre',
    currentShelter: null,
    
    setCurrentShelter : (currentShelterInfo) => {
        set({currentShelter : currentShelterInfo});
    },

    setCurrentShelterType : (currentShelterType) => {
        set({currentShelterType : currentShelterType});
    }
}));

export default useShelterStore;