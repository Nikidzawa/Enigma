import styled from "styled-components";
import CameraImg from "../../../../img/camera.png"
import {useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import FailFieldValidation from "../../components/fields/FailFieldValidation";
import EmailCodeController from "../store/EmailCodeController";
import IndividualDtoFull from "../../../../api/internal/dto/IndividualDtoFull";
import ImageResizer from "../../../components/ImageResizer";
import Loader from "../components/Loader";
import UserApi from "../../../../api/internal/controllers/UserApi";
import FireBase from "../../../../api/external/FireBase";
import UserController from "../../../../store/UserController";

const MainContainer = styled.div`
    display: flex;
    justify-content: center;
`

const ImageContainer = styled.div`
    position: absolute;
    top: 12%;
    border-radius: 50%;
    width: 150px;
    height: 150px;
    cursor: pointer;
    border: 2px solid white;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden
`

const ChooseImage = styled.input`
    position: absolute;
    top: 12%;
    border-radius: 50%;
    width: 150px;
    height: 150px;
    cursor: pointer;
    opacity: 0;
    z-index: 100;
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
    min-height: 45px;
    font-size: 18px;
    border-radius: 15px;
    cursor: pointer;
    font-family: Rubik;
    display: flex;
    align-items: center;
    justify-content: center;
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
    const [avatar, setAvatar] = useState(null);
    const surnameRef = useRef();

    const [nameEx, setNameEx] = useState(false);

    const [resizerVisible, setResizerVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const [loading, setLoading] = useState(false);

    async function register() {
        setLoading(true);
        try {
            const userDto = new IndividualDtoFull();
            userDto.name = name;
            userDto.surname = surname;
            userDto.email = localStorage.getItem("email") || EmailCodeController.getEmail();
            userDto.password = localStorage.getItem("password");
            userDto.lastLogoutDate = new Date();
            if (userDto.name && userDto.email && userDto.password) {
                await UserApi.save(userDto).then(
                    async result => {
                        const user = result.data.user;
                        user.avatarHref = await FireBase.uploadAvatar(FireBase.base64ToFile(avatar, `${user.id}`), user.id);
                        await UserApi.save(user).then(result => {
                            UserController.setUser(result.data.user);
                            localStorage.setItem("TOKEN", result.data.token)

                            localStorage.removeItem("email");
                            localStorage.removeItem("password");

                            navigate("/main");
                        });
                    }
                ).catch(error => {
                    navigate("/login");
                    console.error("Произошла ошибка, попробуйте зарегистрироваться снова. " + error)
                })
            }
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    }

    const handleSetAvatar = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onloadend = async () => {
                const result = reader.result;
                if (result) {
                    setSelectedImage(result);
                    setResizerVisible(true);
                }
            };
        }
    };

    function validate () {
        try {
            if (!name) {
                setNameEx(true);
            } else {
                setNameEx(false);
                register();
            }
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <>
            <MainContainer>
                <ImageContainer>
                    {
                        avatar ? <img src={avatar} width={'100%'} height={'100%'}/>
                               : <img src={CameraImg} width={'90px'} height={'90px'}/>
                    }
                </ImageContainer>
                <ChooseImage type={"file"} onChange={handleSetAvatar} accept="image/*"/>
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
                <Button disabled={loading} onClick={validate}>{loading ? <Loader/> : 'Registration'}</Button>
                <BackPageLink onClick={goBack}>Go Back</BackPageLink>
            </MainContainer>
            {
                resizerVisible && <ImageResizer src={selectedImage} setResizerVisible={setResizerVisible} visible={resizerVisible} setAvatar={setAvatar}/>
            }
        </>
    )
}