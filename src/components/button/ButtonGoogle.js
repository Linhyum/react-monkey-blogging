import React from "react";

const ButtonGoogle = () => {
    return (
        <button className="border max-w-[500px] mx-auto mb-5 w-full rounded-lg text-[#333] font-medium transition-all  border-gray-300 flex items-center justify-center h-[57px] gap-x-3">
            <img src="/google.svg" alt="Google" />
            <span className="font-semibold">Sign up with google</span>
        </button>
    );
};

export default ButtonGoogle;
