import React from 'react'
import App from './App'
import './styles/global.css'
import './styles/themes/light.css'
import { createRoot } from "react-dom/client";

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
