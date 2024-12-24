import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

//daisy ui theme in index file - so that it applied to all
createRoot(document.getElementById('root')).render(

  //it render useeffect 2 times in development
  // <StrictMode>
    <BrowserRouter>
     <App />
    </BrowserRouter>
  // </StrictMode>
)
