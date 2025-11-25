import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './app/App.jsx'
import { ErrorProvider } from './shared/context/ErrorContext.jsx';
import { AuthProvider } from "./shared/context/AuthContext.jsx";
import ErrorBanner from "./shared/components/errorBanner/ErrorBanner.jsx"; 
import Header from "./shared/components/header/Header.jsx";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorProvider>
        <AuthProvider>
          <ErrorBanner /> 
          <Header />
          <App />
        </AuthProvider>
      </ErrorProvider>
      </BrowserRouter>
  </React.StrictMode>
)
