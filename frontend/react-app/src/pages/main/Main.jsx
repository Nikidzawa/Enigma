import {useEffect, useState} from "react";
import styled from "styled-components";
import ActiveChat from "./components/ActiveChat";
import ChatApi from "../../api/controllers/ChatApi";
import UserController from "../../store/UserController";
import ActiveChatController from "../../store/ActiveChatController";
import ChatRoom from "./components/ChatRoom";
import {observer} from "mobx-react-lite";
import MenuImg from "../../img/menu.png";
import SearchImg from "../../img/search.png";
import MenuPanel from "./components/MenuPanel";
import UserDto from "../../api/dto/UserDto";

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

const MenuButton = styled.img`
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

    const [initialChatRooms, setInitialChatRooms] = useState([]);
    const [menuIsVisible, setMenuIsVisible] = useState(false);

    useEffect(() => {
        if (searchValue) {
            const filteredChatRooms = chatRooms.filter(chatRoom =>
                chatRoom.userName.toLowerCase().includes(searchValue.toLowerCase())
            );
            setChatRooms(filteredChatRooms);
        } else {
            setChatRooms(initialChatRooms);
        }
    }, [searchValue]);

    useEffect(() => {
        fetchChatRooms();

        async function fetchChatRooms() {
            let user = await UserController.getCurrentUser();
            ChatApi.getAllUserChatsByUserId(user.id).then(response => {
                const rooms = response.data;
                setInitialChatRooms(rooms)
                setChatRooms(rooms)
            })
        }
    }, [])

    const handleMouseMove = (e) => {
        if (isResizing) {
            const newWidth = e.clientX;
            setChatListWidth(newWidth > 150 ? newWidth : 150);
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
            onKeyDown={e => e.code === "Escape" && ActiveChatController.setChat(null)}
            onMouseMove={handleMouseMove}
            onMouseUp={() => setIsResizing(false)}
        >
            <LeftMenuContainer width={chatListWidth}>
                <TopMenuContainer>
                    <MenuButton src={MenuImg} onClick={() => setMenuIsVisible(true)}/>
                    <MenuPanel setMenuIsVisible={setMenuIsVisible} menuIsVisible={menuIsVisible}/>
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
                    <Resizer onMouseDown={() => setIsResizing(true)}/>
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
