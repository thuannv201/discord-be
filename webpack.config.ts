import path from "path";

module.exports = {
    entry: "./src/index.ts",
    mode: "development",
    target: "node",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "index.js",
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
            "@controller": path.resolve(__dirname, "src/controller"),
            "@model": path.resolve(__dirname, "src/model"),
            "@routes": path.resolve(__dirname, "src/routes"),
            "@services": path.resolve(__dirname, "src/services"),
            "@utils": path.resolve(__dirname, "src/utils"),
        },
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: ["ts-loader"],
                exclude: /node_modules/,
            },
        ],
    },
};
