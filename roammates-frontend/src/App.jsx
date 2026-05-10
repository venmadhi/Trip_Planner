import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Dashboard from '@/pages/Dashboard'
import TripDetails from '@/pages/TripDetails'
import JoinTrip from '@/pages/JoinTrip'
import { Button } from "@/components/ui/button"

function PrivateRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/login" />
}

function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-4xl font-bold mb-4 text-primary">Roammates</h1>
      <p className="text-muted-foreground mb-8">Group Travel Planning & Management</p>
      <div className="flex gap-4">
        <Button asChild><a href="/login">Login</a></Button>
        <Button variant="outline" asChild><a href="/register">Register</a></Button>
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/trips/:tripId" 
        element={
          <PrivateRoute>
            <TripDetails />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/join/:inviteCode" 
        element={
          <PrivateRoute>
            <JoinTrip />
          </PrivateRoute>
        } 
      />
    </Routes>
  )
}

export default App
