import styled, {css, keyframes} from "styled-components";

const slideInFromRight = keyframes`
    from {
        transform: translateX(25%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
`;

const slideInFromLeft = keyframes`
    from {
        transform: translateX(-25%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
`

const slideOutToLeft = keyframes`
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(-25%);
        opacity: 0;
    }
`;

const slideOutToRight = keyframes`
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(25%);
        opacity: 0;
    }
`;

const AnimationComponent = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    ${(props) =>
    props.isActive &&
    css`
                animation: ${props.directionActive === "left" ? slideInFromLeft : slideInFromRight} 0.35s forwards;
            `}
    ${(props) =>
    props.isExiting &&
    css`
                animation: ${slideOutToLeft} 0.35s forwards;
            `}
`;

export default function Animation({isActive, isExiting, directionActive, children}) {
    return (
        <AnimationComponent isActive={isActive} isExiting={isExiting} directionActive={directionActive}>
            {children}
        </AnimationComponent>
    )
}