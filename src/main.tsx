import React from 'react'
import './styles/global.css'
import './styles/colors.css'
import './styles/text.css'
import './styles/category-colors.css'
import App from './App'
import { createRoot } from "react-dom/client";

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
