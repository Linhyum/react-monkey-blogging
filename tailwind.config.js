/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#2EBAC1",
                grayDark: "#292D32",
                grayLight: "#E7ECF3",
            },
            backgroundImage: {
                "primary-gradient": `linear-gradient(107.61deg, #00A7B4 15.59%, #A4D96C 87.25%)`,
            },
        },
    },
    plugins: [],
};
