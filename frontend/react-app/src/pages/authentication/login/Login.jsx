import styled from "styled-components";
import Logo from "../../../img/img.png"
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import UserApi from "../../../api/internal/controllers/UserApi";
import UserController from "../../../store/UserController";
import NicknameOrEmailAndPasswordFields from "./components/NicknameOrEmailAndPasswordFields";
import FailFieldValidation from "../components/fields/FailFieldValidation";
import ClientController from "../../../store/ClientController";


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

const ExceptionContainer = styled.div`
    display: flex;
    top: ${props => props.position ? props.position : '0px'};
`

export default function Login() {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [nicknameOrEmail, setNicknameOrEmail] = useState("");

    const [failLoginEx, setFailLoginEx] = useState(false);
    const [fieldEmptyEx, setFieldEmptyEx] = useState(false);


    useEffect(() => {
        ClientController.disconnect();
    }, [])

    async function authResponse() {
        setFieldEmptyEx(false);
        setFailLoginEx(false);

        if (!nicknameOrEmail || !password) {
            setFieldEmptyEx(true);
            return;
        }

        UserApi.authenticate(nicknameOrEmail, password).then(
            result => {
                UserController.setUser(result.data.user);
                localStorage.setItem("TOKEN", result.data.token);

                localStorage.removeItem("email");
                localStorage.removeItem("password");
                navigate("/main");
            }
        ).catch(error => {
            if (error.status === 401) {
                setFailLoginEx(true);
            }
        });
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
                    <ExceptionContainer>
                        {failLoginEx && (<FailFieldValidation>Не верное имя пользователя или пароль</FailFieldValidation>)}
                        {fieldEmptyEx && (<FailFieldValidation>Для продолжения, необходимо заполнить поля</FailFieldValidation>)}
                    </ExceptionContainer>
                    <LoginButton onClick={authResponse}>Log in</LoginButton>
                    <RegistrationPageLink onClick={() => navigate("/registration")}>Registration</RegistrationPageLink>
                </LoginAndRegister>
            </Window>
        </MainComponent>
    )
}