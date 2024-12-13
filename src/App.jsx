import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PageComponent from './components/PageComponent';
import LoginPage from './views/auth/LoginPage';
import { jwtDecode } from 'jwt-decode';
import { refreshAccessToken } from "./utils/auth.js";

function App() {
   const [accessToken] = useState(localStorage.getItem('oom-access-token'));
   const [refreshToken] = useState(localStorage.getItem('oom-refresh-token'));

   return (
      <AuthProvider accessToken={accessToken} refreshToken={refreshToken}>
         <Router>
            <Routes>
               <Route path="/:page/:id" element={<PageWrapper />} />
               <Route path="/:page" element={<PageWrapper />} />
               <Route path="/:page/:subpage/:id" element={<PageWrapper />} />
            </Routes>
         </Router>
      </AuthProvider>
   );
}

const PageWrapper = () => {
   const [refreshToken] = useState(localStorage.getItem('oom-refresh-token'));
   const { page, subpage, id } = useParams();
   const navigate = useNavigate();

   useEffect(() => {
      const token = localStorage.getItem('oom-access-token');
      if (token) {
         try {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (decodedToken.exp && decodedToken.exp < currentTime) {
               console.log('expired');
               // Token is expired, remove from localStorage and redirect to login
               // localStorage.removeItem('oom-access-token');
               // navigate("/login");
               if (refreshToken) {
                  // Token expired, but we have a refresh token, try to refresh
                  refreshAccessToken(refreshToken)
                     .then(newAccessToken => {
                        // Successfully refreshed, update localStorage with the new access token
                        localStorage.setItem('oom-access-token', newAccessToken);
                        console.log('Access token refreshed');
                     })
                     .catch(error => {
                        // Refresh failed, remove both access and refresh token and redirect to login
                        console.error('Failed to refresh access token:', error);
                        localStorage.removeItem('oom-access-token');
                        localStorage.removeItem('oom-refresh-token');
                        navigate("/login");
                     });
               } else {
                  // No refresh token, force logout
                  console.log('No refresh token available');
                  localStorage.removeItem('oom-access-token');
                  localStorage.removeItem('oom-refresh-token');
                  navigate("/login");
               }
            } else if (page === "login") {
               console.log('redirect');
               // Redirect logged-in user to the home page or another protected page
               navigate("/dashboard");
            }
         } catch (error) {
            console.error("Error decoding token:", error);
         }
      }

      //Check if the user is already logged in (token exists in localStorage)
      if (localStorage.getItem('oom-access-token')) {
         if (page === "login") {
            // Redirect logged-in user to the home page or another protected page
            navigate("/dashboard");
         }
      } else {
         navigate("/login");
      }
   }, [page, navigate, refreshToken]);

   if (page === "login") {
      return <LoginPage />;
   }

   return <PageComponent page={page} subpage={subpage} id={id} />;
};


export default App;
