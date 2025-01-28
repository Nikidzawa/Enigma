import EmailField from "../../components/fields/EmailField";
import PasswordField from "../../components/fields/PasswordField";
import {useEffect, useRef, useState} from "react";
import styled from "styled-components";
import Logo from "../../../../img/img.png";
import {useNavigate} from "react-router-dom";
import Animation from "../components/Animation";
import FailFieldValidation from "../../components/fields/FailFieldValidation";
import UserDto from "../../../../api/dto/UserDto";
import CurrentUserController from "../../../../store/CurrentUserController";
import StringUtils from "../../../../helpers/StringUtils";
import EmailCodeController from "../store/EmailCodeController";
import Loader from "../components/Loader";
import UserApi from "../../../../api/controllers/UserApi";

const MainContainer = styled.div`
    display: flex;
    justify-content: center;
`

const FieldsContainer = styled.div`
    position: absolute;
    left: calc(50% - 150px);
    bottom: calc(50% - 55px);
    display: flex;
    gap: 50px;
    flex-direction: column;
`

const Title = styled.div`
    font-size: 35px;
    padding-bottom: 10px;
    font-weight: bold;
    font-family: Rubik;
    margin-bottom: 40px;
`

const TitleContainer = styled.div`
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-top: 45px;
`

const Image = styled.img`
    width: calc(53px + 2vh);
    height: calc(53px + 2vh);
`

const Button = styled.button`
    position: absolute;
    bottom: 100px;
    background-color: transparent;
    border: 1px solid white;
    color: white;
    padding: 8px;
    min-width: calc(140px + 1vh);
    min-height: 45px;
    font-size: 20px;
    border-radius: 15px;
    cursor: pointer;
    font-family: Rubik;
    display: flex;
    align-items: center;
    justify-content: center;
`

const LoginPageLink = styled.a`
    position: absolute;
    bottom: 40px;
    cursor: pointer;
    border-top: 1px white solid;
    padding: 10px;
`

const ExceptionContainer = styled.div`
    position: absolute;
    top: ${props => props.position ? props.position : '0px'};
    display: flex;
    flex-direction: column;
    gap: 10px;
    text-align: center;
`

export default function EmailAndPasswordSection({nextSection}) {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const passwordFieldRef = useRef(null);

    const [emailEx, setEmailEx] = useState(false);
    const [passwordLengthEx, setPasswordLengthEx] = useState(false);
    const [emailServicesEx, setEmailServicesEx] = useState(false);
    const [emailIsAlreadyUse, setEmailIsAlreadyUse] = useState(false);
    const [unexpectedEx, setUnexpectedEx] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setEmail(localStorage.getItem("email") || "");
        setPassword(localStorage.getItem("password") || "");
    }, [])

    function onInputEmail(e) {
        const fixedValue = StringUtils.replaceSpaces(e.target.value).toLowerCase();
        setEmail(fixedValue);

        if (emailEx && !StringUtils.isEmail(fixedValue)) {
            setEmailEx(true);
        } else {
            setEmailEx(false);
        }
    }

    function onInputPassword(e) {
        const value = StringUtils.replaceSpaces(e.target.value);
        setPassword(value);

        if (value.length < 6) {
            setPasswordLengthEx(true);
        } else {
            setPasswordLengthEx(false);
        }
    }

    async function validatedFirstSection() {
        setLoading(true);
        setUnexpectedEx(false);
        try {
            setEmailServicesEx(false);
            setPasswordLengthEx(false)
            setEmailEx(false);
            setEmailIsAlreadyUse(false)

            const fixedEmail = StringUtils.replaceSpaces(email);
            const fixedPassword = StringUtils.replaceSpaces(password);

            let emailIsEx = false;
            let passwordIsEx = false;

            // Проврека email
            if (!fixedEmail || !StringUtils.isEmail(fixedEmail)) {
                emailIsEx = true;
            }

            // Проврека пароля
            if (!fixedPassword || fixedPassword.length < 6) {
                passwordIsEx = true;
            }

            if (!(emailIsEx || passwordIsEx)) {
                await UserApi.emailIsUsed(fixedEmail).then(async result => {
                    if (result.data === true) {
                        setEmailIsAlreadyUse(true)
                    } else {
                        setEmailIsAlreadyUse(false)
                        await submit();
                    }
                })
            }

            setPasswordLengthEx(passwordIsEx)
            setEmailEx(emailIsEx)
        } catch (ex) {
            console.error(ex)
            setUnexpectedEx(true);
        } finally {
            setLoading(false);
        }
    }

    async function submit () {
        try {
            const user = new UserDto();
            user.email = StringUtils.replaceSpaces(email).toLowerCase();
            user.password = StringUtils.replaceSpaces(password);
            CurrentUserController.setUser(user);

            setEmailServicesEx(false)

            localStorage.setItem("email", user.email);
            localStorage.setItem("password", user.password);

            const code = await EmailCodeController.sendAuthCode(user.email);
            if (code) {
                EmailCodeController.setEmailCode(code);
                nextSection();
            } else {
                setEmailServicesEx(true);
            }
        } catch (ex) {
            console.log(ex)
            setEmailServicesEx(true);
        }
    }

    return (
        <MainContainer>
            <TitleContainer>
                <Image src={Logo}/>
                <Title>Registration</Title>
            </TitleContainer>
            <FieldsContainer>
                <EmailField
                    onKeyDown={e => e.code === "Enter" && passwordFieldRef.current.focus()}
                    onInput={onInputEmail}
                    value={email}
                />
                <ExceptionContainer position={"37px"}>
                    {emailEx && <FailFieldValidation>Не корректно заполнена почта</FailFieldValidation>}
                    {emailIsAlreadyUse && <FailFieldValidation>Указаная почта занята</FailFieldValidation>}
                </ExceptionContainer>
                <PasswordField
                    onKeyDown={e => e.code === "Enter" && validatedFirstSection()}
                    onInput={onInputPassword}
                    ref={passwordFieldRef}
                    placeholder={"Choose password"}
                    value={password}
                    />
                <ExceptionContainer position={"115px"}>
                    {passwordLengthEx && (<FailFieldValidation>Минимум 6 символов</FailFieldValidation>)}
                </ExceptionContainer>
                <ExceptionContainer position={"135px"}>
                    {unexpectedEx && (<FailFieldValidation>Произошла неизвестная ошибка, попробуйте позже</FailFieldValidation>)}
                    {emailServicesEx && (<FailFieldValidation>Ошибка почтового сервиса, проверьте адрес или попробуйте позже</FailFieldValidation>)}
                </ExceptionContainer>
            </FieldsContainer>
            <Button disabled={loading} onClick={validatedFirstSection}>
                {loading ? <Loader/> : "Next"}
            </Button>
            <LoginPageLink onClick={() => navigate("/login")}>Login</LoginPageLink>
        </MainContainer>
    )
}