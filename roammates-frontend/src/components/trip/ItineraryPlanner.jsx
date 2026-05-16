import { useState, useEffect } from 'react';
import api from '@/lib/axios';

const CATEGORIES = [
  { id: 'Food', icon: '🍽️', label: 'Food' },
  { id: 'Stay', icon: '🏨', label: 'Stay' },
  { id: 'Activity', icon: '🎯', label: 'Activity' },
  { id: 'Transport', icon: '🚌', label: 'Transport' },
  { id: 'Shopping', icon: '🛍️', label: 'Shopping' }
];

export default function ItineraryPlanner({ tripId }) {
  const [itinerary, setItinerary] = useState([]);
  const [filterDay, setFilterDay] = useState('All');
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
    cost: 0,
    category: 'Activity'
  });
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchItinerary = async () => {
    try {
      const response = await api.get(`/trips/${tripId}/itinerary`);
      setItinerary(response.data);
    } catch (error) {
      console.error("Error fetching itinerary:", error);
    }
  };

  useEffect(() => {
    if (tripId) fetchItinerary();
  }, [tripId]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/trips/${tripId}/itinerary/${editingId}`, newItem);
      } else {
        await api.post(`/trips/${tripId}/itinerary`, newItem);
      }
      setIsAdding(false);
      setEditingId(null);
      setNewItem({ title: '', description: '', startTime: '', endTime: '', location: '', cost: 0, category: 'Activity' });
      fetchItinerary();
    } catch (error) {
      console.error("Error saving itinerary item:", error);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this activity?")) return;
    try {
      await api.delete(`/trips/${tripId}/itinerary/${itemId}`);
      fetchItinerary();
    } catch (error) {
      console.error("Error deleting itinerary item:", error);
    }
  };

  const handleEdit = (item) => {
    setNewItem({
      title: item.title,
      description: item.description || '',
      startTime: item.startTime,
      endTime: item.endTime,
      location: item.location || '',
      cost: item.cost || 0,
      category: item.category || 'Activity' // fallback
    });
    setEditingId(item.id);
    setIsAdding(true);
  };

  const formatTime = (dateString) => {
    return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(dateString));
  };

  const getCategoryIcon = (catId) => {
    const cat = CATEGORIES.find(c => c.id === catId);
    return cat ? cat.icon : '🎯';
  };

  // Auto-generate days from itinerary dates (naive implementation for demo)
  const uniqueDays = [...new Set(itinerary.map(item => new Date(item.startTime).toLocaleDateString()))].sort();

  return (
    <div className="roam-card p-6 md:p-8 space-y-6">
      
      {/* SECTION HEADER */}
      <div className="flex justify-between items-end border-b border-[#E8E8F0] pb-4">
        <div>
          <h3 className="text-[1.5rem] font-[800] text-[var(--text-primary)] mb-4">Itinerary</h3>
          
          {/* Day Filter Tabs */}
          {itinerary.length > 0 && (
            <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-1">
              <button 
                onClick={() => setFilterDay('All')}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${filterDay === 'All' ? 'bg-[#6C63FF] text-white' : 'bg-[#EEF0FF] text-[var(--text-secondary)] hover:bg-[#E2E5FA]'}`}
              >
                All Days
              </button>
              {uniqueDays.map((day, idx) => (
                <button 
                  key={day}
                  onClick={() => setFilterDay(day)}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${filterDay === day ? 'bg-[#6C63FF] text-white' : 'bg-[#EEF0FF] text-[var(--text-secondary)] hover:bg-[#E2E5FA]'}`}
                >
                  Day {idx + 1} <span className="font-medium text-xs ml-1 opacity-80">({new Date(day).toLocaleDateString('en-US', {month:'short', day:'numeric'})})</span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <button onClick={() => {
          setIsAdding(!isAdding);
          if (isAdding) {
             setEditingId(null);
             setNewItem({ title: '', description: '', startTime: '', endTime: '', location: '', cost: 0, category: 'Activity' });
          }
        }} className="roam-btn-primary shadow-md flex items-center gap-2 mb-1">
          {isAdding ? "Close Form" : <><span className="text-lg leading-none">+</span> Add Activity</>}
        </button>
      </div>

      {/* ADD ACTIVITY FORM */}
      {isAdding && (
        <div className="border-2 border-dashed border-[#6C63FF]/30 rounded-[16px] p-6 bg-white shadow-sm animate-in slide-in-from-top-4 fade-in duration-300">
          <h4 className="text-lg font-[800] text-[var(--text-primary)] mb-4">{editingId ? 'Edit Activity' : 'New Activity'}</h4>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <div className="relative">
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">Activity Title</label>
                <div className="absolute left-3 top-[34px] text-lg">📝</div>
                <input required className="roam-input pl-10" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} placeholder="e.g. Visit Museum" />
              </div>
              
              <div className="relative">
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">Category</label>
                <select className="roam-input appearance-none bg-white" value={newItem.category || 'Activity'} onChange={e => setNewItem({...newItem, category: e.target.value})}>
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-[38px] pointer-events-none text-[var(--text-secondary)]">▼</div>
              </div>

              <div className="relative">
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">Location</label>
                <div className="absolute left-3 top-[34px] text-lg">📍</div>
                <input className="roam-input pl-10" value={newItem.location} onChange={e => setNewItem({...newItem, location: e.target.value})} placeholder="e.g. Louvre" />
              </div>

              <div className="relative">
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">Cost (₹)</label>
                <div className="absolute left-3 top-[34px] text-lg font-bold text-[var(--text-secondary)]">₹</div>
                <input type="number" className="roam-input pl-8" value={newItem.cost} onChange={e => setNewItem({...newItem, cost: e.target.value})} placeholder="0" />
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">Start Time</label>
                <input required type="datetime-local" className="roam-input" value={newItem.startTime} onChange={e => setNewItem({...newItem, startTime: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">End Time</label>
                <input required type="datetime-local" className="roam-input" value={newItem.endTime} onChange={e => setNewItem({...newItem, endTime: e.target.value})} />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">Description</label>
                <textarea className="roam-input h-24 resize-none" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} placeholder="Optional details..." />
              </div>
            </div>
            
            <div className="flex justify-end pt-4 gap-3">
              <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-2.5 rounded-[10px] font-bold text-[var(--text-secondary)] border-2 border-[#E8E8F0] hover:bg-[#F4F6FF] transition-colors">Cancel</button>
              <button type="submit" className="roam-btn-primary px-8">Save Activity</button>
            </div>
          </form>
        </div>
      )}

      {/* EMPTY STATE */}
      {itinerary.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-[#E8E8F0] rounded-[16px] bg-white/50">
          <span className="text-[5rem] mb-4 drop-shadow-sm">🗓️</span>
          <h4 className="text-xl font-[800] text-[var(--text-primary)] mb-2">No activities planned yet</h4>
          <p className="text-[var(--text-secondary)] font-medium mb-6">Start building your itinerary to make the most of your trip!</p>
          <button onClick={() => setIsAdding(true)} className="roam-btn-primary shadow-sm flex items-center gap-2">
            <span className="text-lg leading-none">+</span> Add First Activity
          </button>
        </div>
      ) : (
        /* ACTIVITY LIST ITEMS */
        <div className="relative pl-4">
          {/* Vertical purple timeline line */}
          <div className="absolute left-[39px] top-4 bottom-4 w-[3px] bg-[#EEF0FF] rounded-full z-0">
             <div className="w-full h-full bg-gradient-to-b from-[#6C63FF] to-[#A78BFA] opacity-50"></div>
          </div>
          
          {itinerary.filter(item => filterDay === 'All' || new Date(item.startTime).toLocaleDateString() === filterDay).map((item, idx) => (
            <div key={item.id} className="relative flex items-start gap-5 p-4 rounded-[16px] hover:bg-[#F8F9FF] transition-all duration-300 group mb-2 animate-in fade-in slide-in-from-bottom-4 border border-transparent hover:border-[#EEF0FF] hover:shadow-[0_4px_12px_rgba(108,99,255,0.05)]" style={{ animationDelay: `${idx * 50}ms` }}>
              
              {/* Timeline Icon */}
              <div className="relative z-10 w-[50px] h-[50px] flex-shrink-0 bg-white rounded-full border-[3px] border-[#6C63FF] flex items-center justify-center text-2xl shadow-sm">
                {getCategoryIcon(item.category || item.title)}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0 bg-white rounded-[12px] p-4 border border-[#E8E8F0] shadow-sm group-hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <span className="roam-badge mb-2 inline-block shadow-sm text-[11px]">
                      {formatTime(item.startTime)} - {formatTime(item.endTime)}
                    </span>
                    <h4 className="font-[800] text-lg text-[var(--text-primary)] leading-tight">{item.title}</h4>
                  </div>
                  
                  {/* Right: Cost & Actions */}
                  <div className="flex flex-col items-end gap-2">
                    {item.cost > 0 && (
                      <span className="bg-[#2ECC71]/10 text-[#2ECC71] px-3 py-1 rounded-[999px] text-xs font-bold whitespace-nowrap">
                        ₹{item.cost}
                      </span>
                    )}
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(item)} className="w-8 h-8 rounded-full bg-[#EEF0FF] text-[#6C63FF] flex items-center justify-center hover:bg-[#6C63FF] hover:text-white transition-colors" title="Edit">✎</button>
                      <button onClick={() => handleDelete(item.id)} className="w-8 h-8 rounded-full bg-[#FF6B6B]/10 text-[#FF6B6B] flex items-center justify-center hover:bg-[#FF6B6B] hover:text-white transition-colors" title="Delete">×</button>
                    </div>
                  </div>
                </div>
                
                {item.location && <p className="text-sm font-semibold text-[var(--text-secondary)] flex items-center gap-1.5 mt-2"><span>📍</span> {item.location}</p>}
                {item.description && <p className="text-sm text-[var(--text-muted)] mt-2 bg-[#F8F9FF] p-3 rounded-[8px] italic border border-[#E8E8F0]">{item.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
