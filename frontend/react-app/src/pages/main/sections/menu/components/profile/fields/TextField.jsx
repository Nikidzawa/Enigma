import styled from "styled-components";

const Container = styled.div`
    position: relative;
    display: flex;
    flex: 1;
`

const Label = styled.div`
    color: #8e8e8e;
    position: absolute;
    left: 10px;
    top: 6px;
    font-size: 15px;
    pointer-events: none;
`

const Input = styled.input`
    border: none;
    background-color: #333333;
    border-radius: 5px;
    color: white;
    min-height: 35px;
    outline: none;
    font-size: 17px;
    padding-top: 20px;
    padding-left: 10px;
    padding-right: 5px;
    width: 100%;
`

const FieldContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    padding-top: 10px;
    gap: 10px;
`

export default function TextField ({placeholder, label, value, setValue, maxLength}) {
    return (
        <FieldContainer>
            <Container>
                <Label>{label}</Label>
                <Input placeholder={placeholder}
                       value={value}
                       onChange={e => setValue(e.target.value)}
                       maxLength={maxLength}
                />
            </Container>
        </FieldContainer>
    )
}