import React from "react";
import { createRoot } from "react-dom/client";
import YaplPlayground from "./YaplPlayground";

const root = createRoot(document.getElementById("sandpack-root"));
root.render(<YaplPlayground />);
