import './App.css';
import { useState } from "react"
import Header2 from './components/header2/header2';
import ProfilePage from './pages/profile_page';
import UserProfile from './pages/user_another_profile';
import GameDetails from './pages/game_details';
import { Route } from "react-router-dom"
import ArhivePage from './pages/archive_page';
import { BrowserRouter as Router, Routes } from 'react-router-dom';
import AuthPage from './pages/auth_page';
import { useLocation } from "react-router-dom"
import AuthService from "./Services/AuthService"
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import RatingPage from './pages/rating_page';
import AdminPage from './pages/admin_page';
import EventPage from './pages/event_page';
import EventsArchivePage from './pages/events_archive_page';
import { createTheme, ThemeProvider } from '@mui/material/styles';
function App() {
  const location = useLocation();
  const theme = createTheme({
    palette: {
      primary: {
        // Purple and green play nicely together.
        main: "#EBE5D7",
      },
     
    },
  });

  return (
    <ThemeProvider theme={theme}>
    <div className="App">

      {(location.pathname === '/auth') ||(location.pathname === '/forbidden')  ? null : <Header2 />}
      
      <Routes>
       <Route exact path="/games/:gameId" element={<GameDetails/>} />
        <Route exact path="/profile/me" element={
        <PrivateRoute>
        <ProfilePage />
       </PrivateRoute>
        } />
        <Route exact path="/profile/:userId" element={
        <PrivateRoute>
        <UserProfile />
       </PrivateRoute>
        } />

      <Route exact path="/rating" element={
        <PrivateRoute>
        <RatingPage />
       </PrivateRoute>
        } />
      <Route exact path="/admin" element={
        <PrivateRoute roles={["ROLE_ADMIN"]}>
          <AdminPage />
       </PrivateRoute>
        } />  
        <Route exact path="/archive" element={
          <PrivateRoute>
            <ArhivePage />
          </PrivateRoute>
        } />
        <Route exact path="/events/:eventId" element={
          <PrivateRoute>
            <EventPage />
          </PrivateRoute>
        } />
        <Route exact path="/events" element={
          <PrivateRoute>
            <EventsArchivePage />
          </PrivateRoute>
        } />
        <Route exact path="/auth" element={<AuthPage />} />
        <Route exact path="/forbidden" element={<>ЗАПРЕЩЕНО</>} />
      </Routes>

    </div>
    </ThemeProvider>
  );
}

export default App;
