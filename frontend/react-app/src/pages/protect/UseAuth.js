import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import UserApi from "../../api/UserApi";
import CurrentUserController from "../../store/CurrentUserController";

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            setLoading(true);
            try {
                const nickname = localStorage.getItem("nickname");
                const password = localStorage.getItem("password");
                if (nickname && password) {
                    const response = await UserApi.authenticate(nickname, password);
                    if (response.ok) {
                        CurrentUserController.setUser(await response.json())
                        setIsAuthenticated(true);
                    } else {
                        setIsAuthenticated(false);
                    }
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Ошибка проверки авторизации:', error);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/login');
    };

    return {isAuthenticated, loading, logout};
};

export default useAuth;
