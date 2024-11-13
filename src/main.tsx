import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { RouterProvider } from 'react-router-dom'
import router from './routes.tsx'
import { Spin } from 'antd'
import { Provider } from 'react-redux'
import store from './store/index.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} fallbackElement={
        <div className="flex items-center justify-center h-screen">
          <Spin size="large" />
        </div>
      } />
    </Provider>
  </StrictMode>,
)
