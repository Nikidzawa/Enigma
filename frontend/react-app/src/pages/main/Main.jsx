import {useCallback, useEffect, useRef, useState} from "react";
import styled, {keyframes} from "styled-components";
import ActiveChat from "./components/ActiveChat";
import ChatApi from "../../api/internal/controllers/ChatApi";
import UserController from "../../store/UserController";
import ChatRoom from "./components/ChatRoom";
import MenuImg from "../../img/menu.png";
import SearchImg from "../../img/search.png";
import CloseImg from "../../img/close.png"
import MenuPanel from "./components/MenuPanel";
import UserApi from "../../api/internal/controllers/UserApi";
import UserDtoShort from "../../api/internal/dto/UserDtoShort";
import UserProfile from "./components/UserProfile";
import ChatRoomDto from "../../api/internal/dto/ChatRoomDto";
import ClientController from "../../store/ClientController";
import MessageDto from "../../api/internal/dto/MessageDto";
import UserDto from "../../api/internal/dto/UserDto";

const slideOutToBottom = keyframes`
    from {
        transform: translateY(-35%);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
`;

const slideOutToBottom2 = keyframes`
    from {
        transform: translateY(-35%);
        opacity: 1;
    }
    to {
        transform: translateY(0);
        opacity: 0;
    }
`;

const slideOutToUp = keyframes`
    from {
        transform: translateY(0);
        opacity: 1;
    }
    to {
        transform: translateY(-35%);
        opacity: 0;
        position: absolute;
    }
`;

const slideOutToUp2 = keyframes`
    from {
        transform: translateY(20%);
        opacity: 0;
    }
    to {
        transform: translateY(0%);
        opacity: 1;
    }
`;

const MainContainer = styled.main`
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: space-between;
    background-color: #121212;
`;

const LeftMenuContainer = styled.div`
    height: 100vh;
    display: flex;
    flex-direction: column;
    width: ${({width}) => width}px;
    position: relative;
    max-width: 70%;
    min-width: 10%;
`

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
    padding: 6px 15px 6px 35px;
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

const SearchCategories = styled.div`
    width: 100%;
    height: 25px;
    display: flex;
    align-items: center;
    animation: ${props => props.isActive ? slideOutToBottom : slideOutToUp} 0.25s forwards;
`

const SearchCategory = styled.div`
    cursor: pointer;
    padding: 5px 10px;
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 15px;

    &.active {
        background-color: #292929;
        transition: background-color 0.2s;
    }
`

const StopSearch = styled.img`
    position: absolute;
    width: 19px;
    height: 19px;
    right: 20px;
    cursor: pointer;
`

const SearchLabel = styled.div`
    background-color: #292929;
    padding: 5px;
    margin-top: 5px;
    font-size: 15px;
`

const EmptySearchResult = styled.div`
    display: flex;
    justify-content: center;
    text-align: center;
    padding: 0 10px;
    margin-top: auto;
`

const SearchPanel = styled.div`
    display: flex;
    flex-direction: column;
    height: 40%;
`

const ChatRoomsContainer = styled.div`
    animation: ${props => props.isActive ? slideOutToBottom2 : slideOutToUp2} 0.25s forwards;
`

