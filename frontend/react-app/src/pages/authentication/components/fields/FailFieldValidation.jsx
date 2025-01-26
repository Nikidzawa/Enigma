import styled from "styled-components";

const FailValidation = styled.div`
    color: #cf2e2e;
    font-size: 14px;
`

export default function FailFieldValidation ({position, children}) {
    return (
        <FailValidation position={position}>{children}</FailValidation>
    )
}