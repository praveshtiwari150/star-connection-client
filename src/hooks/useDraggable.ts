import { useState, useRef, useEffect } from "react";

export const useDraggable = () => {
    const [isElementDragging, setIsElementDragging] = useState(false);
    const [elementPosition, setElementPosition] = useState({ x: 0, y: 0 });
    const [mouseOffsetFromElement, setMouseOffsetFromElement] = useState({ x: 0, y: 0 });
    const draggableElementRef = useRef<HTMLDivElement | null>(null);
    const parentContainerRef = useRef<HTMLDivElement | null>(null);

    const startDragging = (e: React.MouseEvent) => {
        if (draggableElementRef.current) {
            setIsElementDragging(true);
            const elementRect = draggableElementRef.current.getBoundingClientRect();
            setMouseOffsetFromElement({
                x: e.clientX - elementRect.left,
                y: e.clientY - elementRect.top,
            });
        }
    };

    const moveElement = (e: React.MouseEvent) => {
        if (isElementDragging && draggableElementRef.current && parentContainerRef.current) {
            const parentRect = parentContainerRef.current.getBoundingClientRect();
            const newX = e.clientX - mouseOffsetFromElement.x - parentRect.left;
            const newY = e.clientY - mouseOffsetFromElement.y - parentRect.top;

            const maxX = parentRect.width - draggableElementRef.current.offsetWidth;
            const maxY = parentRect.height - draggableElementRef.current.offsetHeight;

            setElementPosition({
                x: Math.max(0, Math.min(newX, maxX)),
                y: Math.max(0, Math.min(newY, maxY)),
            });
        }
    };

    const stopDragging = () => {
        if (isElementDragging) {
            setIsElementDragging(false);

            if (draggableElementRef.current && parentContainerRef.current) {
                const parentRect = parentContainerRef.current.getBoundingClientRect();
                const elementRect = draggableElementRef.current.getBoundingClientRect();

                const parentMidX = parentRect.left + parentRect.width / 2;

                if (elementRect.left + elementRect.width / 2 < parentMidX) {
                    setElementPosition({ x: 0, y: elementPosition.y });
                } else {
                    setElementPosition({ x: parentRect.width - elementRect.width, y: elementPosition.y });
                }
            }
        }
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            moveElement(e as unknown as React.MouseEvent);
        };

        const handleMouseUp = () => {
            stopDragging();
        };

        if (isElementDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isElementDragging, moveElement, stopDragging]);

    return {
        draggableElementRef,
        parentContainerRef,
        elementPosition,
        isElementDragging,
        startDragging,
        moveElement,
        stopDragging,
    };
};