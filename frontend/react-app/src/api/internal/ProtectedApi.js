import axios from 'axios';

const protectedApi = axios.create({
    baseURL: 'http://localhost:9000/api',
});

protectedApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('TOKEN');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

protectedApi.interceptors.response.use(
    (response) => response,
    async (error) => {

        if (error.response.status === 401) {
            localStorage.removeItem('TOKEN');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default protectedApi;