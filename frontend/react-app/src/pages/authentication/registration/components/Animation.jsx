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
                animation: ${slideInFromRight} 0.35s forwards;
            `}
    ${(props) =>
    props.isExiting &&
    css`
                animation: ${props.direction === "left" ? slideOutToLeft : slideOutToRight} 0.35s forwards;
            `}
`;

export default function Animation({isActive, isExiting, direction, children}) {
    return (
        <AnimationComponent isActive={isActive} isExiting={isExiting} direction={direction}>
            {children}
        </AnimationComponent>
    )
}