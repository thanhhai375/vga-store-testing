import axiosClient from '../api/axiosClient';

export const settingService = {

    getSettings: async () => {
        const res = await axiosClient.get('/system-settings');
        return res;
    }
};
