import styled from "styled-components";
import UserController from "../../../../../store/UserController";
import MyProfileImage from "../../../../../img/account.png";
import SettingsImage from "../../../../../img/setting.png";
import LogoutImage from "../../../../../img/log-out.png";
import LogoImage from "../../../../../img/img.png"
import ClientController from "../../../../../store/ClientController";
import ChatRoomsController from "../../../../../store/ChatRoomsController";
import {observer} from "mobx-react-lite";

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
    gap: 5px;
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

export default observer(function MenuPanel({menuIsVisible, openProfile}) {
    const user = UserController.getCurrentUser();

    function logout () {
        localStorage.removeItem("TOKEN")
        ClientController.disconnect();
        ChatRoomsController.cleanupSubscriptions();
        window.location.href = '/login';
    }

    return (
        <LeftPanel visible={menuIsVisible} onClick={e => e.stopPropagation()}>
            <ProfileInfo>
                <ProfileImage src={user.avatarHref}/>
                <InfoSection>
                    <Name>{user.name} {user.surname}</Name>
                    <Info>@{user.nickname}</Info>
                </InfoSection>
            </ProfileInfo>
            <Panels>
                <div>
                    <Panel onClick={openProfile} image={MyProfileImage}>Мой профиль</Panel>
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
    )
})