import styled from "styled-components";
import Logo from "../../../img/img.png"
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import EmailAndPasswordSection from "./components/EmailAndPasswordSection";
import EmailVerificationSection from "./components/EmailVerificationSection";
import Animation from "./components/Animation";
import ConvertVideo from "../../../img/convert.lottie"
import {DotLottieReact} from '@lottiefiles/dotlottie-react';

const MainComponent = styled.main`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    overflow-x: hidden;
`

const Window = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc(300px + 18vh);
    height: calc(470px + 18vh);
    max-width: 500px;
    max-height: 670px;
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

const SecondTitle = styled.div`
    font-size: 35px;
    font-weight: bold;
    font-family: Rubik;
    width: 80%;
    text-align: center;
`

const TitleContainer = styled.div`
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-top: 40px;
`

const Container = styled.div`
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin-top: 30px;
`

const Fields = styled.div`
    display: flex;
    justify-content: center;
`

export default function Registration() {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [currentSection, setCurrentSection] = useState(1);
    const [visibleSections, setVisibleSections] = useState([1]);

    function submitEmail(result) {
        nextSection();
    }

    function nextSection() {
        if (currentSection !== 3) {
            const exitingSection = currentSection;
            const next = currentSection + 1;

            setVisibleSections((prev) => [...prev, next]);
            setCurrentSection(next);

            setTimeout(() => {
                setVisibleSections((prev) => prev.filter((s) => s !== exitingSection));
            }, 350);
        }
    }

    return (
        <MainComponent>
            <Window>
                {visibleSections.includes(1) && (
                    <Animation
                        isExiting={currentSection !== 1}
                        direction={"left"}>
                        <Fields>
                            <TitleContainer>
                                <Image src={Logo}/>
                                <Title>Registration</Title>
                            </TitleContainer>
                            <EmailAndPasswordSection
                                onInputEmail={e => setEmail(e.target.value)}
                                onInputPassword={e => setPassword(e.target.value)}
                                onKeyDown={e => e.code === 'Enter' && nextSection()}
                            />
                        </Fields>
                    </Animation>
                )}
                {visibleSections.includes(2) && (
                    <Animation
                        isActive={currentSection === 2}
                        isExiting={currentSection !== 2}
                        direction={"left"}>
                        <Fields>
                            <Container>
                                <DotLottieReact
                                    style={{width: '180px'}}
                                    src={ConvertVideo}
                                    autoplay
                                />
                                <SecondTitle>Enter code from letter</SecondTitle>
                            </Container>
                            <EmailVerificationSection submitEmail={submitEmail}/>
                        </Fields>
                    </Animation>
                )}
                <LoginAndRegister>
                    <StageContainer>
                        <StageEclipse isActive={currentSection === 1}/>
                        <StageEclipse isActive={currentSection === 2}/>
                        <StageEclipse isActive={currentSection === 3}/>
                    </StageContainer>
                    <NextButton onClick={nextSection}>Next</NextButton>
                    <LoginPageLink onClick={() => navigate("/login")}>Login</LoginPageLink>
                </LoginAndRegister>
            </Window>
        </MainComponent>
    )
}