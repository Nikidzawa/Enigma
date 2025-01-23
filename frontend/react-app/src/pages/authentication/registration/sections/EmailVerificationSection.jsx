import EmailVerificationFields from "../../components/fields/EmailVerificationFields";
import styled from "styled-components";

const LineContainer = styled.div`
    position: absolute;
    left: 28%;
`

export default function EmailVerificationSection({onKeyDown, submitEmail}) {

    return (
        <LineContainer onKeyDown={onKeyDown}>
            <EmailVerificationFields submitEmail={submitEmail}/>
        </LineContainer>
    )
}