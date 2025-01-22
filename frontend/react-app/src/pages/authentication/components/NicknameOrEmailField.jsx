import User from "../../../img/user.png";
import styled from "styled-components";

const NicknameOrEmailFieldInput = styled.input`
    background-color: unset;
    border: none;
    border-bottom: 1px solid white;
    color: white;
    min-width: 250px;
    height: 25px;
    outline: none;
    font-family: Rubik;
    background-image: url(${props => props.image});
    background-size: 25px;
    background-repeat: no-repeat;
    background-position: left;
    padding-left: 35px;
    background-position-y: 0;
    padding-bottom: 2px;
    font-size: 17px;
`

export default function NicknameOrEmailField({onKeyDown, onInput}) {
    return (
        <NicknameOrEmailFieldInput
            onKeyDown={onKeyDown}
            onInput={onInput}
            placeholder={"Nickname or email"}
            image={User}
        />
    )
}