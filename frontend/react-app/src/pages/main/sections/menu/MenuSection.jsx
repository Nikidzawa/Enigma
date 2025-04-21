import styled, {keyframes} from "styled-components";
import {observer} from "mobx-react-lite";
import MenuController from "../../../../store/MenuController";
import MenuPanel from "./components/MenuPanel";
import MyProfile from "./components/profile/MyProfile";
import {useState} from "react";

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

export default observer(function MenuSection() {
    const menuIsVisible = MenuController.menuIsVisible();
    const [profileVisible, setProfileVisible] = useState(false);

    function openProfile() {
        MenuController.setMenuVisible(false);
        setProfileVisible(true);
    }

    return (
        <>
            <ShadowMainContainer visible={menuIsVisible} onClick={() => MenuController.setMenuVisible(false)}>
                <MenuPanel menuIsVisible={menuIsVisible} openProfile={openProfile}/>
            </ShadowMainContainer>
            <MyProfile visible={profileVisible} setVisible={setProfileVisible}/>
        </>
    )
})