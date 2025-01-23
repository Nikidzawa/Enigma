import styled from "styled-components";
import Logo from "../../img/img.png"
import {useNavigate} from "react-router-dom";
import {useRef, useState} from "react";
import UserApi from "../../api/UserApi";
import CurrentUserController from "../../store/CurrentUserController";
import PasswordField from "./components/fields/PasswordField";
import NicknameOrEmailField from "./components/fields/NicknameOrEmailField";


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
    width: calc(300px + 20vw);
    height: calc(450px + 18vh);
    max-width: 500px;
    max-height: 670px;
    border: 1px solid white;
    box-shadow: 1px 1px 6px 5px rgba(250, 250, 250, 0.5);
    border-radius: 20px;
    background-color: #121212;
`

const Title = styled.div`
    font-size: 38px;
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
    min-width: 150px;
    min-height: 40px;
    font-size: 18px;
    border-radius: 15px;
    cursor: pointer;
    font-family: Rubik;
`

const LogoAndTitle = styled.div`
    position: absolute;
    top: 45px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
`

const Fields = styled.div`
    position: relative;
    width: 100%;
`

const ForgotPasswordLink = styled.a`
    position: absolute;
    bottom: -25px;
    left: 0px;
    font-size: 13px;
    cursor: pointer;
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

const FirstLineContainer = styled.div`
    position: absolute;
    left: calc(50% - 150px);
    top: -50px;
`

const SecondLineContainer = styled.div`
    position: absolute;
    left: calc(50% - 150px);
    top: 20px;
`

export default function Login () {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [nickname, setNickname] = useState("");

    const passwordFieldRef = useRef(null);

    async function authResponse() {
        const response = await UserApi.authenticate(nickname, password);
        if (response.ok) {
            CurrentUserController.setUser(await response.json())
            localStorage.setItem("nickname", nickname);
            localStorage.setItem("password", password);
            navigate("/main");
        } else {
            console.log("Not authenticated");
        }
    }

    function emailFieldKeyListener(e) {
        if (e.code === "Enter") {
            passwordFieldRef.current.focus();
        }
    }

    function passwordFieldKeyListener(e) {
        if (e.code === "Enter") {
            authResponse();
        }
    }

    function goToRegistrationPage () {
        navigate("/registration")
    }

    return (
        <MainComponent>
            <Window>
                <LogoAndTitle>
                    <Image src={Logo}/>
                    <Title>Welcome Back</Title>
                </LogoAndTitle>
                <Fields>
                    <FirstLineContainer>
                        <NicknameOrEmailField onKeyDown={emailFieldKeyListener}
                                              onInput={e => setNickname(e.target.value)}
                        />
                    </FirstLineContainer>
                    <SecondLineContainer>
                        <PasswordField onKeyDown={passwordFieldKeyListener}
                                       onInput={e => setPassword(e.target.value)}
                                       ref={passwordFieldRef}
                                       placeholder={"Password"}
                        />
                        <ForgotPasswordLink>Forgot password?</ForgotPasswordLink>
                    </SecondLineContainer>
                </Fields>
                <LoginAndRegister>
                    <LoginButton onClick={authResponse}>Log in</LoginButton>
                    <RegistrationPageLink onClick={goToRegistrationPage}>Registration</RegistrationPageLink>
                </LoginAndRegister>
            </Window>
        </MainComponent>
    )
}