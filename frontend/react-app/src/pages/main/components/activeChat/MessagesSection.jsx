import styled from "styled-components";
import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import MessagesApi from "../../../../api/internal/controllers/MessagesApi";
import MessageDto from "../../../../api/internal/dto/MessageDto";
import UserController from "../../../../store/UserController";
import DateParser from "../../../../helpers/DateParser";
import ChatRoomDto from "../../../../api/internal/dto/ChatRoomDto";

const MessagesSectionMainComponent = styled.div`
    height: calc(100% - 110px);
    overflow-y: auto;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-size: 16px;
    padding: 10px 9px 10px 0;
    -webkit-background-clip: text;
    transition: background-color 1s ease;

    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: ${props => props.scrollIsVisible ? '#575757' : 'transparent'};
        border-radius: 4px;
    }

    &::-webkit-scrollbar-track {
        background-color: ${props => props.scrollIsVisible ? '#353842' : 'transparent'};
        border-radius: 4px;
        margin-top: 5px;
        margin-bottom: 5px;
    }

`;

const MyMessage = styled.div`
    max-width: 500px;
    min-width: 35px;
    background: #006c81;
    border-radius: 15px 0 15px 15px;
    padding: 7px 10px 5px 20px;
    align-self: flex-end;
    display: flex;
    flex-direction: column;
    gap: 1px;
`

const OtherMessage = styled.div`
    max-width: 500px;
    min-width: 35px;
    background: #353535;
    border-radius: 0 15px 15px 15px;
    padding: 7px 20px 5px 10px;
    align-self: flex-start;
    display: flex;
    flex-direction: column;
    gap: 1px;
`

const MyMessageSendDate = styled.div`
    font-size: 12px;
    color: #cacaca;
    align-self: flex-end;
    cursor: default;
`

const OtherMessageSendDate = styled.div`
    font-size: 12px;
    color: #cacaca;
    align-self: flex-start;
    cursor: default;
`

const MyMessageText = styled.div`
    align-self: flex-end;
    font-size: 15px;
    word-break: break-word;

`

const OtherMessageText = styled.div`
    align-self: flex-start;
    font-size: 15px;
    word-break: break-word;
`

const MessagesSection = forwardRef(({chat, user}, ref) => {

    const [messages, setMessages] = useState([]);

    const [isLoadMessages, setLoadMessages] = useState(false);
    const [blockLoadMessages, setBlockLoadMessages] = useState(false);
    const [scrollIsVisible, setScrollIsVisible] = useState(true);

    const scrollTimeout = useRef(null);
    const ChatSectionRef = useRef(null);
    const messageRefs = useRef({});

    useImperativeHandle(ref, () => ({
        addMessageIntoChat: async (message) => {
            if (messages.findIndex(lastMessage => lastMessage.id === message.id) === -1) {
                setMessages(prev => [...prev, message]);
                scrollToBottom();
            }
        }
    }));

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.target.getAttribute("data-is-read")) {
                        const prevMessage = messages.find(message => message.id === Number.parseInt(entry.target.getAttribute("id")))
                        prevMessage.isRead = true;
                        // setMessages(prevMessages =>
                        //     prevMessages.map(message => message.id === prevMessage.id ? { ...message, isRead: true } : message)
                        // );
                        console.log( prevMessage)
                    }
                });
            },
            {
                root: ChatSectionRef.current,
                threshold: 0.5,
            }
        );

        Object.values(messageRefs.current).forEach(ref => ref && observer.observe(ref));

        return () => {
            observer.disconnect();
        };
    }, [messages]);

    useEffect(() => {
        const loadMessages = async () => {
            if (chat) {
                await MessagesApi.getMessagesByChatId(chat.id, 0).then(response =>
                    setMessages(defaultSort(response.data.map(message => MessageDto.fromJSON(message))))
                );
            } else if (user) {
                await MessagesApi.getMessagesBySenderIdAndReceiverId(UserController.getCurrentUser().id, user.id).then(response =>
                    setMessages(defaultSort(response.data.map(message => MessageDto.fromJSON(message))))
                )
            }
        };

        loadMessages().then(() => {
            setTimeout(() => {
                scrollToBottom();
            }, 0);
        });
    }, []);

    const scrollToBottom = () => {
        if (ChatSectionRef.current) {
            setTimeout(() => {
                ChatSectionRef.current.scrollTo({
                    top: ChatSectionRef.current.scrollHeight,
                    behavior: "instant",
                });
            }, 0);
        }
    };

    async function scrolling() {
        if (ChatSectionRef.current && !isLoadMessages) {
            const scrollTop = ChatSectionRef.current.scrollTop;
            const threshold = 250;

            if (scrollTop <= threshold) {
                setLoadMessages(true);

                try {
                    if (!blockLoadMessages) {
                        let latestMessages;
                        if (chat) {
                            await MessagesApi.getMessagesByChatId(chat.id, messages[0]?.id).then(response => {
                                latestMessages = response.data.map(message => MessageDto.fromJSON(message))
                            });
                        } else {
                            await MessagesApi.getMessagesBySenderIdAndReceiverId(UserController.getCurrentUser().id, user.id).then(response => {
                                latestMessages = response.data.map(message => MessageDto.fromJSON(message))
                            })
                        }

                        if (latestMessages.length > 0) {
                            setMessages((prevMessages) => {
                                return [...defaultSort(latestMessages), ...prevMessages];
                            });
                        } else {
                            setBlockLoadMessages(true);
                        }
                    }
                } catch (error) {
                    console.error("Ошибка при загрузке сообщений: ", error);
                } finally {
                    setLoadMessages(false);
                }
            }
        }

        scrollVisibleController();

        function scrollVisibleController() {
            setScrollIsVisible(true);
            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current);
            }
            scrollTimeout.current = setTimeout(() => {
                setScrollIsVisible(false);
            }, 3000);
        }
    }

    function defaultSort(array) {
        return array.sort((a, b) => a.id - b.id);
    }

    return (
        <MessagesSectionMainComponent ref={ChatSectionRef} onScroll={scrolling} scrollIsVisible={scrollIsVisible}>
            {
                messages.map((message) => (
                    message.senderId === UserController.getCurrentUser().id ? (
                        <MyMessage key={message.id}>
                            <MyMessageText>{message.text}</MyMessageText>
                            <MyMessageSendDate>{DateParser.parseToHourAndMinute(message.createdAt)}</MyMessageSendDate>
                        </MyMessage>
                    ) : (
                        <OtherMessage key={message.id}
                                      id={message.id}
                                      data-is-read={message.isRead}
                                      ref={el => messageRefs.current[message.id] = el}
                        >
                            <OtherMessageText>{message.text}</OtherMessageText>
                            <OtherMessageSendDate>{DateParser.parseToHourAndMinute(message.createdAt)}</OtherMessageSendDate>
                        </OtherMessage>
                    )
                ))
            }
        </MessagesSectionMainComponent>
    )
})

export default MessagesSection;