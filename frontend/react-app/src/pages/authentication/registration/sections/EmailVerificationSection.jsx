import {DotLottieReact} from "@lottiefiles/dotlottie-react";
import ConvertVideo from "../../../../img/convert.lottie";
import styled from "styled-components";
import EmailVerificationFields from "../../components/fields/EmailVerificationFields";
import Animation from "../components/Animation";
import {useRef} from "react";

const MainContainer = styled.div`
    display: flex;
    justify-content: center;
`

const TitleContainer = styled.div`
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin-top: 30px;
`

const Title = styled.div`
    font-size: 35px;
    font-weight: bold;
    font-family: Rubik;
    width: 80%;
    text-align: center;
`

const FieldsContainer = styled.div`
    position: absolute;
    left: calc(50% - 120px);
    bottom: 50%;
`

const Button = styled.button`
    position: absolute;
    bottom: 100px;
    background-color: transparent;
    border: 1px solid white;
    color: white;
    padding: 8px;
    min-width: calc(140px + 1vh);
    min-height: calc(28px + 1vh);
    font-size: 20px;
    border-radius: 15px;
    cursor: pointer;
    font-family: Rubik;
`

const BackPageLink = styled.a`
    position: absolute;
    bottom: 40px;
    cursor: pointer;
    border-top: 1px white solid;
    padding: 10px;
`



export default function EmailVerificationSection ({submitEmail, goBack}) {

    const fieldsRef = useRef(null);

    function handleSubmit() {
        if (fieldsRef.current) {
            fieldsRef.current.submit();
        }
    }

    return (
        <MainContainer onKeyDown={e => e.code === 'Enter' && handleSubmit()}>
            <TitleContainer>
                <DotLottieReact
                    style={{width: '180px'}}
                    src={ConvertVideo}
                    autoplay
                />
                <Title>Enter code from letter</Title>
            </TitleContainer>
            <FieldsContainer>
                <EmailVerificationFields ref={fieldsRef} submitEmail={submitEmail}/>
            </FieldsContainer>
            <Button onClick={handleSubmit}>Next</Button>
            <BackPageLink onClick={goBack}>Go Back</BackPageLink>
        </MainContainer>
    )
}