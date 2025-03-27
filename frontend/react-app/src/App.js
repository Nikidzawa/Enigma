import {HashRouter, Navigate, Route, Routes} from "react-router-dom";
import Login from "./pages/authentication/login/Login";
import Main from "./pages/main/Main";
import Registration from "./pages/authentication/registration/Registration";
import {useEffect} from "react";
import UserController from "./store/UserController";

export default function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/registration" element={<Registration/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/main" element={<Main/>}/>
                <Route path="/*" element={<Navigate to="/login"/>}/>
            </Routes>
        </HashRouter>
    );
}