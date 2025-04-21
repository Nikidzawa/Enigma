import {HashRouter, Navigate, Route, Routes} from "react-router-dom";
import Login from "./pages/authentication/login/Login";
import Registration from "./pages/authentication/registration/Registration";
import InitMain from "./pages/main/InitMain";

export default function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/registration" element={<Registration/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/main" element={<InitMain/>}/>
                <Route path="/*" element={<Navigate to="/login"/>}/>
            </Routes>
        </HashRouter>
    );
}