import styled, {keyframes} from "styled-components";
import NicknameField from "./fields/NicknameField";
import {useEffect, useRef, useState} from "react";
import UserApi from "../../../../../../api/internal/controllers/UserApi";
import UserController from "../../../../../../store/UserController";

const fadeIn = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`

const fadeOut = keyframes`
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
`

const ShadowMainContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(19, 19, 19, 0.6);
    z-index: 1000;
    opacity: ${props => props.visible ? "1" : "0"};
    pointer-events: ${props => props.visible ? "auto" : "none"};;
    animation: ${props => props.visible ? fadeIn : props.isFirstRender ? 'none' : fadeOut} 0.2s ease;
    display: flex;
    justify-content: center;
    align-items: center;
`
const Description = styled.div`
    font-size: 14px;
    border-radius: 5px;
    padding: 7px;
    pointer-events: none;
    background-color: #353535;
`

const ModalContainer = styled.div`
    padding: 20px 15px;
    width: 350px;
    height: 220px;
    background-color: #1a1a1a;
    border-radius: 15px;
    box-shadow: 1px 1px 3px 3px rgba(250, 250, 250, 0.5);
    display: flex;
    flex-direction: column;
`

const NicknameContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-top: 10px;
`

const Label = styled.div`
    font-size: 20px;
    font-weight: bold;
    pointer-events: none;
`

const ButtonContainer = styled.div`
    display: flex;
    gap: 10px;
    align-self: end;
    margin-top: auto;
`

const ButtonSubmit = styled.button`
    font-size: 15px;
    width: 110px;
    height: 28px;
    background-color: #00646a;
    border: none;
    color: #ffffff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: Rubik;
`

const CancelButton = styled.button`
    font-size: 15px;
    width: 110px;
    height: 28px;
    background-color: transparent;
    border: none;
    color: #ffffff;
    cursor: pointer;
    font-family: Rubik;
`

const Exception = styled.div`
    color: red;
    font-size: 14px;
`

export default function NicknameChangeModal ({isVisible, setIsVisible, nickname, setNickname}) {
    const [value, setValue] = useState(nickname);
    const [isFirstRender, setIsFirstRender] = useState(false);

    const [nicknameAlreadyUsedEx, setNicknameAlreadyUsedEx] = useState(false);
    const [nicknameIsEmptyEx, setNicknameIsEmptyEx] = useState(false);
    const [unknownEx, setUnknownEx] = useState(false);
    const [userNotFoundEx, setUserNotFoundEx] = useState(false);

    useEffect(() => {
        isVisible && isFirstRender && setIsFirstRender(false);
    }, []);

    useEffect(() => {
        if (isVisible) {
            dropErrors();
            setValue(nickname);
        }
    }, [isVisible]);

    async function submit () {
        try {
            dropErrors();
            if (!value) {
                setNicknameIsEmptyEx(true);
                return
            }
            setIsVisible(false);
            if (value.trim() !== nickname.trim()) {
                await UserApi.editNickname(UserController.getCurrentUser().id, value).then(response => {
                    if (response.data === true) {
                        setNickname(value);
                        UserController.getCurrentUser().nickname = value;
                    }
                }).catch(ex => {
                    if (ex.status === 420) {
                        setNicknameAlreadyUsedEx(true);
                    } else if (ex.status === 404) {
                        setUserNotFoundEx(true);
                    } else {
                        setUnknownEx(true);
                    }
                });
            }
        } catch (ex) {
            setUnknownEx(true);
        }
    }

    function dropErrors() {
        setNicknameAlreadyUsedEx(false);
        setNicknameIsEmptyEx(false);
        setUnknownEx(false);
        setUserNotFoundEx(false);
    }

    return (
        <ShadowMainContainer
            visible={isVisible}
            isFirstRender={isFirstRender}
            onMouseDown={e => e.target === e.currentTarget && setIsVisible(false)}>
            <ModalContainer>
                <Label>Изменить ник</Label>
                <NicknameContainer>
                    <NicknameField value={value} setValue={setValue} disabled={false}
                                   onKeyDown={e => e.code === 'Enter' && submit()}/>
                    {nicknameIsEmptyEx && <Exception>Никнейм не может быть пустым</Exception>}
                    {nicknameAlreadyUsedEx && <Exception>Никнейм уже используется</Exception>}
                    <Description>Никнейм - это ваш уникальный идентификатор. По нему вас смогут найти другие пользователи</Description>
                    {unknownEx && <Exception>Неизвестная ошибка. Попробуйте позже</Exception>}
                    {userNotFoundEx && <Exception>Пользователь не найден, попробуйте заново авторизоваться</Exception>}
                </NicknameContainer>
                <ButtonContainer>
                    <CancelButton onClick={() => setIsVisible(false)}>Отменить</CancelButton>
                    <ButtonSubmit onClick={submit}>Сохранить</ButtonSubmit>
                </ButtonContainer>
            </ModalContainer>
        </ShadowMainContainer>
    )
}