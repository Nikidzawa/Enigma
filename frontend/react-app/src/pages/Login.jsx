import styled from "styled-components";
import Logo from "../img/img.png"
import User from "../img/user.png"
import Lock from "../img/lock.png"
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import UserApi from "../api/UserApi";
import CurrentUserController from "../store/CurrentUserController";


const MainComponent = styled.main`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    gap: 40px;
`

const Title = styled.div`
    font-size: 35px;
    padding-bottom: 10px;
    font-weight: bold;
`

const Image = styled.img`
    width: calc(53px + 2vh);
    height: calc(53px + 2vh);
    padding-top: 5px;
`

const TextAndInput = styled.div`
    display: flex;
    gap: 12px;
    align-items: center;
`

const Button = styled.button`
    background-color: white;
    padding: 8px;
    min-width: 120px;
    font-size: 16px;
    border-radius: 15px;
    cursor: pointer;
    font-family: Rubik;
`

const Input = styled.input`
    background-color: unset;
    border: none;
    border-bottom: 1px solid white;
    color: white;
    min-width: 250px;
    height: 25px;
    outline: none;
    font-family: Rubik;
    background-image: url(${props => props.image});
    background-size: 25px;
    background-repeat: no-repeat;
    background-position: left;
    padding-left: 35px;
    padding-bottom: 5px;
    background-position-y: 0;
    font-size: 16px;

`

const LoginAndRegister = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
`

const A = styled.a`
    cursor: pointer;
    border-top: 1px white solid;
    padding: 10px;
`

export default function Login () {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [nickname, setNickname] = useState("");

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

    return (
        <MainComponent>
            <Image src={Logo}/>
            <Title>Enigma</Title>
            <TextAndInput>
                <Input onInput={e => setNickname(e.target.value)} placeholder={"Nickname"} image={User}/>
            </TextAndInput>
            <TextAndInput>
                <Input onInput={e => setPassword(e.target.value)} type={"password"} placeholder={"Password"} image={Lock}/>
            </TextAndInput>
            <LoginAndRegister>
                <Button onClick={authResponse}>Login</Button>
                <A>Register</A>
            </LoginAndRegister>
        </MainComponent>
    )
}