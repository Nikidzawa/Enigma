import styled from "styled-components";
import {useRef} from "react";
import PasswordField from "../../components/fields/PasswordField";
import NicknameOrEmailField from "./NicknameOrEmailField";

const FirstLineContainer = styled.div`
    position: absolute;
    left: calc(50% - 150px);
    bottom: calc(50% - 48px);
    display: flex;
    gap: 40px;
    flex-direction: column;
`

const ForgotPasswordLink = styled.a`
    position: absolute;
    bottom: -25px;
    left: 0;
    font-size: 13px;
    cursor: pointer;
`

export default function NicknameOrEmailAndPasswordFields({onInputEmailOrNickname, onInputPassword, onKeyDown}) {
    const passwordFieldRef = useRef(null);

    function emailFieldKeyListener(e) {
        if (e.code === "Enter") {
            passwordFieldRef.current.focus();
        }
    }

    return (
        <FirstLineContainer>
            <NicknameOrEmailField onInput={onInputEmailOrNickname}
                                  onKeyDown={emailFieldKeyListener}/>
            <PasswordField onInput={onInputPassword}
                           onKeyDown={onKeyDown}
                           ref={passwordFieldRef}
                           placeholder={"Choose password"}/>
            <ForgotPasswordLink>Forgot password?</ForgotPasswordLink>
        </FirstLineContainer>
    )
}