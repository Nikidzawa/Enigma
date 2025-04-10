import styled from "styled-components";
import ChatRoomDto from "../../../api/internal/dto/ChatRoomDto";
import UserDto from "../../../api/internal/dto/UserDto";
import {useEffect, useState} from "react";
import InfoProfile from "./menu/InfoProfile";
import ClientController from "../../../store/ClientController";
import PresenceResponse from "../../../network/response/PresenceResponse";
import PresenceApi from "../../../api/internal/controllers/PresenceApi";
import PresenceDto from "../../../api/internal/dto/PresenceDto";

const MainContainer = styled.div`
    :hover {
        background: #32373e;
    }
`

const ChatRoomContainer = styled.div`
    height: 50px;
    padding: 5px;
    display: flex;
    gap: 10px;
    cursor: pointer;
`

const UserAvatar = styled.img`
    border-radius: 50%;
    width: 50px;
    height: 50px;
    min-width: 50px;
    min-height: 50px;
`

const UserData = styled.div`
    display: flex;
    gap: 2px;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
`

const Name = styled.div`
    font-size: 19px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    flex-shrink: 1;
    min-width: 0;
`

const Nickname = styled.div`
    font-size: 13px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
`

export default function UserProfile({userDto}) {
    const stompClient = ClientController.getClient();
    const [profileVisible, setProfileVisible] = useState(false);
    const [isOnline, setIsOnline] = useState(true);
    const [lastOnlineDate, setLastOnlineDate] = useState(null);

    useEffect(() => {
        PresenceApi.getActual(userDto.id).then(response => {
            const presenceData = PresenceDto.fromJSON(response.data);
            setIsOnline(presenceData.isOnline);
            setLastOnlineDate(presenceData.lastOnlineDate);
        });
    }, [])

    useEffect(() => {
        if (stompClient) {
            const presenceSubscription = stompClient.subscribe(`/client/${userDto.id}/personal/presence`, (message) => {
                const presenceResponse = PresenceResponse.fromJSON(JSON.parse(message.body));
                setIsOnline(presenceResponse.isOnline);
                setLastOnlineDate(presenceResponse.lastOnlineDate);
            });

            return () => presenceSubscription.unsubscribe();
        }
    }, [stompClient]);

    return (
        <>
            <MainContainer onClick={() => setProfileVisible(true)}>
                <ChatRoomContainer>
                    <UserAvatar src={userDto.avatarHref}/>
                    <UserData>
                        <Name>{`${userDto.name} ${userDto.surname ? userDto.surname : ''}`}</Name>
                        <Nickname>{`@${userDto.nickname}`}</Nickname>
                    </UserData>
                </ChatRoomContainer>
            </MainContainer>
            {
                profileVisible && <InfoProfile user={userDto} visible={profileVisible} setVisible={setProfileVisible}
                                        isOnline={isOnline} lastOnlineDate={lastOnlineDate}
                />
            }
        </>
    );
}


