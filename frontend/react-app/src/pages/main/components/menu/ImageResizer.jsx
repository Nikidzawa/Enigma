import styled, {keyframes} from "styled-components";
import React, {useEffect, useRef, useState} from "react";

const fadeIn = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`

const fadeOut = keyframes`
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
`

const ShadowContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(39, 39, 39, 0.5);
    z-index: 1000;
    opacity: ${props => props.visible ? "1" : "0"};
    pointer-events: ${props => props.visible ? "auto" : "none"};;
    animation: ${props => props.visible ? fadeIn : fadeOut} 0.2s ease;
    display: flex;
    justify-content: center;
    align-items: center;
`

const MainContainer = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const Button = styled.button`
    background-color: #090909;
    border: 1px solid white;
    color: white;
    padding: 8px;
    min-width: calc(140px + 1vh);
    min-height: calc(28px + 1vh);
    font-size: 17px;
    cursor: pointer;
    border-radius: 5px;
    margin: 15px 0;
    font-family: Rubik;
`

const ImageContainer = styled.div`
    position: relative;
    display: inline-block;
    overflow: hidden;
    cursor: ${props => props.cursor || 'default'};
    user-select: none;
    background-color: transparent;
`;

const ImageComponent = styled.img`
    pointer-events: none;
    min-height: 120px;
    min-width: 120px;
`

const Square = styled.div`
    position: absolute;
    left: ${props => `${props.x}px`};
    top: ${props => `${props.y}px`};
    width: ${props => `${props.size}px`};
    height: ${props => `${props.size}px`};
    border: 2px dashed rgba(255, 255, 255, 0.8);
    box-shadow: 0 0 0 10000px rgba(0, 0, 0, 0.5);
    pointer-events: none;
    box-sizing: border-box;
`;

const ResizeHandle = styled.div`
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: white;
    border: 1px solid black;
    pointer-events: all;

    &.top-left {
        top: -5px;
        left: -5px;
        cursor: nwse-resize;
    }

    &.top-right {
        top: -5px;
        right: -5px;
        cursor: nesw-resize;
    }

    &.bottom-left {
        bottom: -5px;
        left: -5px;
        cursor: nesw-resize;
    }

    &.bottom-right {
        bottom: -5px;
        right: -5px;
        cursor: nwse-resize;
    }
`;

