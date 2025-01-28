import styled, {keyframes} from "styled-components";



const Animation= keyframes`
        33%{background-size:calc(100%/3) 0%  ,calc(100%/3) 100%,calc(100%/3) 100%}
        50%{background-size:calc(100%/3) 100%,calc(100%/3) 0%  ,calc(100%/3) 100%}
        66%{background-size:calc(100%/3) 100%,calc(100%/3) 100%,calc(100%/3) 0%  }
`

const LoaderComponent = styled.div`
    width: 40px;
    aspect-ratio: 4;
    --_g: no-repeat radial-gradient(circle closest-side, #fdfdfd 90%, #0000);
    background: var(--_g) 0% 50%,
    var(--_g) 50% 50%,
    var(--_g) 100% 50%;
    background-size: calc(100% / 3) 100%;
    animation: ${Animation} 1s infinite linear;
`

export default function Loader() {
    return (<LoaderComponent/>)
}