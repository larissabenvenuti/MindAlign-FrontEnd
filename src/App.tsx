import { Toaster } from "./components/ui/Toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PrivateRoute } from "./components/context/PrivateRoute";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Main } from "./pages/Main";
import Auth from "./pages/Auth";
import { AuthProvider } from "./hooks/useAuth";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import Notes from "./pages/Notes";
import Habits from "./pages/Habits";
import Tasks from "./pages/Tasks";
import "./index.css";

const queryClient = new QueryClient();
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Main />
                  </>
                }
              />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Header />
                    <Dashboard />
                    <Footer />
                  </PrivateRoute>
                }
              />
              <Route
                path="/tasks"
                element={
                  <PrivateRoute>
                    <Header />
                    <Tasks />
                    <Footer />
                  </PrivateRoute>
                }
              />
              <Route
                path="/calendar"
                element={
                  <PrivateRoute>
                    <Header />
                    <Calendar />
                    <Footer />
                  </PrivateRoute>
                }
              />
              <Route
                path="/notes"
                element={
                  <PrivateRoute>
                    <Header />
                    <Notes />
                    <Footer />
                  </PrivateRoute>
                }
              />
              <Route
                path="/habits"
                element={
                  <PrivateRoute>
                    <Header />
                    <Habits />
                    <Footer />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
