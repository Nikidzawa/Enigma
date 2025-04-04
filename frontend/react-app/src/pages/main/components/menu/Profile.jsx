import styled, {keyframes} from "styled-components";
import {useEffect, useState} from "react";
import UserController from "../../../../store/UserController";
import CameraImg from "../../../../img/camera2.png"
import Field from "./Field";
import CloseImage from "../../../../img/close2.png";
import FireBase from "../../../../api/external/FireBase";
import UserApi from "../../../../api/internal/controllers/UserApi";
import {observer} from "mobx-react-lite";
import UserDtoShort from "../../../../api/internal/dto/UserDtoShort";
import DateField from "./DateField";
import NicknameField from "./NicknameField";
import ImageResizer from "./ImageResizer";
import Loader from "../../../authentication/registration/components/Loader";
import ClientController from "../../../../store/ClientController";

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
    padding: 25px;
    position: relative;
    box-shadow: 1px 1px 6px 5px rgba(250, 250, 250, 0.5);
    width: 420px;
`

const ChooseAvatarContainer = styled.div`
    position: absolute;
    bottom: 0;
    right: 0;
    background-color: #1a1a1a;
    padding: 5px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
`

const ChooseAvatar = styled.img`
    width: 23px;
    cursor: pointer;
`

const ChooseAvatarTrigger = styled.input`
    position: absolute;
    top: -20px;
    left: -5px;
    width: calc(100% + 10px);
    height: calc(100% + 20px);
    opacity: 0;
    cursor: pointer;
`;

const ProfileImage = styled.img`
    width: 110px;
    height: 110px;
    border-radius: 50%;
`

const Bio = styled.div`
    display: flex;
    gap: 10px;
    flex: 1;
`

const Button = styled.button`
    background-color: transparent;
    border: 2px solid #d8d8d8;
    color: #d8d8d8;
    min-width: 130px;
    min-height: 40px;
    font-size: 19px;
    border-radius: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
`

const ButtonContainer = styled.div`
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    margin: 30px 0 10px 0;
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
    gap: 10px;
    padding-top: 30px;
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
`

const Fields = styled.div`
    padding-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
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

const Exception = styled.div`
    color: red;
    font-size: 15px;
    padding-left: 1px;
`

const Profile = observer(({ setVisible, visible }) => {
    const user = UserController.getCurrentUser();

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [nickname, setNickname] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [aboutMe, setAboutMe] = useState("");
    const [avatar, setAvatar] = useState("");

    const [nicknameAlreadyUsed, setNicknameAlreadyUsed] = useState(false);
    const [nameIsEmptyEx, setNameIsEmptyEx] = useState(false);

    const [resizerIsVisible, setResizerVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [avatarChanged, setAvatarChanged] = useState(false);

    const [loading, setLoading] = useState(false);
    const [isFirstRender, setIsFirstRender] = useState(true);

    useEffect(() => {
        visible && isFirstRender && setIsFirstRender(false);
    }, [visible]);

    useEffect(() => {
        setName(user.name);
        setSurname(user.surname);
        setNickname(user.nickname);
        setAboutMe(user.aboutMe)
        setBirthdate(user.birthdate)
        setAvatar(user.avatarHref)
    }, [user, visible])

    async function validate() {
        setLoading(true)
        setNicknameAlreadyUsed(false);
        setNameIsEmptyEx(false);
        try {
            if (!name) {
                setNameIsEmptyEx(true);
                return;
            }
            await UserApi.nicknameIsUsed(nickname, user.id).then(async response => {
                if (response.data === false) {
                    await saveUser();
                    setAvatarChanged(false);
                } else {
                    setNicknameAlreadyUsed(true);
                }
            })
        } finally {
            setLoading(false)
        }
    }

    async function saveUser() {
        const newUserData = new UserDtoShort(user.id, nickname, name, surname, new Date(birthdate), aboutMe,
            avatarChanged ? await FireBase.uploadAvatar(FireBase.base64ToFile(avatar, user.id), user.id) : avatar
        );
        UserApi.edit(newUserData).then(() => {
            UserController.setUser(newUserData);
            setVisible(false);
            ClientController.updateUserProfile(newUserData.id);
        });
    }

    const handleSetAvatar = async (e) => {
        const file = e.target.files[0];
        if (!file || !user) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = async () => {
            const result = reader.result;
            if (result) {
                setSelectedImage(result);
                setResizerVisible(true);
            }
        };
    };

    return (
        user && (
            <>
                <ShadowMainContainer visible={visible} onClick={() => setVisible(false)} isFirstRender={isFirstRender}>
                    <ModalContainer onClick={e => e.stopPropagation()}>
                        <UpperContainer>
                            <Name>My Profile</Name>
                            <Close src={CloseImage} onClick={() => setVisible(false)}/>
                        </UpperContainer>
                        <AvatarSection>
                            <AvatarContainer>
                                <ProfileImage src={avatar}/>
                                <ChooseAvatarContainer>
                                    <ChooseAvatar src={CameraImg}/>
                                    <ChooseAvatarTrigger type={"file"} onChange={handleSetAvatar} accept="image/*"/>
                                </ChooseAvatarContainer>
                            </AvatarContainer>
                            <UserInfo>
                                <Fio>{name} {surname}</Fio>
                            </UserInfo>
                            { aboutMe && <AboutMe>{aboutMe}</AboutMe> }
                        </AvatarSection>
                        <Fields>
                            <Bio>
                                <Field placeholder={'Your name'} label={'First name'} value={name} setValue={setName}
                                       maxLength={25}/>
                                <Field placeholder={"Your surname"} label={'Last name'} value={surname}
                                       setValue={setSurname} maxLength={25}/>
                            </Bio>
                            {nameIsEmptyEx && <Exception>Имя не может быть пустым</Exception>}
                            <NicknameField value={nickname} setValue={setNickname}/>
                            {nicknameAlreadyUsed && <Exception>Никнейм уже используется</Exception>}
                            <DateField value={birthdate} setValue={setBirthdate}/>
                            <Field placeholder={"Tell about you"} label={'About me'} value={aboutMe} setValue={setAboutMe}
                                   maxLength={120}/>
                        </Fields>
                        <ButtonContainer>
                            <Button onClick={validate}>{loading ? <Loader/> : "Edit"}</Button>
                        </ButtonContainer>
                    </ModalContainer>
                </ShadowMainContainer>
                {
                    resizerIsVisible && <ImageResizer src={selectedImage} visible={resizerIsVisible} setResizerVisible={setResizerVisible} setAvatar={setAvatar} setAvatarChanged={setAvatarChanged}/>
                }
            </>
        )
    )
});

export default Profile;