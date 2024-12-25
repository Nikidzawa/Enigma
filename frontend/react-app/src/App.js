import {HashRouter, Routes, Route, Navigate} from "react-router-dom";
import Login from "./pages/Login";
import Main from "./pages/main/Main";
import ProtectedRoute from "./pages/protect/Protected";

export default function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/login" element={<Login/>} />
                <Route path="/main" element={<ProtectedRoute><Main/></ProtectedRoute>} />
                <Route path="/*" element={<Navigate to="/login" />} />
            </Routes>
        </HashRouter>
  );
}