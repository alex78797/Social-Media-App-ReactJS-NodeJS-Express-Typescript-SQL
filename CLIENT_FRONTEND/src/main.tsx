import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { StrictMode } from "react";

// some redux-related imports
import { Provider } from "react-redux";
import { store } from "./app/store.ts";
import { injectStore } from "./app/api/axiosInstance.ts";

// need to inject the store because it is used in non component files
injectStore(store);

// include bootstrap css styles
// if the styles are included in this file, and not in index.html file, page is white on page refresh, even with dark mode
// import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
