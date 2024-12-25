import {useEffect, useState} from "react";
import styled from "styled-components";
import ActiveChat from "./components/ActiveChat";
import ChatApi from "../../api/ChatApi";
import CurrentUserController from "../../store/CurrentUserController";
import ActiveChatController from "../../store/ActiveChatController";
import ChatRoom from "./components/ChatRoom";
import {observer, Observer} from "mobx-react-lite";

const MainContainer = styled.main`
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: space-between;
`;

const ChatList = styled.div`
    height: 100vh;
    width: ${({ width }) => width}px;
    position: relative;
`;

const Resizer = styled.div`
    width: 2px;
    cursor: ew-resize;
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    background: rgba(255, 255, 255, 0.5);
`;

export default observer(function Main() {
    const [chatListWidth, setChatListWidth] = useState(300);
    const [isResizing, setIsResizing] = useState(false);
    const [chatRooms, setChatRooms] = useState([]);

    useEffect(() => {
        fetchChatRooms();
        addHotkeys();

        async function fetchChatRooms() {
            setChatRooms(await ChatApi.getAllUserChatsByUserId(CurrentUserController.getCurrentUser().id));
        }

        async function addHotkeys() {
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        }
    }, [])

    const handleMouseDown = () => {
        setIsResizing(true);
    };

    const handleMouseMove = (e) => {
        if (isResizing) {
            const newWidth = e.clientX;
            setChatListWidth(newWidth > 150 ? newWidth : 150);
        }
    };

    const handleMouseUp = () => {
        setIsResizing(false);
    };


    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            ActiveChatController.setChat(null);
        }
    };

    const updateLastMessage = (chatRoomId, newMessage) => {
        setChatRooms((prevChatRooms) =>
            prevChatRooms.map((chatRoom) =>
                chatRoom.chatId === chatRoomId
                    ? { ...chatRoom, lastMessage: newMessage }
                    : chatRoom
            )
        );
    };

    return (
        <MainContainer
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <ChatList width={chatListWidth}>
                {chatRooms.map((chatRoom) => (
                    <ChatRoom chatRoom={chatRoom}
                              key={chatRoom.chatId}
                    />
                ))}
                <Resizer onMouseDown={handleMouseDown}/>
            </ChatList>
            {ActiveChatController.getCurrentUser() != null && (
                <ActiveChat
                    onMessageSend={(newMessage) =>
                        updateLastMessage(ActiveChatController.getCurrentUser().chatId, newMessage)
                    }
                />
            )}
        </MainContainer>
    );
})