export default function Main() {
    const [chatListWidth, setChatListWidth] = useState(500);
    const [isResizing, setIsResizing] = useState(false);
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const activeChatRef = useRef();

    const [isSearchMode, setSearching] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [searchCategory, setSearchCategory] = useState('MESSAGES')
    const [searchResults, setSearchResults] = useState([]);

    const [menuIsVisible, setMenuIsVisible] = useState(false);

    const onMessageReceive = useCallback(async (message) => {
        const messageDto = MessageDto.fromRequest(JSON.parse(message.body));
        UserApi.getUserById(messageDto.senderId).then(response => {
            updateLastMessageOrAddChat({message: messageDto, companion: UserDto.fromJSON(response.data)});
            activeChatRef.current?.updateActiveChat(messageDto)
        })
    }, []);

    useEffect(() => {
        updateUser().then(user => {
            ClientController.connect(user.id, onMessageReceive).then(() => {
                ChatApi.getAllUserChatsByUserId(user.id).then(response => setChats(
                    response.data.map(room => ChatRoomDto.fromJSON(room)))
                );
            });
        });

        async function updateUser() {
            let user = UserController.getCurrentUser();
            if (!user.id) {
                user = await UserController.fetchUserByToken()
                UserController.setUser(user)
            }
            return user;
        }

        const handleKeyDown = (e) => {
            if (e.code === 'Escape') {
                setActiveChat(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {window.removeEventListener('keydown', handleKeyDown);};
    }, [onMessageReceive])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchCategory === 'PEOPLES' && searchValue.trim()) {
                UserApi.search(searchValue.trim(), UserController.getCurrentUser().id).then(response => {
                    setSearchResults(response.data.map(userInfo => UserDtoShort.fromJSON(userInfo)))
                });
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchCategory, searchValue]);

    function stopSearch () {
        setSearching(false);
        setSearchValue('');
    }

    const handleMouseMove = (e) => {
        if (isResizing) {
            const newWidth = e.clientX;
            setChatListWidth(newWidth > 150 ? newWidth : 150);
        }
    };

    async function updateLastMessageOrAddChat ({message, companion}) {
        setChats(prevChats => {
            const existingChatIndex = prevChats.findIndex(chatRoom => chatRoom.companion.id === companion.id);
            if (existingChatIndex !== -1) {
                return prevChats.map(chatRoom =>
                    chatRoom.companion.id === companion.id ? {...chatRoom, messages: [...chatRoom.messages, message]} : chatRoom
                );
            } else {
                return [...prevChats, new ChatRoomDto(companion, [message], null)];
            }
        });
    }

    return (
        <MainContainer onMouseMove={handleMouseMove} onMouseUp={() => setIsResizing(false)}>
            <LeftMenuContainer width={chatListWidth}>
                <TopMenuContainer>
                    <MenuButton src={MenuImg} onClick={() => setMenuIsVisible(true)}/>
                    <MenuPanel setMenuIsVisible={setMenuIsVisible} menuIsVisible={menuIsVisible}/>
                    <SearchInput
                            img={SearchImg}
                            onClick={() => {setSearching(true)}}
                            value={searchValue}
                            onInput={e => setSearchValue(e.target.value)}
                            placeholder={"Поиск"}
                    />
                    {
                        isSearchMode && <StopSearch src={CloseImg} onClick={stopSearch}/>
                    }
                </TopMenuContainer>
                <SearchCategories isActive={isSearchMode}>
                    <SearchCategory className={searchCategory === 'MESSAGES' ? 'active' : ''}
                                    onClick={() => setSearchCategory('MESSAGES')}>Сообщения</SearchCategory>
                    <SearchCategory className={searchCategory === 'PEOPLES' ? 'active' : ''}
                                    onClick={() => setSearchCategory('PEOPLES')}>Люди</SearchCategory>
                    <SearchCategory className={searchCategory === 'GROUPS' ? 'active' : ''}
                                    onClick={() => setSearchCategory('GROUPS')}>Сообщества</SearchCategory>
                </SearchCategories>
                {
                    isSearchMode ?
                        <SearchPanel>
                            <SearchLabel>Глобальный поиск</SearchLabel>
                            {
                                searchCategory === 'PEOPLES' && searchResults.map(userInfo => (
                                    <UserProfile key={userInfo.id} userInfo={userInfo} chats={chats} setActiveChat={setActiveChat}/>
                                    )
                                )
                            }
                            {
                                searchResults.length === 0 && <EmptySearchResult>Ничего не найдено</EmptySearchResult>
                            }
                        </SearchPanel>
                    : (
                        <ChatRoomsContainer isActive={isSearchMode}>
                            {
                                chats?.map(chatRoom => (
                                    <ChatRoom key={chatRoom.companion.id} chatRoom={chatRoom} setActiveChat={setActiveChat}/>
                                    )
                                )
                            }
                        </ChatRoomsContainer>
                    )

                }
                <Resizer onMouseDown={e => {e.preventDefault(); setIsResizing(true)}}/>
            </LeftMenuContainer>
            {
                activeChat && (
                    <ActiveChat
                        ref={activeChatRef}
                        activeChat={activeChat}
                        onMessageSend={updateLastMessageOrAddChat}
                    />
                )
            }
        </MainContainer>
    );
}
