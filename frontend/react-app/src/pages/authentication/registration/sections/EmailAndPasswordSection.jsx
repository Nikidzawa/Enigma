import EmailField from "../../components/fields/EmailField";
import PasswordField from "../../components/fields/PasswordField";
import {useRef} from "react";
import styled from "styled-components";

const FirstLineContainer = styled.div`
    position: absolute;
    left: calc(50% - 150px);
    top: -50px;
`

const SecondLineContainer = styled.div`
    position: absolute;
    left: calc(50% - 150px);
    top: 20px;
`

export default function EmailAndPasswordSection({onInputEmail, onInputPassword, onKeyDown}) {
    const passwordFieldRef = useRef(null);

    function emailFieldKeyListener(e) {
        if (e.code === "Enter") {
            passwordFieldRef.current.focus();
        }
    }

    return (
        <>
            <FirstLineContainer>
                <EmailField onInput={onInputEmail}
                            onKeyDown={emailFieldKeyListener}/>
            </FirstLineContainer>
            <SecondLineContainer>
                <PasswordField onInput={onInputPassword}
                               onKeyDown={onKeyDown}
                               ref={passwordFieldRef}
                               placeholder={"Choose password"}/>
            </SecondLineContainer>
        </>
    )
}