/** ======= REACT ======= */
import { useMemo, useState, lazy } from 'react';

/** ======= ROUTER ======= */
import { HashRouter, Route, Routes } from 'react-router-dom';

/** ======= MUI COMPONENTS ======= */
import { CssBaseline, ThemeProvider } from '@mui/material';

/** ======= PAGES ======= */
import SignUpPage from './pages/SignUp';
import LogIn from './pages/Login';
import Welcome from './pages/Welcome';
import NotFoundPage from './pages/NotFoundPage.tsx';
import ProtectedRoute from './pages/ProtectedRoute.tsx';
const Dashboard = lazy(() => import('./pages/Dashboard.tsx'));
const SettingsPage = lazy(() => import('./pages/Settings.tsx'));
const ViewTask = lazy(() => import('./pages/ViewTask.tsx'));
const NewTask = lazy(() => import('./pages/NewTask.tsx'));
const NewProjectPage = lazy(() => import('./pages/NewProject.tsx'));
const ViewProject = lazy(() => import('./pages/ViewProject.tsx'));

/** ======= COMPONENTS ======= */
import Header from './components/Header';
import Footer from './components/Footer';
import GlobalSnackbar from './components/GlobalSnackbar.tsx';

/** ======= CONTEXTS ======= */
import { FeedbackProvider } from './contexts/FeedbackContext.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';

/** ======= STYLES / OTHERS ======= */
import './App.css';
import { darkTheme, lightTheme } from './data/Theme.ts';

/** ======= FONTS ======= */
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import LazyPage from './components/LazyPage.tsx';

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const stored = localStorage.getItem('colorMode');
    return stored === 'dark' ? 'dark' : 'light';
  });
  const toggleColorMode = (newMode: 'light' | 'dark') => {
    setMode((prevMode) => {
      if (prevMode !== newMode) {
        localStorage.setItem('colorMode', newMode);
        return newMode;
      }
      return prevMode;
    });
  };
  const theme = useMemo(
    () => (mode === 'light' ? lightTheme : darkTheme),
    [mode]
  );
  return (
    <HashRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <FeedbackProvider>
          <GlobalSnackbar />
          <AuthProvider>
            <Header />
            <Routes>
              <Route path='/' element={<Welcome />} />
              <Route path='/signup' element={<SignUpPage />} />
              <Route path='/login' element={<LogIn />} />
              <Route element={<ProtectedRoute />}>
                <Route path='/dashboard' element={<LazyPage component={Dashboard} />} />
                <Route path='/project/new' element={<LazyPage component={NewProjectPage} />} />
                <Route path='/project/:id' element={<LazyPage component={ViewProject} />} />
                <Route path='/project/:id/tasks/:taskId' element={<LazyPage component={ViewTask} />} />
                <Route path='/project/:id/tasks/new' element={<LazyPage component={NewTask} />} />
                <Route path='/settings' element={<LazyPage component={SettingsPage} componentProps={{ mode, toggleColorMode }} />} />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <Footer />
          </AuthProvider>
        </FeedbackProvider>
      </ThemeProvider>
    </HashRouter>
  );
}

export default App;
