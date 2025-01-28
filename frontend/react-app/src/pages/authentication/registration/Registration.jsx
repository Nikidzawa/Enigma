import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import EmailAndPasswordSection from "./sections/EmailAndPasswordSection";
import Animation from "./components/Animation";
import EmailVerificationSection from "./sections/EmailVerificationSection";
import BioSection from "./sections/BioSection";
import UserDto from "../../../api/dto/UserDto";
import UserApi from "../../../api/controllers/UserApi";
import CurrentUserController from "../../../store/CurrentUserController";

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
    max-width: 520px;
    max-height: 700px;
    border: 1px solid white;
    box-shadow: 1px 1px 6px 5px rgba(250, 250, 250, 0.5);
    border-radius: 20px;
    background-color: #121212;
`

const StageContainer = styled.div`
    position: absolute;
    bottom: 170px;
    display: flex;
    gap: 12px;
`

const StageEclipse = styled.div`
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: ${props => props.isActive ? "#d8d8d8" : "#393939"};
`

export default function Registration() {
    const [currentSection, setCurrentSection] = useState(1);
    const [visibleSections, setVisibleSections] = useState([1]);

    const [hasPrev, setHasPrev] = useState(false);

    function goBackSection() {
        setHasPrev(true);
        changeSection(1)
    }

    function goNextSection() {
        changeSection(currentSection + 1);
    }

    function changeSection (section) {
        setVisibleSections((prev) => [...prev, section]);
        setCurrentSection(section);

        setTimeout(() => {
            setVisibleSections((prev) => prev.filter((s) => s !== currentSection));
            }, 350
        );
    }

    return (
        <MainComponent>
            <Window>
                {visibleSections.includes(1) && (
                    <Animation
                        isActive={hasPrev && currentSection === 1}
                        isExiting={currentSection !== 1}
                        directionActive={"left"}
                    >
                        <EmailAndPasswordSection
                            nextSection={goNextSection}
                        />
                    </Animation>
                )}
                {visibleSections.includes(2) && (
                    <Animation
                        isActive={currentSection === 2}
                        isExiting={currentSection !== 2}
                    >
                        <EmailVerificationSection
                            goNextSection={goNextSection}
                            goBack={goBackSection}
                        />
                    </Animation>
                )}
                {visibleSections.includes(3) && (
                    <Animation
                        isActive={currentSection === 3}
                        isExiting={currentSection !== 3}
                    >
                        <BioSection goBack={goBackSection}/>
                    </Animation>
                )}
                   <StageContainer>
                        <StageEclipse isActive={currentSection === 1}/>
                        <StageEclipse isActive={currentSection === 2}/>
                        <StageEclipse isActive={currentSection === 3}/>
                   </StageContainer>
            </Window>
        </MainComponent>
    )
}