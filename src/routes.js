import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import Student from './erps/student/Student'
import StudentLog from './erps/student/StudentLog';
import Sentence from './erps/sentence/Sentence';
import Kind from './erps/kind/Kind';
import StudentLogList from './erps/studentLogList/StudentLogList'
import StudentTest from './studentComponent/StudentTest';
import AnswerLog from './studentComponent/AnswerLog';
import StudentGame from './studentComponent/StudentGame';


// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/',
      element: <Navigate to="/login" replace />,
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'studentManage', element: <Student /> },
        { path: 'studentLog', element: <StudentLog /> },
        { path: 'sentence', element: <Sentence /> },
        { path: 'kind', element: <Kind /> },
        { path: 'loglist', element: <StudentLogList /> },
      ],
    },
    {
      path: '/student',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/student/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'test', element: <StudentTest /> },
        { path: 'log', element: <AnswerLog /> },
        { path: 'game', element: <StudentGame /> },
      ],
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
