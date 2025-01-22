import styled from "styled-components";
import Logo from "../../img/img.png"
import User from "../../img/user.png"
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import UserApi from "../../api/UserApi";
import CurrentUserController from "../../store/CurrentUserController";
import Lock from "../../img/lock.png";
import MailImg from "../../img/mail.png"


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
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 40px;
    width: calc(300px + 20vw);
    height: calc(450px + 20vh);
    max-width: 450px;
    max-height: 650px;
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
    padding-top: 5px;
`

const Button = styled.button`
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
    background-position-y: ${props => props.pos};
    padding-bottom: 2px;
    font-size: 16px;
`

const LogoAndTitle = styled.div`
    position: absolute;
    top: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
`

const LoginAndRegister = styled.div`
    position: absolute;
    bottom: 40px;
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

const StageContainer = styled.div`
    width: 100%;
    height: 7px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
`

const StageEclipse = styled.div`
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: ${props => props.isActive ? "#d8d8d8" : "#393939"};
`

export default function Registration () {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [nickname, setNickname] = useState("");
    const [currentSection, setCurrentSection] = useState(1);

    function goToLoginPage () {
        navigate("/login")
    }

    function nextSection () {
        setCurrentSection(currentSection + 1);
    }

    return (
        <MainComponent>
            <Window>
                <LogoAndTitle>
                    <Image src={Logo}/>
                    <Title>Registration</Title>
                </LogoAndTitle>
                    <Input onInput={e => setNickname(e.target.value)} placeholder={"Enter your email"} image={MailImg} pos={"5px"}/>
                    <Input onInput={e => setPassword(e.target.value)} type={"password"} placeholder={"Chose password"} image={Lock} pos={"0px"}/>
                <LoginAndRegister>
                    <StageContainer>
                        <StageEclipse isActive={currentSection === 1}/>
                        <StageEclipse isActive={currentSection === 2}/>
                        <StageEclipse isActive={currentSection > 2}/>
                    </StageContainer>
                    <Button onClick={nextSection}>Next</Button>
                    <A onClick={goToLoginPage}>Login</A>
                </LoginAndRegister>
            </Window>
        </MainComponent>
    )
}