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
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-[#6C63FF] via-[#A78BFA] to-[#FF6B6B] animate-gradient animate-in fade-in duration-1000">
      
      {/* Floating Emojis Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 text-6xl">
        <span className="absolute top-1/4 left-1/4 animate-float">✈️</span>
        <span className="absolute top-1/3 right-1/4 animate-float-delayed">🌍</span>
        <span className="absolute bottom-1/4 left-1/3 animate-float-delayed">🗺️</span>
        <span className="absolute bottom-1/3 right-1/3 animate-float">🏝️</span>
      </div>

      <div className="z-10 flex flex-col items-center text-center px-4">
        <h1 className="text-white text-6xl md:text-[4rem] font-[800] tracking-tight mb-4 drop-shadow-md">
          Roammates
        </h1>
        <p className="text-white/85 text-xl md:text-2xl font-medium mb-12 max-w-lg">
          Plan together. Travel together.
        </p>
        
        <div className="flex gap-6 mb-16">
          <Button asChild className="bg-white text-[#6C63FF] hover:bg-white/90 hover:scale-105 transition-all rounded-full px-8 py-6 text-lg font-bold shadow-lg">
            <a href="/login">Login</a>
          </Button>
          <Button variant="outline" asChild className="bg-transparent border-2 border-white text-white hover:bg-white/10 hover:scale-105 transition-all rounded-full px-8 py-6 text-lg font-bold">
            <a href="/register">Register</a>
          </Button>
        </div>

        <p className="absolute bottom-8 text-white/70 text-sm font-medium tracking-wide uppercase">
          Trusted by travelers worldwide
        </p>
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
