import styled from "styled-components";
import {useEffect, useRef, useState} from "react";


const MainContainer = styled.div`
    position: absolute;
`

const Fields = styled.div`
    display: flex;
    gap: 20px;
`

const Field = styled.input`
    background-color: transparent;
    border: none;
    border-bottom: 1px solid white;
    width: 40px;
    height: 70px;
    color: white;
    font-size: 40px;
    outline: none;
    text-align: center;
`

export default function EmailVerificationFields({submitEmail}) {
    const [firstValue, setFirstValue] = useState("")
    const [secondValue, setSecondValue] = useState("")
    const [thirdValue, setThirdValue] = useState("")
    const [fourthValue, setFourthValue] = useState("")

    const firstRef = useRef(null)
    const secondRef = useRef(null)
    const thirdRef = useRef(null)
    const fourthRef = useRef(null)

    useEffect(() => {
        firstRef.current.focus()
    }, [])

    function setValue(value, set, e, nextRef) {
        const newValue = e.target.value;
        if (value.length === 0) {
            if (newValue.length === 1) {
                set(newValue.toUpperCase())
                if (nextRef && !nextRef.current.value) {
                    nextRef.current.focus();
                } else {
                    submit(e.target.value);
                }
            } else if (newValue.length === 4) {
                setFirstValue(newValue.substring(0, 1))
                setSecondValue(newValue.substring(1, 2))
                setThirdValue(newValue.substring(2, 3))
                setFourthValue(newValue.substring(3, 4))
            }
        }
    }

    function keyListener(prevRef, nextRef, set, e) {
        if (e.code === 'ArrowLeft' && prevRef) {
            e.preventDefault()
            prevRef.current.focus();
            prevRef.current.setSelectionRange(
                prevRef.current.value.length,
                prevRef.current.value.length
            );
        } else if (e.code === 'ArrowRight' && nextRef) {
            e.preventDefault()
            nextRef.current.focus();
            nextRef.current.setSelectionRange(
                nextRef.current.value.length,
                nextRef.current.value.length
            );
        } else if (e.code === 'Backspace' || e.code === 'Delete') {
            set("")
        } else if (e.code === 'Enter') {
            submit();
        }
    }

    function submit(value) {
        if (firstValue && secondValue && thirdValue && (fourthValue || value)) {
            submitEmail(firstValue + secondValue + thirdValue + (fourthValue || value))
        }
    }

    return (
        <MainContainer>
            <Fields>
                <Field ref={firstRef}
                       value={firstValue}
                       onInput={e => setValue(firstValue, setFirstValue, e, secondRef)}
                       onKeyDown={e => keyListener(null, secondRef, setFirstValue, e)}
                />
                <Field ref={secondRef}
                       value={secondValue}
                       onInput={e => setValue(secondValue, setSecondValue, e, thirdRef)}
                       onKeyDown={e => keyListener(firstRef, thirdRef, setSecondValue, e)}
                />
                <Field ref={thirdRef}
                       value={thirdValue}
                       onInput={e => setValue(thirdValue, setThirdValue, e, fourthRef)}
                       onKeyDown={e => keyListener(secondRef, fourthRef, setThirdValue, e)}
                />
                <Field ref={fourthRef}
                       value={fourthValue}
                       onInput={e => setValue(fourthValue, setFourthValue, e)}
                       onKeyDown={e => keyListener(thirdRef, null, setFourthValue, e)}
                />
            </Fields>
        </MainContainer>
    )
}