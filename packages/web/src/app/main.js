import "../styles/index.css";
import { Home } from "../views/pages/Home.js";

const root = document.getElementById("app");
root.innerHTML = "";
root.appendChild(Home());
