import {HashRouter, Navigate, Route, Routes} from "react-router-dom";
import Login from "./pages/authentication/login/Login";
import Main from "./pages/main/Main";
import ProtectedRoute from "./pages/protect/Protected";
import Registration from "./pages/authentication/registration/Registration";

export default function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/registration" element={<Registration/>}></Route>
                <Route path="/login" element={<Login/>}/>
                <Route path="/main" element={<ProtectedRoute><Main/></ProtectedRoute>}/>
                <Route path="/*" element={<Navigate to="/login"/>}/>
            </Routes>
        </HashRouter>
    );
}