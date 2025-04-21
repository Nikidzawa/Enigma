import {useEffect, useState} from "react";
import ClientController from "../../store/ClientController";
import UserController from "../../store/UserController";
import Main from "./Main";
import {observer} from "mobx-react-lite";
import Loader from "../../pages/authentication/registration/components/Loader";
import styled from "styled-components";
import LogoImg from "../../img/img.png"

const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    flex: 1;
    align-items: center;
    justify-content: center;
    height: 90vh;
`

const Logo = styled.img`
    width: 90px;
    height: 90px;
`

const ErrorText = styled.div`
    font-size: 16px;
    text-align: center;
    font-weight: bold;
`

const ErrorTextContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
`

export default observer(function InitMain() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const user = UserController.getCurrentUser();
    const stompClient = ClientController.getClient();

    useEffect(() => {
        try {
            updateUser().then(user => ClientController.connect(user.id));
        } catch (err) {
            console.error(`Fail init: ${err}`);
            setError(true);
        } finally {
            setIsLoading(false);
        }

        async function updateUser() {
            if (!user || !user.id) {
                const fetchedUser = await UserController.fetchUserByToken();
                UserController.setUser(fetchedUser);
                return fetchedUser;
            } else return user;
        }
    }, []);

    if (isLoading) {
        return <MainContainer><Loader/></MainContainer>
    }

    if (error) {
        return (
            <MainContainer>
                <Logo src={LogoImg}/>
                <ErrorTextContainer>
                    <ErrorText>Сервисы Enigma временно недоступны</ErrorText>
                    <ErrorText>Повторите попытку позже</ErrorText>
                </ErrorTextContainer>
            </MainContainer>
        );
    }

    if (user && user.id && stompClient) {
        return <Main/>;
    }
})