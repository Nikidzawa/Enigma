import styled, {keyframes} from "styled-components";
import {useEffect, useRef, useState} from "react";
import CameraImg from "../../../../../../img/camera2.png"
import CloseImage from "../../../../../../img/close2.png";
import {observer} from "mobx-react-lite";
import ImageResizer from "../../../../../components/ImageResizer";
import UserController from "../../../../../../store/UserController";
import IndividualDtoShort from "../../../../../../api/internal/dto/IndividualDtoShort";
import FireBase from "../../../../../../api/external/FireBase";
import UserApi from "../../../../../../api/internal/controllers/UserApi";
import ClientController from "../../../../../../store/ClientController";
import DateField from "./fields/DateField";
import TextField from "./fields/TextField";
import NicknameField from "./fields/NicknameField";
import ModalController from "../../../../../../store/ModalController";
import PresenceResponse from "../../../../../../network/response/PresenceResponse";
import OnlineStatusComponent from "../../../../components/onlineStatus/OnlineStatusComponent";
import PenImage from "../../../../../../img/pen.png"
import BookmarkImage from "../../../../../../img/bookmark.png"
import AboutMeField from "./fields/AboutMeField";

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
    width: 120px;
    height: 120px;
    border-radius: 50%;
`

const Bio = styled.div`
    display: flex;
    gap: 10px;
    flex: 1;
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

const Exception = styled.div`
    color: red;
    font-size: 15px;
    padding-left: 1px;
`

const OnlineStatusContainer = styled.div`
    padding-bottom: 5px;
`

const Edit = styled.img`
    width: 19px;
    height: 19px;
    cursor: pointer;
`

const EditAndCloseButton = styled.div`
    display: flex;
    gap: 25px;
    align-items: center;
`

const UserData = styled.div`
    padding: 20px 20px 0 20px;
`

const ButtonContainer2 = styled.div`
    display: flex;
    flex: 1;
    gap: 10px;
    width: 100%;
`

const Button2 = styled.button`
    width: 100%;
    height: 35px;
    background-color: transparent;
    color: #009398;
    border: 2px solid #009398;
    font-size: 15px;
    border-radius: 10px;
    cursor: pointer;
    font-weight: bold;
    background-image: url("${BookmarkImage}");
    background-position: 5px;
    background-size: 25px;
    background-repeat: no-repeat;
`

