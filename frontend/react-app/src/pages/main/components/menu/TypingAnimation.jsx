import styled from "styled-components";

const DotsContainer = styled.div`
    display: flex;
    align-items: center;
    padding-top: 5px;
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

export default function TypingAnimation () {
    return (
        <DotsContainer><Dot/><Dot/><Dot/></DotsContainer>
    )
}