import styled from "styled-components";
import {useState} from "react";


const MainContainer = styled.div`
    position: absolute;
`

const Fields = styled.div`
    display: flex;
    gap: 20px;
`

const Field = styled.input`
    background-color: transparent;
    border: none;
    border-bottom: 1px solid white;
    width: 35px;
    height: 70px;
    color: white;
    font-size: 50px;
    outline: none;
    text-align: center;
`

export default function EmailVerificationFields() {
    const [firstValue, setFirstValue] = useState("")
    const [secondValue, setSecondValue] = useState("")
    const [thirdValue, setThirdValue] = useState("")
    const [fourthValue, setFourthValue] = useState("")

    return (
        <MainContainer>
            <Fields>
                <Field/>
                <Field/>
                <Field/>
                <Field/>
            </Fields>
        </MainContainer>
    )
}