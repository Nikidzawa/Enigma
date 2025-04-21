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
    padding: 20px 20px 20px 25px;
    position: relative;
    box-shadow: 1px 1px 6px 5px rgba(250, 250, 250, 0.5);
    width: 380px;
`

const ProfileImage = styled.img`
    width: 110px;
    height: 110px;
    border-radius: 50%;
`

const AvatarContainer = styled.div`
    position: relative;
`

const AvatarSection  = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    flex: 1;
    gap: 5px;
    padding-top: 30px;
    padding-bottom: 15px;
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

const AboutMe = styled.div`
    width: 350px;
    cursor: default;
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
    width: 18px;
    height: 18px;
    cursor: pointer;
`

const ButtonContainer = styled.div`
    display: flex;
    flex: 1;
    gap: 10px;
`

const Button = styled.button`
    width: 500px;
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
    padding-top: 2px;
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
                        {aboutMe && <AboutMe>{aboutMe}</AboutMe>}
                        <OnlineStatusContainer>
                            <OnlineStatusComponent isTyping={false} isOnline={isOnline} lastOnlineDate={lastOnlineDate}/>
                        </OnlineStatusContainer>
                    </AvatarSection>
                    <ButtonContainer>
                        <Button onClick={openChat}>Написать</Button>
                    </ButtonContainer>
                    <div>
                        <NicknameField value={nickname} disabled={true}/>
                        {
                            birthdate && <DateField value={birthdate} disabled={true}/>
                        }
                    </div>
                </ModalContainer>
            </ShadowMainContainer>
        )
    )
}