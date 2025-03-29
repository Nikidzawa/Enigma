import styled, {keyframes} from "styled-components";
import UserController from "../../../../store/UserController";
import MyProfileImage from "../../../../img/account.png";
import SettingsImage from "../../../../img/setting.png";
import LogoutImage from "../../../../img/log-out.png";
import LogoImage from "../../../../img/img.png"
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import Profile from "./Profile";

const fadeIn = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`

const fadeOut = keyframes`
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
`

const ShadowMainContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(39, 39, 39, 0.5);
    z-index: 1000;
    opacity: ${props => props.visible ? "1" : "0"};
    pointer-events: ${props => props.visible ? "auto" : "none"};;
    animation: ${props => props.visible ? fadeIn : fadeOut} 0.2s ease;
`

const LeftPanel = styled.div`
    position: fixed;
    width: 350px;
    left: 0;
    top: 0;
    min-height: 100vh;
    background-color: #1a1a1a;
    display: flex;
    transform: translateX(${(props) => (props.visible ? "0" : "-100%")});
    transition: transform 0.3s ease;
    flex-direction: column;
`

const ProfileInfo = styled.div`
    display: flex;
    align-items: center;
    padding: 10px 10px 13px;
    border-bottom: 1px solid #292929;
`

const ProfileImage = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
`

const InfoSection = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 15px;
    gap: 7px;
    width: 225px;
    max-width: 225px;
`

const Name = styled.div`
    font-size: 17px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`

const Info = styled.div`
    font-size: 13px;
    overflow: hidden;
    text-overflow: ellipsis;
`

const Panels = styled.div`
    overflow-y: auto;
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
`

const Panel = styled.div`
    height: 50px;
    display: flex;
    align-items: center;
    background-image: ${props => props.image ? `url(${props.image})` : ''};
    background-size: 28px;
    background-repeat: no-repeat;
    background-position: 10px;
    padding-left: 52px;
    cursor: pointer;
    font-size: 15px;

    &:hover {
        background-color: #292929;
    }
`

const MessengerInfo = styled.div`
    display: flex;
    margin-top: auto;
    padding: 15px;
    gap: 7px;
    font-size: 13px;
    border-top: 1px solid #292929;
    align-items: center;
`

export default function MenuPanel ({setMenuIsVisible, menuIsVisible}) {
    const navigate = useNavigate();
    const [profileVisible, setProfileVisible] = useState(false);

    function logout () {
        localStorage.removeItem("TOKEN")
        navigate("/login")
    }

    function openProfileModal () {
        setMenuIsVisible(false);
        setProfileVisible(true);
    }

    return (
        <>
            <ShadowMainContainer visible={menuIsVisible} onClick={() => setMenuIsVisible(false)}>
                <LeftPanel visible={menuIsVisible} onClick={e => e.stopPropagation()}>
                    <ProfileInfo>
                        <ProfileImage src={UserController.getCurrentUser().avatarHref}/>
                        <InfoSection>

                            <Name>{UserController.getCurrentUser().name} {UserController.getCurrentUser().surname}</Name>
                            <Info>{UserController.getCurrentUser().aboutMe || UserController.getCurrentUser().nickname}</Info>
                        </InfoSection>
                    </ProfileInfo>
                    <Panels>
                        <div>
                            <Panel onClick={openProfileModal} image={MyProfileImage}>Мой профиль</Panel>
                            <Panel image={SettingsImage}>Настройки</Panel>
                        </div>
                        <div>
                            <Panel image={LogoutImage} onClick={logout}>Выход</Panel>
                        </div>
                    </Panels>
                    <MessengerInfo>
                        <div>
                            <img src={LogoImage} width={"25px"}/>
                        </div>
                        <div>
                            <div>Enigma Messenger</div>
                            <div>Версия 0.1 Beta</div>
                        </div>
                    </MessengerInfo>
                </LeftPanel>
            </ShadowMainContainer>
            <Profile visible={profileVisible} setVisible={setProfileVisible}/>
        </>
)
}