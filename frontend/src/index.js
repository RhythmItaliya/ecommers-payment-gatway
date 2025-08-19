import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import ProductProvider from "./contexts/ProductContext";
import SidebarProvider from "./contexts/SidebarContext";
import { CardProvider } from './contexts/CardContext';
import { Provider } from 'react-redux';
import store from './redux/store';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <SidebarProvider>
      <ProductProvider>
        <CardProvider>
          <React.StrictMode>
            <App />
          </React.StrictMode>
        </CardProvider>
      </ProductProvider>
    </SidebarProvider >
  </Provider >
);
