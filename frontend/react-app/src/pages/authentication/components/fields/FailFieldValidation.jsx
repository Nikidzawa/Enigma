import styled from "styled-components";

const FailValidation = styled.div`
    color: #cf2e2e;
    font-size: 14px;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 2px;
`

export default function FailFieldValidation ({position, children}) {
    return (
        <FailValidation position={position}>{children}</FailValidation>
    )
}