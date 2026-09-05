import { StrictMode } from 'react' //used to highlight potential problems in the application, such as deprecated APIs or unexpected side effects. It helps developers identify and fix issues early in the development process.
import { createRoot } from 'react-dom/client' //used to create a root for rendering the React application. It is part of the new React 18 API and replaces the older ReactDOM.render method.
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
)

// This file is the entry point for the React application. It imports necessary modules and components, including React's StrictMode for highlighting potential problems in the application. 