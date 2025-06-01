import DateParser from "../../../../helpers/DateParser";
import styled from "styled-components";
import {observer} from "mobx-react-lite";

const OfflineStatusText = styled.div`
    font-size: 15px;
    color: #a0a0a0;
    cursor: default;
`

const OnlineStatusText = styled.div`
    color: #00a4aa;
    font-size: 15px;
    cursor: default;
    display: flex;
    align-items: center;
    gap: 3px;
`

const DotsContainer = styled.div`
    display: flex;
    align-items: center;
    padding-top: 7px;
    gap: 3px;

    :nth-child(1) {
        animation-delay: 0s;
    }

    :nth-child(2) {
        animation-delay: 0.3s;
    }

    :nth-child(3) {
        animation-delay: 0.6s;
    }
`

const Dot = styled.div`
    width: 3px;
    height: 3px;
    background-color: #00a4aa;
    border-radius: 50%;
    animation: pulse 1s infinite ease-in-out;

    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.5);
        }
    }
`

export default observer(function OnlineStatusComponent({isTyping, isOnline, lastOnlineDate}) {
    return (
        isTyping ?  <OnlineStatusText>Пишет<DotsContainer><Dot/> <Dot/> <Dot/></DotsContainer></OnlineStatusText> :
            isOnline ? <OnlineStatusText>В сети</OnlineStatusText> :
                lastOnlineDate && <OfflineStatusText>{DateParser.parseOnlineDate(lastOnlineDate)}</OfflineStatusText>
    )
})