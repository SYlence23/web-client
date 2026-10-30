import { createBrowserRouter } from 'react-router'
import AdminRoute from './auth/AdminRoute.tsx'
import AuthLayout from './auth/AuthLayout.tsx'
import LoginPage from './auth/LoginPage.tsx'
import ProtectedRoute from './auth/ProtectedRoute.tsx'
import RegisterPage from './auth/RegisterPage.tsx'
import Layout from './components/Layout.tsx'
import Admin from './pages/Admin.tsx'
import History from './pages/History.tsx'
import NewRender from './pages/NewRender.tsx'
import NotFound from './pages/NotFound.tsx'
import TaskView from './pages/TaskView.tsx'

export const router = createBrowserRouter([
  {
    Component: AuthLayout,
    children: [
      { path: 'login', Component: LoginPage },
      { path: 'register', Component: RegisterPage },
    ],
  },
  {
    Component: ProtectedRoute,
    children: [
      {
        Component: Layout,
        children: [
          { index: true, Component: NewRender },
          { path: 'renders/:id', Component: TaskView },
          { path: 'history', Component: History },
          {
            Component: AdminRoute,
            children: [{ path: 'admin', Component: Admin }],
          },
          { path: '*', Component: NotFound },
        ],
      },
    ],
  },
])
