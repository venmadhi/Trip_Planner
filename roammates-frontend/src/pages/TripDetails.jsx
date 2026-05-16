import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import ItineraryPlanner from '@/components/trip/ItineraryPlanner'
import WeatherWidget from '@/components/trip/WeatherWidget'
import CurrencyConverterWidget from '@/components/trip/CurrencyConverterWidget'
import MapWidget from '@/components/trip/MapWidget'
import ExpenseTracker from '@/components/trip/ExpenseTracker'
import api from '@/lib/axios'
import { useAuthStore } from '@/store/authStore'

const TAB_ICONS = {
  'Itinerary': '🗓',
  'Expenses': '💸',
  'Checklist': '✅',
  'Tasks': '📋',
  'Polls': '🗳',
  'Pinboard': '📌'
}

export default function TripDetails() {
  const { tripId } = useParams()
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Itinerary')
  const user = useAuthStore((state) => state.user)

  const handleInvite = () => {
    if (!trip?.inviteCode) return;
    const inviteLink = `${window.location.origin}/join/${trip.inviteCode}`;
    navigator.clipboard.writeText(inviteLink);
    alert('Invite link copied to clipboard: ' + inviteLink);
  }

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await api.get('/trips')
        const foundTrip = response.data.find(t => t.id.toString() === tripId)
        setTrip(foundTrip)
      } catch (error) {
        console.error("Failed to fetch trip details", error)
      } finally {
        setLoading(false)
      }
    }
    fetchTrip()
  }, [tripId])

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (loading) return <div className="p-8 text-center font-medium text-[var(--text-secondary)] mt-20 animate-pulse">Loading trip details...</div>
  if (!trip) return <div className="p-8 text-center font-bold text-red-500 mt-20">Trip not found.</div>

  const destination = trip.destination || 'Paris'

  return (
    <div className="min-h-screen bg-[var(--bg)] pb-12 animate-in fade-in duration-700">
      
      {/* 4. BANNER */}
      <div className="relative h-[300px] w-full max-w-[1400px] mx-auto rounded-b-[24px] overflow-hidden shadow-md mb-8">
        <img 
          src={trip.bannerImage || "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=1200"} 
          alt="Trip Banner" 
          className="w-full h-full object-cover"
        />
        {/* Dark gradient overlay on bottom half: transparent to rgba(0,0,0,0.7) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Top Right: Invite Button */}
        <div className="absolute top-6 right-6 z-20">
          <button 
            onClick={handleInvite}
            className="bg-white text-[#6C63FF] hover:bg-[#6C63FF] hover:text-white font-bold rounded-[999px] px-5 py-2 text-sm shadow-lg transition-all duration-300"
          >
            + Invite
          </button>
        </div>

        {/* Bottom Left: Trip Info */}
        <div className="absolute bottom-8 left-8 md:left-12 z-20 text-white w-full pr-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-[2.8rem] leading-tight font-[800] tracking-tight mb-3 drop-shadow-lg">{trip.title || 'Untitled Trip'}</h1>
              <div className="flex items-center gap-3">
                <span className="bg-white text-[#6C63FF] px-4 py-1.5 rounded-[999px] text-xs font-bold uppercase tracking-wider shadow-sm">{trip.destination || 'Unknown Location'}</span>
                <span className="text-sm font-semibold opacity-85 drop-shadow-md">{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
              </div>
            </div>
            
            {/* Overlapping Avatar Group on Banner */}
            <div className="flex -space-x-3 mr-12">
               <div className="relative group">
                 <img 
                   src={`https://ui-avatars.com/api/?name=${user?.fullName || 'User'}&background=EEF0FF&color=6C63FF&bold=true`} 
                   alt="member" 
                   className="w-10 h-10 rounded-full border-[2px] border-white shadow-sm" 
                 />
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6">
        {/* TAB NAVIGATION */}
        <div className="sticky top-0 z-30 bg-white border-b border-[#E8E8F0] mb-8 rounded-t-[16px] px-2 shadow-sm">
          <div className="flex space-x-2 md:space-x-8 overflow-x-auto scrollbar-hide px-4">
            {Object.entries(TAB_ICONS).map(([tab, icon]) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 py-4 text-sm whitespace-nowrap transition-all duration-300 border-b-[3px] ${
                  activeTab === tab 
                    ? 'border-[#6C63FF] text-[#6C63FF] font-bold' 
                    : 'border-transparent text-[var(--text-secondary)] font-semibold hover:text-[#6C63FF]'
                }`}
              >
                <span>{icon}</span> {tab}
              </button>
            ))}
          </div>
        </div>
        
        {/* MAIN LAYOUT (65/35 split with 24px gap) */}
        <div className="flex flex-col lg:flex-row gap-[24px]">
          
          {/* LEFT CONTENT (65%) */}
          <div className="w-full lg:w-[65%] animate-in fade-in duration-500" key={activeTab}>
            {activeTab === 'Itinerary' && <ItineraryPlanner tripId={tripId} />}
            {activeTab === 'Expenses' && <ExpenseTracker tripId={tripId} />}
            {activeTab !== 'Itinerary' && activeTab !== 'Expenses' && (
              <div className="roam-card h-[400px] flex flex-col items-center justify-center text-center">
                <span className="text-6xl mb-4 opacity-50">{TAB_ICONS[activeTab]}</span>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{activeTab}</h3>
                <p className="text-[var(--text-secondary)]">This feature is coming soon!</p>
              </div>
            )}
          </div>
          
          {/* RIGHT SIDEBAR (35%) */}
          <div className="w-full lg:w-[35%] space-y-[24px]">
            
            {/* MEMBERS CARD */}
            <div className="roam-card">
              <h3 className="text-lg font-[800] text-[var(--text-primary)] mb-5 flex items-center justify-between">
                Members
                <span className="text-xs font-bold text-white bg-[#6C63FF] w-6 h-6 rounded-full flex items-center justify-center">1</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                 <div className="group relative">
                   <div className="relative">
                     <img 
                       src={`https://ui-avatars.com/api/?name=${user?.fullName || 'User'}&background=EEF0FF&color=6C63FF&bold=true`} 
                       alt={user?.fullName || 'User'} 
                       className="w-12 h-12 rounded-full border-2 border-[#6C63FF]/30 shadow-sm transition-transform group-hover:-translate-y-1" 
                     />
                     <div className="absolute -top-1 -right-1 text-xs drop-shadow-md">👑</div>
                   </div>
                   {/* Tooltip */}
                   <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs font-bold py-1 px-2 rounded whitespace-nowrap z-50 pointer-events-none">
                     {user?.fullName || 'User'} (Admin)
                   </div>
                 </div>
              </div>
            </div>
            
            <WeatherWidget destination={destination} /> 
            
            {/* DESTINATION MAP CARD */}
            <div className="roam-card p-5">
              <h3 className="text-lg font-[800] text-[var(--text-primary)] mb-4">📍 Destination Map</h3>
              <div className="w-full h-[200px] rounded-[12px] overflow-hidden border border-[#E8E8F0] mb-3">
                <iframe 
                  title="Destination Map"
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  scrolling="no" 
                  marginHeight="0" 
                  marginWidth="0" 
                  src={`https://maps.google.com/maps?width=100%25&height=100%25&hl=en&q=${encodeURIComponent(destination)}&t=&z=13&ie=UTF8&iwloc=B&output=embed`}
                ></iframe>
              </div>
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[#6C63FF] hover:text-[#5A52D5] flex items-center transition-colors">
                Open in Maps ↗
              </a>
            </div>

            <CurrencyConverterWidget />
          </div>
        </div>
      </div>
    </div>
  )
}
