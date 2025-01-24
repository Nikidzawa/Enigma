import EmailVerificationFields from "../../components/fields/EmailVerificationFields";
import styled from "styled-components";

const LineContainer = styled.div`
    position: absolute;
    left: calc(50% - 120px);
    bottom: 50%;
`

export default function EmailVerificationSection({onKeyDown, submitEmail}) {

    return (
        <LineContainer onKeyDown={onKeyDown}>
            <EmailVerificationFields submitEmail={submitEmail}/>
        </LineContainer>
    )
}