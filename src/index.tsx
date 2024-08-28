import ReactDOM from "react-dom/client";
import "./index.css";
import Trip from "./Trip";
import { BrowserRouter } from "react-router-dom";
import "./Trip.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <BrowserRouter>
    <Trip />
  </BrowserRouter>
);
