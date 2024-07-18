import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
// import { Store, Persistor } from "./redux/Store";
import { store } from "./redux/store";

// https://zazuko.com/get-started/developers/
// https://www.youtube.com/watch?v=DECg2Llgb_E

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
  // </React.StrictMode>
)



// {
//   "name": "metagraph",
//   "private": true,
//   "version": "0.0.0",
//   "scripts": {
//     "dev": "vite",
//     "build": "tsc && vite build",
//     "preview": "vite preview"
//   },
//   "dependencies": {
//     "@emotion/react": "^11.9.3",
//     "@emotion/styled": "^11.9.3",
//     "@hookform/resolvers": "^2.9.7",
//     "@mui/icons-material": "^5.8.4",
//     "@mui/lab": "^5.0.0-alpha.170",
//     "@mui/material": "^5.15.16",
//     "@phosphor-icons/react": "^2.1.4",
//     "@rdfjs/fetch": "^3.1.0",
//     "@types/uuid": "^8.3.4",
//     "axios": "^0.27.2",
//     "dbpedia-entity-lookup": "^2.0.0",
//     "dotenv": "^16.0.1",
//     "encodeurl": "^1.0.2",
//     "eslint": "^8.20.0",
//     "phosphor-react": "^1.4.1",
//     "react": "^18.0.0",
//     "react-dom": "^18.0.0",
//     "react-hook-form": "^7.34.0",
//     "react-redux": "^8.1.2",
//     "react-router-dom": "6",
//     "sparql-http-client": "^2.4.1",
//     "sparqljs": "^3.5.2",
//     "styled-components": "^5.3.5",
//     "uuid": "^8.3.2",
//     "wikidata-sdk": "^8.0.0",
//     "zod": "^3.17.10"
//   },
//   "devDependencies": {
//     "@types/react": "^18.0.0",
//     "@types/react-dom": "^18.0.0",
//     "@types/styled-components": "^5.1.25",
//     "@vitejs/plugin-react": "^1.3.0",
//     "typescript": "^4.6.3",
//     "vite": "^2.9.9"
//   }
// }
