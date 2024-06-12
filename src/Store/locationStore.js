//lib
import { create } from "zustand";

const useLocationStore = create((set) => ({
    latitude: 0,
    longitude: 0,

    updateLocation: () => {
        navigator.geolocation.getCurrentPosition(position => {
            set({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        });
    }
}));

export default useLocationStore;