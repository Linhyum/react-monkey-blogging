import { useEffect, useRef, useState } from "react";

export default function useClickOutSide() {
    const [show, setShow] = useState(false);
    const nodeRef = useRef(null);

    const handleClick = (e) => {
        setShow(!show);
        e.stopPropagation();
    };
    useEffect(() => {
        function handleClickOut(e) {
            if (nodeRef.current && !nodeRef.current.contains(e.target)) {
                setShow(false);
            }
        }
        document.addEventListener("click", handleClickOut);
        return () => {
            document.removeEventListener("click", handleClickOut);
        };
    }, []);
    return {
        show,
        setShow,
        nodeRef,
        handleClick,
    };
}
