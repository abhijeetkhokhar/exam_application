import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './state/AuthContext.jsx'
import { ExamProvider } from './state/ExamContext.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ExamProvider>
          <App />
        </ExamProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
