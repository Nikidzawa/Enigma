import styled from "styled-components";
import EditImg from "../../../../../img/pencil.png";
import DeleteImg from "../../../../../img/delete.png"
import ReplyImg from "../../../../../img/reply.png"
import WhiteCheckMarkImg from "../../../../../img/two-ticks.png";
import BlackCheckMark from "../../../../../img/two-ticks-black.png";
import MessageOptionsModalController from "../../../../../store/MessageOptionsModalController";
import {observer} from "mobx-react-lite";
import MessagesApi from "../../../../../api/internal/controllers/MessagesApi";
import ClientController from "../../../../../store/ClientController";
import ChatRoomsController from "../../../../../store/ChatRoomsController";
import ActiveChatInputController from "../../../../../store/ActiveChatInputController";
import UserController from "../../../../../store/UserController";


const Background = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    pointer-events: ${props => props.isVisible ? "auto" : "none"};
    transition: opacity 0.2s ease;
    opacity: ${props => props.isVisible ? "1" : "0"};
`

const MainContainer = styled.div`
    position: fixed;
    height: auto;
    width: 190px;
    top: ${props => props.posY}px;
    left: ${props => props.posX}px;
    border-radius: 5px;
`
const Buttons = styled.div`
    background-color: #040404;
    padding: 5px 0 3px 0;
`

const Button = styled.div`
    padding: 6px 10px;
    background-color: #040404;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #242424;
    }

    height: 23px;
    display: flex;
    gap: 12px;
    align-items: center;
    cursor: pointer;
`

const ButtonImage = styled.img`
    width: 20px;
`

const ButtonName = styled.div`
    font-size: 14px;
`

const ReadData = styled.div`
    padding: 8px 14px;
    background-color: #040404;
    border-top: 5px solid #1d1d1d;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 5px;
`

const ReadMark = styled.img`
    width: 14px;
    height: 8px;
`

export default observer(function MessageOptionsModal () {

    const selectedMessageCoordinates = MessageOptionsModalController.getSelectedMessageCoordinates();
    const selectedMessageEntity = MessageOptionsModalController.getSelectedMessageEntity();

    function close () {
        MessageOptionsModalController.setIsOpen(false)
    }

    async function handleDeleteMessage() {
        const selectedMessageId = selectedMessageEntity.id;
        const activeChatCompanionId = ChatRoomsController.getActiveChat().companion.id
        MessagesApi.del(selectedMessageId).then(response => {
            if (response.data) {
                ClientController.deleteMessage(selectedMessageId, activeChatCompanionId);
                ChatRoomsController.removeMessage(selectedMessageId, activeChatCompanionId);
            }
        });
        MessageOptionsModalController.closeAndClearData();
    }

    async function handleEditMessage() {
        MessageOptionsModalController.setIsEditMode(true);
        ActiveChatInputController.setText(selectedMessageEntity.text)
    }

    const isMyMessage = () => selectedMessageEntity.senderId === UserController.getCurrentUser().id;

    return (
        <Background isVisible={MessageOptionsModalController.getIsOpen()} onMouseUp={close}>
            <MainContainer
                posX={isMyMessage() ? selectedMessageCoordinates.x - 190 : selectedMessageCoordinates.x}
                posY={selectedMessageCoordinates.y}
                onMouseUp={close}>
                    {
                        isMyMessage() ? (
                            <Buttons>
                                <Button>
                                    <ButtonImage src={ReplyImg}/>
                                    <ButtonName>Ответить</ButtonName>
                                </Button>
                                <Button onClick={handleEditMessage}>
                                    <ButtonImage src={EditImg}/>
                                    <ButtonName>Изменить</ButtonName>
                                </Button>
                                <Button onClick={handleDeleteMessage}>
                                    <ButtonImage src={DeleteImg}/>
                                    <ButtonName>Удалить</ButtonName>
                                </Button>
                            </Buttons>
                        ) :
                            <Buttons>
                                <Button>
                                    <ButtonImage src={ReplyImg}/>
                                    <ButtonName>Ответить</ButtonName>
                                </Button>
                            </Buttons>
                    }
                <ReadData>
                    {selectedMessageEntity &&
                        (
                            selectedMessageEntity.isRead ? (
                                <>
                                    <ReadMark src={WhiteCheckMarkImg}/>
                                    <div>Прочитано</div>
                                </>
                            ) : (
                                <>
                                    <ReadMark src={BlackCheckMark}/>
                                    <div>Не прочитано</div>
                                </>
                            )
                        )
                    }
                </ReadData>
            </MainContainer>
        </Background>
    )
})