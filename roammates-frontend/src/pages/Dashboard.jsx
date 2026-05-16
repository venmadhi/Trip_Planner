import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/axios'

export default function Dashboard() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await api.get('/trips')
        setTrips(response.data)
      } catch (error) {
        console.error("Failed to fetch trips", error)
      } finally {
        setLoading(false)
      }
    }
    fetchTrips()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] pb-12">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 bg-white border-b border-[#E8E8F0] px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐝</span>
          <span className="font-[800] text-xl text-[#6C63FF] tracking-tight">Roammates</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#6C63FF] to-[#A78BFA] text-white flex items-center justify-center font-bold text-sm shadow-sm">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <span className="font-semibold text-sm hidden md:block">{user?.fullName}</span>
          </div>
          <button onClick={handleLogout} className="text-sm font-semibold text-[#FF6B6B] hover:text-[#E05252] transition-colors">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-[1200px] mx-auto px-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Hero Welcome Banner */}
        <div className="relative bg-gradient-to-r from-[#6C63FF] to-[#A78BFA] rounded-[20px] p-8 md:p-10 text-white shadow-lg overflow-hidden mb-10">
          <div className="absolute right-[-5%] top-[-10%] text-[10rem] opacity-10 rotate-[-15deg] pointer-events-none">✈️</div>
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-[800] mb-2 tracking-tight">Welcome back, {user?.fullName?.split(' ')[0] || 'Traveler'}! 👋</h1>
            <p className="text-lg md:text-xl font-medium text-white/80">
              {trips.length > 0 ? `You have ${trips.length} upcoming trip${trips.length === 1 ? '' : 's'}.` : 'Ready to plan your next adventure?'}
            </p>
          </div>
        </div>

        {/* Section Title */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Your Trips</h2>
          <Button className="roam-btn-primary shadow-sm flex items-center gap-2">
            <span className="text-lg leading-none">+</span> Create New Trip
          </Button>
        </div>

        {/* Trip Cards Grid */}
        {loading ? (
          <div className="flex justify-center p-12"><div className="w-8 h-8 border-4 border-[#6C63FF] border-t-transparent rounded-full animate-spin"></div></div>
        ) : trips.length === 0 ? (
          <div className="roam-card flex flex-col items-center justify-center py-16 text-center border-dashed border-2 border-[#E8E8F0] bg-white/50">
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No trips yet</h3>
            <p className="text-[var(--text-secondary)] mb-6 max-w-sm">You haven't planned any trips. Create your first trip to get started!</p>
            <Button className="roam-btn-primary">Create your first trip</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip, idx) => (
              <div key={trip.id} className="roam-card p-0 overflow-hidden flex flex-col animate-in fade-in zoom-in-95" style={{ animationDelay: `${idx * 100}ms` }}>
                
                {/* Card Banner Image */}
                <div className="relative h-40 w-full bg-muted">
                  <img src={trip.bannerImage || "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=600"} alt="Destination" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E]/90 via-[#1A1A2E]/20 to-transparent" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="roam-badge shadow-sm bg-white/90 backdrop-blur-sm text-[#6C63FF] border border-white/20 uppercase tracking-wide text-[10px]">
                      {trip.status || 'Planning'}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1">{trip.title || 'Untitled Trip'}</h3>
                  
                  <div className="space-y-2 mt-2 flex-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
                      <span>📍</span>
                      <span className="truncate">{trip.destination || 'Unknown Location'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
                      <span>📅</span>
                      <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
                      <span>👥</span>
                      <span>3 Members</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#E8E8F0]">
                    <Link to={`/trips/${trip.id}`} className="text-sm font-bold text-[#6C63FF] hover:text-[#5A52D5] flex items-center transition-colors">
                      Open Trip <span className="ml-1 text-lg leading-none">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
