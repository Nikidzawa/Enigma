import styled, {keyframes} from "styled-components";
import {useEffect, useState} from "react";
import CloseImage from "../../../../img/close2.png";
import DateField from "./DateField";
import MailImage from "../../../../img/mail-blue.png";
import HandImage from "../../../../img/hand.png";
import DateParser from "../../../../helpers/DateParser";
import NicknameField from "./NicknameField";

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
    display: flex;
    justify-content: center;
    align-items: center;
`

const ModalContainer = styled.div`
    border-radius: 20px;
    background-color: #1a1a1a;
    padding: 25px 25px 25px 30px;
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
    padding-bottom: 10px;
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

const Nickname = styled.div`
    cursor: default;
`

const AboutMe = styled.div`
    width: 350px;
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
    flex-direction: column;
    flex: 1;
    margin-top: 10px;
    gap: 10px;
`

const Button = styled.button`
    width: 100%;
    height: 35px;
    background-color: transparent;
    color: #007a7a;
    border: 2px solid #007a7a;
    font-size: 16px;
    border-radius: 10px;
    cursor: pointer;
    font-weight: bold;
    background-image: url("${MailImage}");
    background-position: 5px;
    background-size: 25px;
    background-repeat: no-repeat;
`

const OnlineInfoContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    justify-content: center;
`

const OnlineStatusText = styled.div`
    font-size: 15px;
    padding-top: 3px;
    color: #a0a0a0;
`

const OnlineCircle = styled.div`
    width: 10px;
    height: 10px;
    background-color: #007a7a;
    border-radius: 50%;
    opacity: ${props => (props.isOnline ? "1" : "0")};
`

const InfoContainer = styled.div`


`

export default function InfoProfile({user, isOnline, lastOnlineDate, visible, setVisible, onOpenChat}) {

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [nickname, setNickname] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [aboutMe, setAboutMe] = useState("");
    const [avatar, setAvatar] = useState("");

    useEffect(() => {
        setName(user.name);
        setSurname(user.surname);
        setNickname(user.nickname);
        setAboutMe(user.aboutMe);
        setBirthdate(user.birthdate);
        setAvatar(user.avatarHref);
    }, [user])

    return (
        user && (
            <ShadowMainContainer visible={visible} onClick={() => setVisible(false)}>
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
                        <OnlineInfoContainer>
                            <OnlineCircle isOnline={isOnline}></OnlineCircle>
                            <OnlineStatusText>{DateParser.parseOnlineDate(isOnline, lastOnlineDate)}</OnlineStatusText>
                        </OnlineInfoContainer>
                    </AvatarSection>
                    <ButtonContainer>
                        <Button onClick={() => {onOpenChat && onOpenChat(user); setVisible(false)}}>Написать</Button>
                    </ButtonContainer>
                    <InfoContainer>
                        <NicknameField value={nickname} disabled={true}/>
                        {
                            birthdate && <DateField value={birthdate} disabled={true}/>
                        }
                    </InfoContainer>
                </ModalContainer>
            </ShadowMainContainer>
        )
    )
}