import styled from "styled-components";
import SendImage from "../../../../../img/send.png";
import AcceptImage from "../../../../../img/accept.png";
import {useState} from "react";
import ClientController from "../../../../../store/ClientController";
import ChatRoomsController from "../../../../../store/ChatRoomsController";
import MessageOptionsModalController from "../../../../../store/MessageOptionsModalController";
import ActionMessageComponent from "./ActionMessageComponent";
import {observer} from "mobx-react-lite";
import MessagesApi from "../../../../../api/internal/controllers/MessagesApi";
import ActiveChatInputController from "../../../../../store/ActiveChatInputController";

const InputContainer = styled.div`
    height: 50px;
    display: flex;
    align-items: center;
    border-top: 1px solid #707070;
    gap: 10px;
    padding: 0 5px;
`

const Input = styled.input`
    background-color: unset;
    border: none;
    color: white;
    width: 100%;
    height: 25px;
    outline: none;
    font-family: Rubik;
    font-size: 16px;
`

const SendButton = styled.img`
    width: 30px;
    cursor: pointer;
`

export default observer(function ActiveChatInput({sendMessage}) {
    const activeChat = ChatRoomsController.getActiveChat();

    const isEditMode = MessageOptionsModalController.getIsEditMode();
    const selectedMessage = MessageOptionsModalController.getSelectedMessageEntity();

    const text = ActiveChatInputController.getText();

    const [lastTypingCall, setLastTypingCall] = useState(0);

    function onInput(e) {
        ActiveChatInputController.setText(e.target.value);
        const now = Date.now();
        if (now - lastTypingCall > 2000) {
            ClientController.privateChatTyping(activeChat.companion.id);
            setLastTypingCall(now);
        }
    }

    async function handleSendMessage() {
        await sendMessage(text)
        ActiveChatInputController.setText('')
        setLastTypingCall(2000);
    }

    async function handleEditMessage() {
        const trimmedText = text.trim();
        if (trimmedText) {
            ChatRoomsController.changeMessage(activeChat.companion.id, selectedMessage.id, trimmedText);
        } else {
            handleDeleteMessage();
        }
        MessageOptionsModalController.stopEdit();
        ActiveChatInputController.setText('');
    }

    async function handleDeleteMessage() {
        const selectedMessageId = selectedMessage.id;
        const activeChatCompanionId = ChatRoomsController.getActiveChat().companion.id
        MessagesApi.del(selectedMessageId).then(response => {
            if (response.data) {
                ClientController.deleteMessage(selectedMessageId, activeChatCompanionId);
                ChatRoomsController.removeMessage(selectedMessageId, activeChatCompanionId);
            }
        });
    }

    return (
        isEditMode ?
            <>
                <ActionMessageComponent/>
                <InputContainer>
                    <Input value={text} onInput={onInput} placeholder={"Введите сообщение"}
                           onKeyDown={(e) => e.key === "Enter" && handleEditMessage()}/>
                    <SendButton onClick={handleEditMessage} src={AcceptImage}/>
                </InputContainer>
            </>
            :
            <InputContainer>
                <Input value={text} onInput={onInput} placeholder={"Введите сообщение"}
                       onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}/>
                <SendButton onClick={handleSendMessage} src={SendImage}/>
            </InputContainer>
    )
})