const MyProfile = observer(({ setVisible, visible }) => {
    const user = UserController.getCurrentUser();
    const stompClient = ClientController.getClient();

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [nickname, setNickname] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [aboutMe, setAboutMe] = useState("");
    const [avatar, setAvatar] = useState("");

    const [nicknameAlreadyUsed, setNicknameAlreadyUsed] = useState(false);
    const [nameIsEmptyEx, setNameIsEmptyEx] = useState(false);

    const [isOnline, setIsOnline] = useState(false);
    const [lastOnlineDate, setLastOnlineDate] = useState(null);

    const [resizerIsVisible, setResizerVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [avatarChanged, setAvatarChanged] = useState(false);

    const [loading, setLoading] = useState(false);
    const [isFirstRender, setIsFirstRender] = useState(true);

    const [isEditMode, setIsEditMode] = useState(false);

    const fileInputRef = useRef(null);

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            if (resizerIsVisible) {
                setResizerVisible(false);
            } else {
                setVisible(false);
            }
        }
    };

    useEffect(() => {
        visible && isFirstRender && setIsFirstRender(false);

        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }

        ModalController.setVisible(visible)

        if (visible) {
            window.addEventListener('keydown', handleKeyDown);
        } else {
            window.removeEventListener('keydown', handleKeyDown)
        }

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [visible, resizerIsVisible]);

    useEffect(() => {
        if (user && stompClient) {
            // Отправка запроса на получение статуса пользователя
            ClientController.checkPresence(user.id);

            // Подписка на получение онлайн статуса пользователя
            const presenceSubscription = stompClient.subscribe(`/client/${user.id}/personal/presence`, (message) => {
                const presenceResponse = PresenceResponse.fromJSON(JSON.parse(message.body));
                if (user.id === presenceResponse.userId) {
                    setIsOnline(presenceResponse.isOnline);
                    presenceResponse.lastOnlineDate && setLastOnlineDate(presenceResponse.lastOnlineDate);
                }
            });

            return () => presenceSubscription.unsubscribe();
        }
    }, [user, stompClient]);

    useEffect(() => {
        if (visible) {
            setName(user.name);
            setSurname(user.surname);
            setNickname(user.nickname);
            setAboutMe(user.aboutMe)
            setBirthdate(user.birthdate)
            setAvatar(user.avatarHref)
        }
    }, [user, visible])

    useEffect(() => {
        if (visible) {
            setIsEditMode(false);
        } else {
            validate();
        }
    }, [visible]);

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
        const newUserData = new IndividualDtoShort(user.id, nickname, name, surname, birthdate ? new Date(birthdate) : null, aboutMe,
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
                <ShadowMainContainer visible={visible}
                                     isFirstRender={isFirstRender}
                                     onMouseDown={e => e.target === e.currentTarget && setVisible(false)}>
                    <ModalContainer onClick={e => e.stopPropagation()}>
                        <UserData>
                            <UpperContainer>
                                <Name>My Profile</Name>
                                <EditAndCloseButton>
                                    <Edit src={PenImage} onClick={() => setIsEditMode(!isEditMode)}/>
                                    <Close src={CloseImage} onClick={() => setVisible(false)}/>
                                </EditAndCloseButton>
                            </UpperContainer>
                            <AvatarSection>
                                <AvatarContainer>
                                    <ProfileImage src={avatar}/>
                                    {
                                        isEditMode &&
                                        <ChooseAvatarContainer>
                                            <ChooseAvatar src={CameraImg}/>
                                            <ChooseAvatarTrigger ref={fileInputRef} type={"file"} onChange={handleSetAvatar} accept="image/*"/>
                                        </ChooseAvatarContainer>
                                    }
                                </AvatarContainer>
                                <UserInfo>
                                    <Fio>{name} {surname}</Fio>
                                </UserInfo>
                                {
                                    !(!isEditMode && !aboutMe) && <AboutMeField value={aboutMe} setValue={setAboutMe} disabled={!isEditMode}/>
                                }
                                {
                                    !isEditMode &&
                                    <OnlineStatusContainer>
                                        <OnlineStatusComponent isTyping={false} isOnline={isOnline} lastOnlineDate={lastOnlineDate}/>
                                    </OnlineStatusContainer>
                                }
                            </AvatarSection>
                        </UserData>
                        <Fields>
                            {
                                !isEditMode &&
                                <ButtonContainer2>
                                    <Button2>Избранные сообщения</Button2>
                                </ButtonContainer2>
                            }
                            {
                                isEditMode &&
                                <Bio>
                                    <TextField placeholder={'Your name'} label={'First name'} value={name} setValue={setName}
                                               maxLength={25}/>
                                    <TextField placeholder={"Your surname"} label={'Last name'} value={surname}
                                               setValue={setSurname} maxLength={25}/>
                                </Bio>
                            }
                            {nameIsEmptyEx && <Exception>Имя не может быть пустым</Exception>}
                            <NicknameField value={nickname} setValue={setNickname} disabled={!isEditMode}/>
                            {nicknameAlreadyUsed && <Exception>Никнейм уже используется</Exception>}
                            <DateField value={birthdate} setValue={setBirthdate} disabled={!isEditMode}/>
                        </Fields>
                    </ModalContainer>
                </ShadowMainContainer>
                {
                    <ImageResizer src={selectedImage}
                                  visible={resizerIsVisible}
                                  setResizerVisible={setResizerVisible}
                                  setAvatar={setAvatar}
                                  setAvatarChanged={setAvatarChanged}
                    />
                }
            </>
        )
    )
});

export default MyProfile;