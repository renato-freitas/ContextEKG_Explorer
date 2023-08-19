import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
// import { Store, Persistor } from "./redux";

// https://zazuko.com/get-started/developers/

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  // <Provider store={Store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  // </Provider>
  // </React.StrictMode>
)
