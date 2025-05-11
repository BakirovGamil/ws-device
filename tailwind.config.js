import containerQueriesPlugin from "@tailwindcss/container-queries";

/** @type {import("tailwindcss").Config} */
export default {
  content: ["index.html", "./src/**/*.{js,vue,ts}"],
  theme: {
    extend: {
      colors: {
        error: "#e88080",
      },
    },
  },
  plugins: [containerQueriesPlugin],
};
