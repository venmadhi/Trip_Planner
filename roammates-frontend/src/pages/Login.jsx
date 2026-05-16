import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'
import axios from 'axios'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const response = await axios.post('http://localhost:8081/api/v1/auth/authenticate', {
        email,
        password
      })
      login(
        { email: response.data.email, fullName: response.data.fullName, role: response.data.role },
        response.data.token
      )
      navigate('/dashboard')
    } catch (err) {
      setError('Invalid credentials or server error')
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* LEFT SIDE - Purple Gradient branding */}
      <div className="hidden lg:flex flex-col justify-center w-1/2 bg-gradient-to-br from-[#6C63FF] to-[#A78BFA] p-12 text-white relative overflow-hidden">
        {/* Floating background shapes */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative z-10 max-w-lg mx-auto">
          <h1 className="text-5xl font-[800] tracking-tight mb-4 flex items-center gap-3">
            Roammates <span className="text-4xl animate-bounce">🐝</span>
          </h1>
          <p className="text-2xl font-medium text-white/90 mb-12">
            Your group. Your trip. All in one place.
          </p>
          
          <div className="space-y-6 text-lg font-medium text-white/80">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm">✓</div>
              <span>Plan itineraries together</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm">✓</div>
              <span>Split expenses fairly</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm">✓</div>
              <span>Vote on decisions as a group</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Login Form */}
      <div className="flex items-center justify-center w-full lg:w-1/2 p-8 animate-in fade-in slide-in-from-right-8 duration-700">
        <div className="w-full max-w-[420px] bg-white rounded-[24px] p-8 sm:p-12 shadow-[0_20px_60px_rgba(108,99,255,0.15)] border border-[#E8E8F0]/50">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-[800] text-[var(--text-primary)] mb-2">Welcome back 👋</h2>
            <p className="text-[var(--text-secondary)] font-medium">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1.5" htmlFor="email">Email</label>
              <input 
                id="email" 
                type="email" 
                className="roam-input"
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-semibold text-[var(--text-primary)]" htmlFor="password">Password</label>
                <a href="#" className="text-xs font-semibold text-[#6C63FF] hover:text-[#5A52D5]">Forgot password?</a>
              </div>
              <input 
                id="password" 
                type="password" 
                className="roam-input"
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            
            {error && <p className="text-sm text-red-500 font-medium text-center">{error}</p>}
            
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-[#6C63FF] to-[#A78BFA] text-white py-3 rounded-[12px] font-bold text-lg hover:shadow-[0_8px_20px_rgba(108,99,255,0.3)] transition-all duration-300 hover:-translate-y-0.5 mt-2"
            >
              Sign In
            </button>
            
            <p className="text-center text-sm font-medium text-[var(--text-secondary)] pt-4">
              Don't have an account? <Link to="/register" className="text-[#6C63FF] hover:text-[#5A52D5] font-bold">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
