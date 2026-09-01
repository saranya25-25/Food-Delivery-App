import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import {
    BrowserRouter
} from "react-router-dom";
import {
    StoreContextProvider
} from "./context/StoreContextProvider.jsx";
ReactDOM.createRoot(
    document.getElementById("root")
).render(
    <BrowserRouter>
        <StoreContextProvider>
            <App />
        </StoreContextProvider>
    </BrowserRouter>
);