import React from "react";
import Loading from "../loading/Loading";
/**
 *
 * @param {string} type Type of button 'button' or 'submit'
 * @returns
 */
const Button = ({
    children,
    width = "100%",
    height = "58px",
    isLoading,
    onClick = () => {},
    ...props
}) => {
    return (
        <button
            style={{
                width,
                height,
            }}
            onClick={onClick}
            {...props}
            className={`disabled:opacity-50 disabled:pointer-events-none text-lg font-semibold text-white rounded-lg bg-primary-gradient`}
        >
            {isLoading ? <Loading></Loading> : children}
        </button>
    );
};
export default Button;
