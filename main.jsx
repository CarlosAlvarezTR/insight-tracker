import React from "react";
import { createRoot } from "react-dom/client";
import "@thomsonreuters/saffron-core-styles-prototyping-only/index.css";
import "./style.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
