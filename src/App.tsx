import { useMemo, useState } from 'react';

import './App.css';
import { darkTheme, lightTheme } from './data/Theme';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import SignUpPage from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import LogIn from './pages/Login';
import Welcome from './pages/Welcome';
// Contexts
import { FeedbackProvider } from './contexts/FeedbackContext.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';

// Can't forget to import the fonts!

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import GlobalSnackbar from './components/GlobalSnackbar.tsx';
import SettingsPage from './pages/Settings.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';
import NewProjectPage from './pages/NewProject.tsx';
import ViewTask from './pages/ViewTask.tsx';
import NewTask from './pages/NewTask.tsx';
import ViewProject from './pages/ViewProject.tsx';

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
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/project/new' element={<NewProjectPage />} />
              <Route path='/project/:id' element={<ViewProject />} />
              <Route path='/project/:id/tasks/:taskId' element={<ViewTask />} />
              <Route path='/project/:id/tasks/new' element={<NewTask />} />
              <Route path='/settings' element={<SettingsPage mode={mode} toggleColorMode={toggleColorMode} />} />
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
