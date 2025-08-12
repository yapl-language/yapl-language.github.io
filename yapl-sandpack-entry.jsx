import React from "react";
import { createRoot } from "react-dom/client";
import YaplPlaygroundSandpack from "./YaplPlaygroundSandpack.jsx";

const container = document.getElementById("yapl-sandpack-root");
if (container) {
  const root = createRoot(container);
  root.render(<YaplPlaygroundSandpack />);
}
