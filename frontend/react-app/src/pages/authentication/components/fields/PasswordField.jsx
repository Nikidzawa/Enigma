import {forwardRef, useState} from "react";
import Lock from "../../../../img/lock.png";
import OpenedEyeImg from "../../../../img/opened_eye.png";
import ClosedEyeImg from "../../../../img/closed_eye.png";
import styled from "styled-components";


const PasswordContainer = styled.div`
    position: relative;
`

const PasswordInput = styled.input`
    background-color: unset;
    border: none;
    border-bottom: 1px solid white;
    color: white;
    min-width: calc(225px + 1vh);
    height: 25px;
    outline: none;
    font-family: Rubik;
    background-image: url(${props => props.image});
    background-size: 25px;
    background-repeat: no-repeat;
    background-position: left center;
    padding-left: 35px;
    padding-right: 37px;
    background-position-y: 0;
    padding-bottom: 2px;
    font-size: 17px;
`

const Eye = styled.img`
    width: 30px;
    position: absolute;
    right: 0;
    bottom: 2px;
    cursor: pointer;
`

const PasswordField = forwardRef(({onInput, placeholder, onKeyDown, value}, ref) => {
    const [passwordIsVisible, setPasswordIsVisible] = useState(false);

    return (
        <PasswordContainer>
            <PasswordInput
                ref={ref}
                onInput={onInput}
                onKeyDown={onKeyDown}
                type={passwordIsVisible ? "text" : "password"}
                placeholder={placeholder}
                image={Lock}
                value={value}
            />
            <Eye
                onClick={() => setPasswordIsVisible(!passwordIsVisible)}
                src={passwordIsVisible ? OpenedEyeImg : ClosedEyeImg}
            />
        </PasswordContainer>
    );
});

export default PasswordField;