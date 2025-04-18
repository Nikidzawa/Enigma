import styled from "styled-components";
import SobachkaImage from "../../../../../../img/email.png";

const Container = styled.div`
    position: relative;
    display: flex;
    flex: 1;
`

const Label = styled.div`
    color: #8e8e8e;
    position: absolute;
    left: 12px;
    top: 5px;
    font-size: 15px;
`

const Input = styled.input`
    border: none;
    background-color: #353535;
    border-radius: 5px;
    color: white;
    height: 35px;
    outline: none;
    font-size: 17px;
    padding-top: 20px;
    padding-left: 33px;
    width: 100%;

    background-image: url(${SobachkaImage});
    background-size: 17px;
    background-repeat: no-repeat;
    background-position: 10px 29px;
`

const FieldContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    padding-top: 10px;
    gap: 10px;
`

export default function NicknameField ({value, setValue, disabled}) {
    return (
        <FieldContainer>
            <Container>
                <Label>{'Nickname'}</Label>
                <Input
                    placeholder={'Your nickname'}
                    value={value}
                    onChange={e => setValue(e.target.value.trim().toLowerCase())}
                    maxLength={30}
                    disabled={disabled}
                />
            </Container>
        </FieldContainer>
    )
}