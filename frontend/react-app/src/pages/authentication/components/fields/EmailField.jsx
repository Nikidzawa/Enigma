import MailImg from "../../../../img/mail.png";
import styled from "styled-components";

const EmailInput = styled.input`
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
    padding-bottom: 2px;
    font-size: 17px;
`

export default function EmailField({onKeyDown, onInput, value}) {
    return (
        <EmailInput
            autoFocus={true}
            onKeyDown={onKeyDown}
            onInput={onInput}
            placeholder={"Enter your email"}
            image={MailImg}
            value={value}
        />
    )
}