import styled from "styled-components";

const FailValidation = styled.div`
    position: absolute;
    color: #cf2e2e;
    top: ${props => props.position ? props.position : '0px'};
    font-size: 14px;
`

export default function FailFieldValidation ({position, children}) {
    return (
        <FailValidation position={position}>- {children}</FailValidation>
    )
}