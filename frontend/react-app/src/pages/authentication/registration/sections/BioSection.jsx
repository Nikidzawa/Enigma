import styled from "styled-components";
import CameraImg from "../../../../img/camera.png"
import CurrentUserController from "../../../../store/CurrentUserController";
import UserApi from "../../../../api/controllers/UserApi";
import UserDto from "../../../../api/dto/UserDto";
import {useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import FailFieldValidation from "../../components/fields/FailFieldValidation";
import JwtTokenAndUser from "../../../../api/dto/JwtTokenAndUser";

const MainContainer = styled.div`
    display: flex;
    justify-content: center;
`

const Title = styled.div`
    position: absolute;
    top: 35%;
    font-size: 35px;
    font-weight: bold;
    font-family: Rubik;
    width: 80%;
    text-align: center;
`


const Image = styled.img`
    width: calc(50px + 2vh);
    height: calc(50px + 2vh);
`

const ImageContainer = styled.div`
    position: absolute;
    top: 12%;
    border: 2px solid white;
    border-radius: 50%;
    padding: 35px;
    cursor: pointer;
`

const FieldsContainer = styled.div`
    position: absolute;
    top: 45%;
    display: flex;
    gap: 50px;
    flex-direction: column;
`

const Input = styled.input`
    background-color: unset;
    border: none;
    border-bottom: 1px solid white;
    color: white;
    min-width: calc(205px + 5vh);
    height: 25px;
    outline: none;
    font-family: Rubik;
    background-image: url(${props => props.image});
    background-size: 25px;
    background-repeat: no-repeat;
    background-position: left center;
    padding-bottom: 2px;
    font-size: 17px;
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

const ExceptionContainer = styled.div`
    position: absolute;
    top: ${props => props.position ? props.position : '0px'};
`


export default function BioSection ({goBack}) {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const surnameRef = useRef();

    const [nameEx, setNameEx] = useState(false);

    async function register() {
        const userDto = CurrentUserController.getCurrentUser();
        userDto.name = name;
        userDto.surname = surname;

        if (userDto && userDto.email && userDto.password && userDto.name) {
            UserApi.save(userDto).then(
                result => {
                    CurrentUserController.setUser(result.user);
                    localStorage.setItem("TOKEN", result.token)

                    localStorage.removeItem("email");
                    localStorage.removeItem("password");

                    navigate("/main");
                }
            ).catch(error => {
                navigate("/login");
                console.error("Ошибка, попробуйте зарегистрироваться снова " + error)
            })
        }
    }

    function validate () {
        if (!name) {
            setNameEx(true);
        } else {
            setNameEx(false);
            register();
        }
    }

    return (
        <MainContainer>
            <ImageContainer>
                <Image src={CameraImg}/>
            </ImageContainer>
            <FieldsContainer>
                <Input value={name}
                       onInput={e => setName(e.target.value)}
                       onKeyDown={e => e.code === 'Enter' && surnameRef.current.focus()}
                       autoFocus={true}
                       placeholder={"Name"}/>
                <ExceptionContainer position={"38px"}>
                    {nameEx && (<FailFieldValidation>Укажите имя</FailFieldValidation>)}
                </ExceptionContainer>
                <Input value={surname}
                       onInput={e => setSurname(e.target.value)}
                       onKeyDown={e => e.code === 'Enter' && validate()}
                       placeholder={"Surname (optional)"}
                       ref={surnameRef}
                />
            </FieldsContainer>
            <Button onClick={validate}>Register</Button>
            <BackPageLink onClick={goBack}>Go Back</BackPageLink>
        </MainContainer>
    )
}