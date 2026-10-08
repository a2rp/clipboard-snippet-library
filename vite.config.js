import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({ base: "/clipboard-snippet-library/", build: { sourcemap: false }, plugins: [react()] });
