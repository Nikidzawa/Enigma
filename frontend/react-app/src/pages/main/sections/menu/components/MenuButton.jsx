import styled from "styled-components";
import MenuImg from "../../../../../img/menu.png";
import MenuController from "../../../../../store/MenuController";

const MenuButtonComponent = styled.img`
    height: 22px;
    width: 26px;
    cursor: pointer;
`

export default function MenuButton() {
    return (
        <MenuButtonComponent src={MenuImg} onClick={() => MenuController.setMenuVisible(true)}/>
    )
}