/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/app/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                customGreen: "#81E291",
                customBlue: "#00242C",
            },
        },
    },
    plugins: [],
};
