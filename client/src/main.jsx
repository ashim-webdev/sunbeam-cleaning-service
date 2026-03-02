import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store.js'

import { registerLicense } from '@syncfusion/ej2-base';

registerLicense('Ngo9BigBOggjHTQxAR8/V1JGaF1cXmhKYVppR2NbeU5xdl9GYFZQQWY/P1ZhSXxVdkZjW35ccHRUQ2lfWUJ9XEA=');

import '@syncfusion/ej2-base/styles/material.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Provider makes our store accessible globally */}
    <Provider store={store}> 
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
