import { ILogin } from "@/models/Login";
import { httpClient } from "@/http/index";
import { IRegister } from "@/models/Register";

const resourceUrl: string = "auth";

export const useTokenService = () => {
    const login = async (
        login: ILogin
    ): Promise<{ message?: string; error?: string; token?: string; expiresIn?: number }> => {
        try {
            const response = await httpClient.post(`${resourceUrl}/login`, login);
            return {
                message: response.data.message,
                token: response.data.token,
                expiresIn: response.data.expiresIn,
            };
        } catch (error: any) {
            if (error.response) {
                return { error: error.response.data.error || "An unexpected error occurred." };
            }
            return { error: "Network error or server unreachable." };
        }
    };
    const register = async (
        register: IRegister
    ): Promise<{ message?: string; error?: string; token?: string; expiresIn?: number }> => {
        try {
            const response = await httpClient.post(`${resourceUrl}/register`, register);
            return {
                message: response.data.message,
                token: response.data.token,
                expiresIn: response.data.expiresIn,
            };
        } catch (error: any) {
            if (error.response) {
                return { error: error.response.data.error || "An unexpected error occurred." };
            }
            return { error: "Network error or server unreachable." };
        }
    };

    return {
        login,
        register,
    };
};

export default useTokenService;
