import MailImg from "../../../../img/mail.png";
import styled from "styled-components";

const EmailInput = styled.input`
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
    background-position-y: 5px;
    padding-bottom: 2px;
    font-size: 17px;
`

export default function EmailField ({onKeyDown, onInput}) {
    return (
        <EmailInput
            onKeyDown={onKeyDown}
            onInput={onInput}
            placeholder={"Enter your email"}
            image={MailImg}
        />
    )
}