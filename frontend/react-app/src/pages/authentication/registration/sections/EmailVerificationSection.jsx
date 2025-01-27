import {DotLottieReact} from "@lottiefiles/dotlottie-react";
import ConvertVideo from "../../../../img/convert.lottie";
import styled from "styled-components";
import EmailVerificationFields from "../../components/fields/EmailVerificationFields";
import {useEffect, useState} from "react";
import CurrentUserController from "../../../../store/CurrentUserController";
import FailFieldValidation from "../../components/fields/FailFieldValidation";
import MailApi from "../../../../api/MailApi";
import EmailCodeController from "../store/EmailCodeController";

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
    margin-top: 20px;
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
    width: 100%;
    left: calc(50% - 120px);
    bottom: 49%;
`

const NotReceive = styled.div`
    position: absolute;
    bottom: calc(4% - 3px);
    cursor: pointer;
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

const LinksContainer = styled.div`
    border-top: 1px white solid;
    position: absolute;
    bottom: 40px;
    padding: 10px;
    display: flex;
    gap: 10px;
`
const Link = styled.a`
    cursor: pointer;
`

const YourMailContainer = styled.div`
    text-align: center;
    width: 80%;
    font-size: 22px;
    font-weight: bold;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
`

const ImageSendVideo = styled(DotLottieReact)`
    width: 180px;
`

const ErrorsContainer = styled.div`
    position: absolute;
    top: 85px;
    width: 100%;
    height: 90px;
    display: flex;
    flex-direction: column;
    gap: 2px;
`


export default function EmailVerificationSection ({goNextSection, goBack}) {
    const [fieldEmptyEx, setFieldEmptyEx] = useState(false);
    const [fieldNotCorrectEx, setFieldNotCorrectEx] = useState(false);
    const [emailEx, setEmailEx] = useState(false);

    const [userCode, setUserCode] = useState("");
    const [mailCode, setMailCode] = useState("");

    const [canSendAgain, setCanSendAgain] = useState(true);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        setMailCode(EmailCodeController.getEmailCode())
        startTimer();
    }, [])

    useEffect(() => {
        if (userCode) {
            submitEmail();
        }
    }, [userCode])

    useEffect(() => {
        if (!canSendAgain) {
            const interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setCanSendAgain(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [canSendAgain]);

    async function sendEmailCodeAgain() {
        if (!canSendAgain) return;

        const code = await EmailCodeController.sendAuthCode();
        if (code) {
            setEmailEx(false);
            setMailCode(code);
            startTimer();
        } else {
            setEmailEx(true);
        }
    }

    function startTimer() {
        setCanSendAgain(false);
        setTimer(60);
    }

    function submitEmail () {
        setFieldEmptyEx(false);
        setFieldNotCorrectEx(false);
        // TODO: TEST
        console.log(userCode);
        if (userCode) {
            if (mailCode === userCode) {
                goNextSection();
            } else {
                setFieldNotCorrectEx(true)
            }
        } else {
            setFieldEmptyEx(true)
        }
    }

    return (
        <MainContainer onKeyDown={e => e.code === 'Enter' && submitEmail()}>
            <TitleContainer>
                <ImageSendVideo src={ConvertVideo} autoplay/>
                <YourMailContainer>{CurrentUserController.getCurrentUser().email}</YourMailContainer>
                <Title>Enter code from letter</Title>
            </TitleContainer>
            <FieldsContainer>
                <EmailVerificationFields setUserCode={setUserCode}/>
                <ErrorsContainer>
                    {fieldEmptyEx && <FailFieldValidation>Необходимо заполнить код</FailFieldValidation>}
                    {fieldNotCorrectEx && <FailFieldValidation>Не верный код</FailFieldValidation>}
                    {emailEx && <FailFieldValidation>Ошибка отправки сообщения</FailFieldValidation>}
                </ErrorsContainer>
            </FieldsContainer>
            <Button onClick={submitEmail}>Next</Button>
            <LinksContainer>
                <Link onClick={goBack}>Go Back</Link>
                <span>|</span>
                <Link onClick={sendEmailCodeAgain}>
                    {canSendAgain ? "Send again" : `Send again in ${timer}s`}
                </Link>
            </LinksContainer>
        </MainContainer>
    )
}