export default function ImageResizer ({src, visible, setResizerVisible, setAvatar, setAvatarChanged}) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [size, setSize] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeDirection, setResizeDirection] = useState(null);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [initialSizeState, setInitialSizeState] = useState({ size: 0, position: { x: 0, y: 0 } });
    const imageRef = useRef(null);

    useEffect(() => {
        const img = new Image();
        img.onload = () => {
            if (imageRef.current) {
                imageRef.current.src = src;
                const initialSize = Math.min(img.width, img.height) * 0.5;
                setSize(initialSize);
                setPosition({
                    x: (imageRef.current.width / 2 - initialSize),
                    y: (imageRef.current.width / 2 - initialSize)
                });
            }
        };
        img.onerror = () => {
            console.error("Failed to load image");
            if (imageRef.current) {
                imageRef.current.src = src;
            }
        };
        img.src = src;
    }, [src]);

    const getMousePos = (e) => {
        const rect = imageRef.current.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    const handleMouseDown = (e) => {
        const pos = getMousePos(e);
        e.preventDefault();
        e.stopPropagation();

        const handles = {
            topLeft: { x: position.x - 5, y: position.y - 5, width: 10, height: 10 },
            topRight: { x: position.x + size - 5, y: position.y - 5, width: 10, height: 10 },
            bottomLeft: { x: position.x - 5, y: position.y + size - 5, width: 10, height: 10 },
            bottomRight: { x: position.x + size - 5, y: position.y + size - 5, width: 10, height: 10 }
        };

        if (pos.x >= handles.topLeft.x && pos.x <= handles.topLeft.x + handles.topLeft.width &&
            pos.y >= handles.topLeft.y && pos.y <= handles.topLeft.y + handles.topLeft.height) {
            setIsResizing(true);
            setResizeDirection('top-left');
        } else if (pos.x >= handles.topRight.x && pos.x <= handles.topRight.x + handles.topRight.width &&
            pos.y >= handles.topRight.y && pos.y <= handles.topRight.y + handles.topRight.height) {
            setIsResizing(true);
            setResizeDirection('top-right');
        } else if (pos.x >= handles.bottomLeft.x && pos.x <= handles.bottomLeft.x + handles.bottomLeft.width &&
            pos.y >= handles.bottomLeft.y && pos.y <= handles.bottomLeft.y + handles.bottomLeft.height) {
            setIsResizing(true);
            setResizeDirection('bottom-left');
        } else if (pos.x >= handles.bottomRight.x && pos.x <= handles.bottomRight.x + handles.bottomRight.width &&
            pos.y >= handles.bottomRight.y && pos.y <= handles.bottomRight.y + handles.bottomRight.height) {
            setIsResizing(true);
            setResizeDirection('bottom-right');
        } else if (pos.x >= position.x && pos.x <= position.x + size &&
            pos.y >= position.y && pos.y <= position.y + size) {
            setIsDragging(true);
            setDragStart({
                x: pos.x - position.x,
                y: pos.y - position.y
            });
        }

        setInitialSizeState({
            size: size,
            position: { ...position }
        });
    };

    const handleMouseMove = (e) => {
        const pos = getMousePos(e);
        if (!imageRef.current) return;

        const imgWidth = imageRef.current.width;
        const imgHeight = imageRef.current.height;

        if (isDragging) {
            setPosition({
                x: Math.max(0, Math.min(pos.x - dragStart.x, imgWidth - size)),
                y: Math.max(0, Math.min(pos.y - dragStart.y, imgHeight - size))
            });
        } else if (isResizing) {
            const minSize = 50;
            const maxSize = Math.min(imgWidth, imgHeight);

            switch (resizeDirection) {
                case 'top-left':
                    const newSizeTL = initialSizeState.size + (initialSizeState.position.x - pos.x);
                    if (newSizeTL >= minSize && newSizeTL <= maxSize) {
                        setSize(newSizeTL);
                        setPosition({
                            x: pos.x,
                            y: pos.y
                        });
                    }
                    break;

                case 'top-right':
                    const newSizeTR = pos.x - initialSizeState.position.x;
                    if (newSizeTR >= minSize && newSizeTR <= maxSize) {
                        setSize(newSizeTR);
                        setPosition({
                            ...position,
                            y: pos.y
                        });
                    }
                    break;

                case 'bottom-left':
                    const newSizeBL = pos.y - initialSizeState.position.y;
                    if (newSizeBL >= minSize && newSizeBL <= maxSize) {
                        setSize(newSizeBL);
                        setPosition({
                            ...position,
                            x: pos.x
                        });
                    }
                    break;

                case 'bottom-right':
                    const newSizeBR = Math.min(
                        pos.x - initialSizeState.position.x,
                        pos.y - initialSizeState.position.y
                    );
                    if (newSizeBR >= minSize && newSizeBR <= maxSize) {
                        setSize(newSizeBR);
                    }
                    break;

                default:
                    break;
            }
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setIsResizing(false);
        setResizeDirection(null);
    };

    const cropImage = () => {
        try {
            const image = imageRef.current;
            if (!image) return;

            const rect = image.getBoundingClientRect();
            const scaleX = image.naturalWidth / rect.width;
            const scaleY = image.naturalHeight / rect.height;

            const canvas = document.createElement('canvas');
            canvas.width = size * scaleX;
            canvas.height = size * scaleY;
            const ctx = canvas.getContext('2d');

            ctx.drawImage(
                image,
                position.x * scaleX, position.y * scaleY, size * scaleX, size * scaleY,
                0, 0, size * scaleX, size * scaleY
            );

            setAvatar(canvas.toDataURL());
            setResizerVisible(false);
            setAvatarChanged(true);
        } catch (error) {
            console.error("Error cropping image:", error);
        }
    };

    useEffect(() => {
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isDragging, isResizing, position, size, dragStart, resizeDirection]);

    return (
        <ShadowContainer visible={visible} onMouseDown={e => e.target === e.currentTarget && setResizerVisible(false)}>
            <MainContainer>
                <ImageContainer onMouseDown={handleMouseDown}
                    cursor={isDragging ? 'grabbing' : (isResizing ? `${resizeDirection}-resize` : 'default')}>
                    <ImageComponent ref={imageRef}/>
                    <Square size={size} x={position.x} y={position.y}>
                        <ResizeHandle className="top-left"/>
                        <ResizeHandle className="top-right"/>
                        <ResizeHandle className="bottom-left"/>
                        <ResizeHandle className="bottom-right"/>
                    </Square>
                </ImageContainer>
                <Button onClick={cropImage}>Подтвердить</Button>
            </MainContainer>
        </ShadowContainer>
    );
}