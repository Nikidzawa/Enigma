import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CalendarImg from "../../../../../../../img/calendar.png";

const Container = styled.div`
    position: relative;
    display: flex;
    flex: 1;
`;

const Label = styled.div`
    color: #8e8e8e;
    position: absolute;
    left: 12px;
    top: 5px;
    z-index: 1;
    font-size: 15px;
    pointer-events: none;
`;

const DatePickerWrapper = styled.div`
    width: 100%;

    .react-datepicker-wrapper {
        width: calc(100% - 40px);
    }
`;

const StyledDatePicker = styled(DatePicker)`
    width: 100%;
    border: none;
    background-color: #333333;
    border-radius: 5px;
    color: white;
    height: 35px;
    outline: none;
    font-size: 17px;
    padding-top: 20px;
    padding-left: 37px;
    background-image: url(${CalendarImg});
    background-size: 17px;
    background-repeat: no-repeat;
    background-position: 12px 27px;
`;

const FieldContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    padding-top: 10px;
    gap: 10px;
`;

export default function DateField({value, setValue, disabled}) {
    return (
        <FieldContainer>
            <Container>
                <Label>Birthdate</Label>
                <DatePickerWrapper>
                    <StyledDatePicker
                        disabled={disabled}
                        selected={value}
                        onChange={date => setValue(date)}
                        dateFormat="dd.MM.yyyy"
                        placeholderText={'Your birthdate'}
                        showPopperArrow={false}
                        popperPlacement="bottom-start"
                    />
                </DatePickerWrapper>
            </Container>
        </FieldContainer>
    );
}