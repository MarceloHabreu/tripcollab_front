import Axios, { AxiosInstance } from "axios";

export const httpClient: AxiosInstance = Axios.create({
    baseURL: "http://localhost:8080/api/tripcollab",
});

// Funciona como um middleware, interceptando solicitações antes que sejam enviadas à API
httpClient.interceptors.request.use(
    (config) => {
        // Verifica se há um token armazenado no localStorage
        const token = localStorage.getItem("acessToken");
        if (token) {
            // Adiciona o token ao cabeçalho Authorization no formato Bearer {token}
            config.headers.Authorization = `Bearer ${token}`;
        }
        // Retorna a configuração para prosseguir com a requisição
        return config;
    },
    (error) => Promise.reject(error) // Trata erros na configuração da requisição
);
// Garante que, antes de qualquer requisição para a API, o token esteja sendo enviado no formato adequado
// Isso permite que a API autentique a solicitação e autorize o acesso aos seus recursos
