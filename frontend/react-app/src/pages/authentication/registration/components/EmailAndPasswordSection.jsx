import EmailField from "../../components/fields/EmailField";
import PasswordField from "../../components/fields/PasswordField";
import {useRef} from "react";
import styled from "styled-components";

const FirstLineContainer = styled.div`
    position: absolute;
    left: calc(50% - 150px);
    bottom: calc(50% - 48px);
    display: flex;
    gap: 40px;
    flex-direction: column;
`

export default function EmailAndPasswordSection({onInputEmail, onInputPassword, onKeyDown}) {
    const passwordFieldRef = useRef(null);

    function emailFieldKeyListener(e) {
        if (e.code === "Enter") {
            passwordFieldRef.current.focus();
        }
    }

    return (
        <FirstLineContainer>
            <EmailField onInput={onInputEmail}
                        onKeyDown={emailFieldKeyListener}/>
            <PasswordField onInput={onInputPassword}
                           onKeyDown={onKeyDown}
                           ref={passwordFieldRef}
                           placeholder={"Choose password"}/>
        </FirstLineContainer>
    )
}