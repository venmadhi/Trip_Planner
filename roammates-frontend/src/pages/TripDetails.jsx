import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ItineraryPlanner from '@/components/trip/ItineraryPlanner'
import WeatherWidget from '@/components/trip/WeatherWidget'
import CurrencyConverterWidget from '@/components/trip/CurrencyConverterWidget'

export default function TripDetails() {
  const { tripId } = useParams()

  return (
    <div className="max-w-[1200px] mx-auto pb-12 animate-in fade-in duration-500">
      {/* Trip Banner Header */}
      <div className="relative h-[250px] md:h-[300px] rounded-b-[24px] overflow-hidden mb-6 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E]/80 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=1200" 
          alt="Trip Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 p-8 z-20 w-full flex justify-between items-end">
          <div className="text-white">
            <div className="flex items-center space-x-3 mb-2">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">Paris, France</span>
              <span className="text-sm font-medium opacity-90">Oct 12 - Oct 18</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Summer Getaway {tripId}</h1>
          </div>
          <button className="roam-btn-primary shadow-lg backdrop-blur-md bg-white/20 hover:bg-white/30 border border-white/30 text-white">
            + Invite
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-0 z-30 bg-[#F8F9FF]/90 backdrop-blur-md border-b border-[#E8E8F0] mb-8 pt-2">
        <div className="flex space-x-8 px-8 overflow-x-auto scrollbar-hide">
          {['Itinerary', 'Expenses', 'Checklist', 'Tasks', 'Polls', 'Pinboard'].map((tab) => (
            <button 
              key={tab}
              className={`pb-4 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${tab === 'Itinerary' ? 'border-[#6C63FF] text-[#6C63FF]' : 'border-transparent text-[#6B7280] hover:text-[#1A1A2E]'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
        <div className="md:col-span-2">
          <ItineraryPlanner tripId={tripId} />
        </div>
        
        <div className="space-y-6">
          <div className="roam-card">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Members</h3>
            <div className="flex -space-x-3">
               {/* Mock avatars */}
               {[1, 2, 3, 4].map(i => (
                 <img key={i} src={`https://ui-avatars.com/api/?name=User+${i}&background=EEF0FF&color=6C63FF`} alt="member" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
               ))}
            </div>
          </div>
          
          <WeatherWidget destination="Paris" /> 
          
          <CurrencyConverterWidget />
        </div>
      </div>
    </div>
  )
}
