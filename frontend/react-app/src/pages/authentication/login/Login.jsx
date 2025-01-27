import styled from "styled-components";
import Logo from "../../../img/img.png"
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import UserApi from "../../../api/UserApi";
import CurrentUserController from "../../../store/CurrentUserController";
import NicknameOrEmailAndPasswordFields from "./components/NicknameOrEmailAndPasswordFields";


const MainComponent = styled.main`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
`

const Window = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc(300px + 18vh);
    height: calc(470px + 18vh);
    max-width: 520px;
    max-height: 700px;
    border: 1px solid white;
    box-shadow: 1px 1px 6px 5px rgba(250, 250, 250, 0.5);
    border-radius: 20px;
    background-color: #121212;
`

const Title = styled.div`
    font-size: 35px;
    padding-bottom: 10px;
    font-weight: bold;
    font-family: Rubik;
    margin-bottom: 40px;
`

const Image = styled.img`
    width: calc(53px + 2vh);
    height: calc(53px + 2vh);
`

const LoginButton = styled.button`
    background-color: transparent;
    border: 1px solid white;
    color: white;
    padding: 8px;
    margin-top: 20px;
    min-width: calc(140px + 1vh);
    min-height: calc(28px + 1vh);
    font-size: 20px;
    border-radius: 15px;
    cursor: pointer;
    font-family: Rubik;
`

const LogoAndTitle = styled.div`
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-top: 45px;
`

const LoginAndRegister = styled.div`
    position: absolute;
    bottom: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
`

const RegistrationPageLink = styled.a`
    cursor: pointer;
    border-top: 1px white solid;
    padding: 10px;
`

const Fields = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
`

export default function Login() {
    const navigate = useNavigate();
    const [passwordOrEmail, setPassword] = useState("");
    const [nicknameOrEmail, setNicknameOrEmail] = useState("");

    async function authResponse() {
        const response = await UserApi.authenticate(nicknameOrEmail, passwordOrEmail);
        if (response.ok) {
            CurrentUserController.setUser(await response.json())
            localStorage.setItem("nickname", nicknameOrEmail);
            localStorage.setItem("password", passwordOrEmail);
            navigate("/main");
        } else {
            console.log("Not authenticated");
        }
    }

    return (
        <MainComponent>
            <Window>
                <Fields>
                    <LogoAndTitle>
                        <Image src={Logo}/>
                        <Title>Welcome Back</Title>
                    </LogoAndTitle>
                    <NicknameOrEmailAndPasswordFields
                        onInputEmailOrNickname={e => setNicknameOrEmail(e.currentTarget.value)}
                        onInputPassword={e => setPassword(e.currentTarget.value)}
                        onKeyDown={e => e.code === "Enter" && authResponse()}
                    />
                </Fields>
                <LoginAndRegister>
                    <LoginButton onClick={authResponse}>Log in</LoginButton>
                    <RegistrationPageLink onClick={() => navigate("/registration")}>Registration</RegistrationPageLink>
                </LoginAndRegister>
            </Window>
        </MainComponent>
    )
}