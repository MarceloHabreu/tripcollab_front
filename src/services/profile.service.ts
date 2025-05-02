import { httpClient } from "../http";

const resourceUrl: string = "/users/me/profile";

export const useProfileService = () => {
    const getMeProfile = async (): Promise<ProfileProps> => {
        const response = await httpClient.get(`${resourceUrl}`);

        const profileData = response.data;
        return profileData;
    };

    return {
        getMeProfile,
    };
};

export default useProfileService;
