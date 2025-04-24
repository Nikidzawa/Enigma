import styled, {keyframes} from "styled-components";
import {useEffect, useState} from "react";
import CloseImage from "../../../img/close2.png";
import MailImage from "../../../img/mail-blue.png";
import OnlineStatusComponent from "./onlineStatus/OnlineStatusComponent";
import NicknameField from "../sections/menu/components/profile/fields/NicknameField";
import DateField from "../sections/menu/components/profile/fields/DateField";
import ActiveChatController from "../../../store/ActiveChatController";
import ChatRoomsController from "../../../store/ChatRoomsController";
import ModalController from "../../../store/ModalController";
import AboutMeField from "../sections/menu/components/profile/fields/AboutMeField";

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
    animation: ${props => props.visible ? fadeIn : props.isFirstRender ? 'none' : fadeOut} 0.2s ease;
    display: flex;
    justify-content: center;
    align-items: center;
`

const ModalContainer = styled.div`
    border-radius: 20px;
    background-color: #1a1a1a;
    position: relative;
    box-shadow: 1px 1px 6px 5px rgba(250, 250, 250, 0.5);
    width: 400px;
`

const ProfileImage = styled.img`
    width: 120px;
    height: 120px;
    border-radius: 50%;
`

const AvatarContainer = styled.div`
    position: relative;
    margin-bottom: 2px;
`

const AvatarSection  = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    flex: 1;
    margin-top: 30px;
`

const UserInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`

const Fio = styled.div`
    display: flex;
    font-size: 25px;
    cursor: default;
    max-width: 400px;
`

const Fields = styled.div`
    display: flex;
    flex-direction: column;
    padding: 10px 15px 25px 15px;
`

const UpperContainer = styled.div`
    display: flex;
    justify-content: space-between;
`

const Name = styled.div`
    font-size: 22px;
    cursor: default;
`

const Close = styled.img`
    width: 17px;
    height: 17px;
    cursor: pointer;
`

const ButtonContainer = styled.div`
    display: flex;
    flex: 1;
    gap: 10px;
    width: 100%;
`

const Button = styled.button`
    width: 100%;
    height: 35px;
    background-color: transparent;
    color: #009398;
    border: 2px solid #009398;
    font-size: 15px;
    border-radius: 10px;
    cursor: pointer;
    font-weight: bold;
    background-image: url("${MailImage}");
    background-position: 5px;
    background-size: 25px;
    background-repeat: no-repeat;
`

const OnlineStatusContainer = styled.div`
`

const UserData = styled.div`
    padding: 20px 20px 5px 20px;
`

const AboutMeContainer = styled.div`
    margin-top: 3px;
`

export default function OtherProfile({user, isOnline, lastOnlineDate, visible, setVisible}) {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [nickname, setNickname] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [aboutMe, setAboutMe] = useState("");
    const [avatar, setAvatar] = useState("");

    const [isFirstRender, setIsFirstRender] = useState(true);

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setVisible(false)
        }
    };

    useEffect(() => {
        visible && isFirstRender && setIsFirstRender(false);

        ModalController.setVisible(visible)

        if (visible) {
            window.addEventListener('keydown', handleKeyDown);
        } else {
            window.removeEventListener('keydown', handleKeyDown)
        }

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [visible]);

    useEffect(() => {
        setName(user.name);
        setSurname(user.surname);
        setNickname(user.nickname);
        setAboutMe(user.aboutMe);
        setBirthdate(user.birthdate);
        setAvatar(user.avatarHref);
    }, [user])

    function openChat() {
        const chat = ChatRoomsController.findChatByUserDtoOrGetNew(user);
        ActiveChatController.setActiveChat(chat);
        setVisible(false)
    }

    return (
        user && (
            <ShadowMainContainer visible={visible}
                                 isFirstRender={isFirstRender}
                                 onMouseDown={e => e.target === e.currentTarget &&  setVisible(false)}>
                <ModalContainer onClick={e => e.stopPropagation()}>
                    <UserData>
                        <UpperContainer>
                            <Name>Profile</Name>
                            <Close src={CloseImage} onClick={() => setVisible(false)}/>
                        </UpperContainer>
                        <AvatarSection>
                            <AvatarContainer>
                                <ProfileImage src={avatar}/>
                            </AvatarContainer>
                            <UserInfo>
                                <Fio>{name} {surname}</Fio>
                            </UserInfo>
                            <AboutMeContainer>
                                {aboutMe && <AboutMeField disabled={true} value={aboutMe}/>}
                            </AboutMeContainer>
                            <OnlineStatusContainer>
                                <OnlineStatusComponent isTyping={false} isOnline={isOnline} lastOnlineDate={lastOnlineDate}/>
                            </OnlineStatusContainer>
                        </AvatarSection>
                    </UserData>
                    <Fields>
                        <ButtonContainer>
                            <Button onClick={openChat}>Написать</Button>
                        </ButtonContainer>
                        <NicknameField value={nickname} disabled={true}/>
                        {
                            birthdate && <DateField value={birthdate} disabled={true}/>
                        }
                    </Fields>
                </ModalContainer>
            </ShadowMainContainer>
        )
    )
}