import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import UserApi from "../api/UserApi";
import CurrentUserController from "../store/CurrentUserController";

export default function Auth () {
    const navigate = useNavigate();

    useEffect(() => {
        auth();
        async function auth() {
            const nickname = localStorage.getItem("nickname");
            const password = localStorage.getItem("password");
            if (nickname && password) {
                const response = await UserApi.authenticate(nickname, password);
                if (response.ok) {
                    navigate("/main");
                    CurrentUserController.setUser(await response.json())
                } else {
                    navigate("/login");
                    console.log("Not authenticated");
                }
            }
        }
    }, [])
}