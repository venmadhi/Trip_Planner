import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ItineraryPlanner({ tripId }) {
  const [itinerary, setItinerary] = useState([]);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
    cost: 0
  });
  const [isAdding, setIsAdding] = useState(false);

  const fetchItinerary = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/trips/${tripId}/itinerary`);
      setItinerary(response.data);
    } catch (error) {
      console.error("Error fetching itinerary:", error);
    }
  };

  useEffect(() => {
    if (tripId) {
      fetchItinerary();
    }
  }, [tripId]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8080/api/trips/${tripId}/itinerary`, newItem);
      setIsAdding(false);
      setNewItem({ title: '', description: '', startTime: '', endTime: '', location: '', cost: 0 });
      fetchItinerary();
    } catch (error) {
      console.error("Error adding itinerary item:", error);
    }
  };

  const formatDateTime = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
  };

  return (
    <div className="roam-card space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-[var(--text-primary)]">Itinerary</h3>
        <button onClick={() => setIsAdding(!isAdding)} className="roam-btn-primary shadow-sm hover:shadow-md">
          {isAdding ? "Cancel" : "+ Add Activity"}
        </button>
      </div>

      {isAdding && (
        <Card className="mb-4 border-dashed border-2 border-primary/50 animate-in fade-in zoom-in duration-300">
          <CardContent className="pt-6">
            <form onSubmit={handleAddItem} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-[var(--text-secondary)]">Activity Title</label>
                  <input required className="roam-input mt-1.5" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} placeholder="e.g. Visit Museum" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[var(--text-secondary)]">Location</label>
                  <input className="roam-input mt-1.5" value={newItem.location} onChange={e => setNewItem({...newItem, location: e.target.value})} placeholder="e.g. Louvre" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[var(--text-secondary)]">Start Time</label>
                  <input required type="datetime-local" className="roam-input mt-1.5" value={newItem.startTime} onChange={e => setNewItem({...newItem, startTime: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[var(--text-secondary)]">End Time</label>
                  <input required type="datetime-local" className="roam-input mt-1.5" value={newItem.endTime} onChange={e => setNewItem({...newItem, endTime: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[var(--text-secondary)]">Cost ($)</label>
                  <input type="number" className="roam-input mt-1.5" value={newItem.cost} onChange={e => setNewItem({...newItem, cost: e.target.value})} placeholder="0.00" />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-[var(--text-secondary)]">Description</label>
                <textarea className="roam-input mt-1.5 h-24 resize-none" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} placeholder="Optional details..." />
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className="roam-btn-primary">Save Activity</button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {itinerary.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No activities planned yet.</p>
      ) : (
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#E8E8F0] before:to-transparent">
          {itinerary.map((item, idx) => (
            <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 100}ms` }}>
              {/* Timeline dot */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[#EEF0FF] text-[#6C63FF] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                </svg>
              </div>
              
              {/* Card */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-[12px] border border-[#E8E8F0] shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="roam-badge">{formatDateTime(item.startTime).split(',')[0]}</span>
                  <span className="text-xs font-semibold text-[var(--primary)]">{formatDateTime(item.startTime).split(',')[1]} - {formatDateTime(item.endTime).split(',')[1]}</span>
                </div>
                <h4 className="font-bold text-lg text-[var(--text-primary)] mb-1">{item.title}</h4>
                {item.location && <p className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-1 mb-2">📍 {item.location}</p>}
                {item.description && <p className="text-sm text-[var(--text-muted)] line-clamp-2 mb-3">{item.description}</p>}
                
                <div className="flex items-center justify-between pt-3 border-t border-[#E8E8F0]">
                  <div className="flex items-center gap-2">
                    <img src={`https://ui-avatars.com/api/?name=User&background=EEF0FF&color=6C63FF`} alt="user" className="w-6 h-6 rounded-full" />
                    <span className="text-xs text-[var(--text-secondary)] font-medium">Added by User</span>
                  </div>
                  {item.cost > 0 && <span className="text-sm font-bold text-[var(--accent-green)]">${item.cost}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
