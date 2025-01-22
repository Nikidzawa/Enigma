import styled, {css, keyframes} from "styled-components";
import Logo from "../../img/img.png"
import {useNavigate} from "react-router-dom";
import {useRef, useState} from "react";
import PasswordField from "./components/PasswordField";
import EmailField from "./components/EmailField";
import EmailVerificationFields from "./components/EmailVerificationFields";

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

const NextButton = styled.button`
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
    left: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
`

const Fields = styled.div`
    position: relative;
    width: 100%;
`

const LoginAndRegister = styled.div`
    position: absolute;
    bottom: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
`

const LoginPageLink = styled.a`
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


const slideInFromRight = keyframes`
    from {
        transform: translateX(25%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
`;

const slideOutToLeft = keyframes`
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(-25%);
        opacity: 0;
    }
`;

const slideOutToRight = keyframes`
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(25%);
        opacity: 0;
    }
`;

const AnimatedLogo = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    ${(props) =>
            props.isActive &&
            css`
            animation: ${slideInFromRight} 0.35s forwards;
        `}
    ${(props) =>
            props.isExiting &&
            css`
            animation: ${props.direction === "left" ? slideOutToLeft : slideOutToRight} 0.35s forwards;
        `}
`

const AnimatedSection = styled.div`
    ${(props) =>
    props.isActive &&
    css`
            animation: ${slideInFromRight} 0.35s forwards;
        `}
    ${(props) =>
    props.isExiting &&
    css`
            animation: ${props.direction === "left" ? slideOutToLeft : slideOutToRight} 0.35s forwards;
        `}
`;

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

const LineContainer = styled.div`
    position: absolute;
    left: 28%;
`


export default function Registration () {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [currentSection, setCurrentSection] = useState(1);
    const [visibleSections, setVisibleSections] = useState([1]);

    const passwordFieldRef = useRef(null);

    function goToLoginPage () {
        navigate("/login")
    }

    function emailFieldKeyListener(e) {
        if (e.code === "Enter") {
            passwordFieldRef.current.focus();
        }
    }

    function passwordFieldKeyListener(e) {
        if (e.code === "Enter") {
            nextSection();
        }
    }

    const nextSection = () => {
        const exitingSection = currentSection;
        const next = currentSection + 1;

        setVisibleSections((prev) => [...prev, next]);
        setCurrentSection(next);

        setTimeout(() => {
            setVisibleSections((prev) => prev.filter((s) => s !== exitingSection));
        }, 350);
    };

    return (
        <MainComponent>
            <Window>
                    {visibleSections.includes(1) && (
                        <AnimatedLogo
                            isExiting={currentSection !== 1}
                            direction={"left"}>
                            <LogoAndTitle>
                                <Image src={Logo}/>
                                <Title>Registration</Title>
                            </LogoAndTitle>
                        </AnimatedLogo>
                    )}
                <Fields>
                    {visibleSections.includes(1) && (
                        <AnimatedSection
                            isExiting={currentSection !== 1}
                            direction={"left"}
                        >
                            <FirstLineContainer>
                                <EmailField onInput={e => setEmail(e.target.value)}
                                            onKeyDown={emailFieldKeyListener}/>
                            </FirstLineContainer>
                            <SecondLineContainer>
                                <PasswordField onInput={e => setPassword(e.target.value)}
                                               onKeyDown={passwordFieldKeyListener}
                                               ref={passwordFieldRef}
                                               placeholder={"Choose password"}/>
                            </SecondLineContainer>
                        </AnimatedSection>
                    )}
                    {visibleSections.includes(2) && (
                        <AnimatedSection
                            isActive={currentSection === 2}
                            isExiting={currentSection !== 2}
                            direction={"left"}
                        >
                            <LineContainer>
                                <EmailVerificationFields/>
                            </LineContainer>
                        </AnimatedSection>
                    )}
                </Fields>
                <LoginAndRegister>
                    <StageContainer>
                        <StageEclipse isActive={currentSection === 1}/>
                        <StageEclipse isActive={currentSection === 2}/>
                        <StageEclipse isActive={currentSection > 2}/>
                    </StageContainer>
                    <NextButton onClick={nextSection}>Next</NextButton>
                    <LoginPageLink onClick={goToLoginPage}>Login</LoginPageLink>
                </LoginAndRegister>
            </Window>
        </MainComponent>
    )
}