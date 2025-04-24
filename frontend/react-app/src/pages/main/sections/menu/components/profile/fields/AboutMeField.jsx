import { useRef, useEffect, useState } from "react";
import styled from "styled-components";

const Input = styled.textarea`
    border: none;
    background-color: transparent;
    color: #dfdfdf;
    height: auto;
    outline: none;
    font-size: 15px;
    resize: none;
    white-space: pre-wrap;
    overflow-wrap: break-word;
    width: 100%;
    font-family: Rubik;
    text-align: center;
    overflow: hidden;
    cursor: ${(props) => props.isFocused ? "text" : !props.disabled && "pointer"};
    display: flex;
    align-items: center;
    justify-content: center;
`;

const MaxLengthIndicator = styled.div`
    padding-top: 2px;
    font-size: 12px;
    color: #8e8e8e;
`;

export default function AboutMeField({ value, setValue, disabled }) {
    const maxLength = 120;
    const textareaRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);

    const adjustHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    useEffect(() => {
        adjustHeight();
    }, [value]);

    useEffect(() => {
        adjustHeight();
    }, []);

    const handleChange = (e) => {
        const text = e.target.value;
        const lineBreaks = (text.match(/\n/g) || []).length;

        if (lineBreaks <= 2) {
            setValue(text);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            e.stopPropagation();
            textareaRef.current.blur();
        }
    }

    return (
        <div>
            <form noValidate>
                <Input
                    ref={textareaRef}
                    placeholder={"Tell about you"}
                    value={value}
                    onChange={handleChange}
                    maxLength={maxLength}
                    rows="1"
                    disabled={disabled}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    isFocused={isFocused}
                    onKeyDownCapture={handleKeyDown}
                    spellCheck={false}
                />
            </form>
                {!disabled && (
                    <MaxLengthIndicator>
                        {value ? value.length : '0'}/{maxLength}
                    </MaxLengthIndicator>
                )}
        </div>
);
}