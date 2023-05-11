import { createContext, useContext, useEffect, useRef, useState } from "react";

const DropdownContext = createContext();
function DropdownProvider(props) {
    const [show, setShow] = useState(false);
    const nodeRef = useRef(null);

    const toggle = (e) => {
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
    const values = { show, setShow, nodeRef, toggle };
    return <DropdownContext.Provider value={values}>{props.children}</DropdownContext.Provider>;
}
function useDropdown() {
    const context = useContext(DropdownContext);
    if (typeof context === "undefined")
        throw new Error("useDropdown must be used within DropdownProvider");
    return context;
}
export { useDropdown, DropdownProvider };
