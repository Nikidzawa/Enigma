import styled from "styled-components";
import EditActionImage from "../../../../../img/pencil.png";
import CloseImage from "../../../../../img/close2.png";
import MessageOptionsModalController from "../../../../../store/MessageOptionsModalController";
import {observer} from "mobx-react-lite";

const Container = styled.div`
    background: #1b1b1b;
    padding: 5px;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 10px;
`;

const TextContainer = styled.div`
    min-width: 0;
    overflow: hidden;
`;

const ActionName = styled.div`
    cursor: default;
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const MessageText = styled.div`
    cursor: pointer;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const ActionIcon = styled.img`
    width: 22px;
    height: 22px;
    flex-shrink: 0;
`;

const CloseButton = styled.img`
    cursor: pointer;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
`;

export default observer(function ActionMessageComponent() {
    return (
        <Container>
            <ActionIcon src={EditActionImage} alt="ActionIcon"/>
            <TextContainer>
                <ActionName>Редактировать</ActionName>
                <MessageText>{MessageOptionsModalController.getSelectedMessageEntity().text}</MessageText>
            </TextContainer>
            <CloseButton src={CloseImage} alt="Close" onClick={() => MessageOptionsModalController.setIsEditMode(false)}/>
        </Container>
    );
})