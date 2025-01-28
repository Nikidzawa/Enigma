import {useEffect, useState} from "react";
import styled from "styled-components";
import ActiveChat from "./components/ActiveChat";
import ChatApi from "../../api/controllers/ChatApi";
import CurrentUserController from "../../store/CurrentUserController";
import ActiveChatController from "../../store/ActiveChatController";
import ChatRoom from "./components/ChatRoom";
import {observer} from "mobx-react-lite";
import MenuImg from "../../img/menu.png";
import SearchImg from "../../img/search.png";

const MainContainer = styled.main`
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: space-between;
    background-color: #121212;
`;

const LeftMenuContainer = styled.div`
    height: 100vh;
    width: ${({width}) => width}px;
    position: relative;
    max-width: 70%;
    min-width: 10%;
`

const ChatList = styled.div`
`;

const TopMenuContainer = styled.div`
    display: flex;
    padding: 10px;
    align-items: center;
    gap: 12px;
`

const MenuPanel = styled.img`
    height: 22px;
    width: 26px;
    cursor: pointer;
`

const SearchInput = styled.input`
    width: 100%;
    border-radius: 15px;
    border-color: rgba(255, 255, 255, 0.5);
    background-color: transparent;
    color: white;
    font-size: 15px;
    padding: 7px 15px 7px 35px;
    outline: none; 
    background-image: url("${props => props.img}");
    background-size: 20px;
    background-position: left;
    background-repeat: no-repeat;
    background-position-x: 7px;
`

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
    const [chatListWidth, setChatListWidth] = useState(500);
    const [isResizing, setIsResizing] = useState(false);
    const [chatRooms, setChatRooms] = useState([]);
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        if (searchValue) {
            const filteredChatRooms = chatRooms.filter(chatRoom =>
                chatRoom.userName.toLowerCase().includes(searchValue.toLowerCase())
            );
            setChatRooms(filteredChatRooms);
        } else {
            fetchChatRooms();
        }
    }, [searchValue, chatRooms]);

    useEffect(() => {
        fetchChatRooms();
        addHotkeys();

        async function addHotkeys() {
            window.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        }
    }, [])

    async function fetchChatRooms() {
        const rooms = await ChatApi.getAllUserChatsByUserId(CurrentUserController.getCurrentUser().id);
        setChatRooms(rooms);
    }

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
                    ? {...chatRoom, lastMessage: newMessage}
                    : chatRoom
            )
        );
    };

    return (
        <MainContainer
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <LeftMenuContainer width={chatListWidth}>
                <TopMenuContainer>
                    <MenuPanel src={MenuImg}/>
                    <SearchInput
                        img={SearchImg}
                        onInput={e => setSearchValue(e.target.value)}
                        placeholder={"Поиск"}/>
                </TopMenuContainer>
                <ChatList>
                    {chatRooms.map((chatRoom) => (
                        <ChatRoom chatRoom={chatRoom}
                                  key={chatRoom.chatId}
                        />
                    ))}
                    <Resizer onMouseDown={handleMouseDown}/>
                </ChatList>
            </LeftMenuContainer>
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
