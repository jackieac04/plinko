import React from "react";
import ReactDOM from "react-dom/client";
import Plinko from "./components/plinko.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Plinko />
  </React.StrictMode>
);
