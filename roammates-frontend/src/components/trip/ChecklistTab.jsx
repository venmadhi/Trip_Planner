import { useState, useEffect } from 'react';
import api from '@/lib/axios';

export default function ChecklistTab({ tripId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItemText, setNewItemText] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    fetchChecklist();
  }, [tripId]);

  const fetchChecklist = async () => {
    try {
      const response = await api.get(`/trips/${tripId}/checklist`);
      setItems(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const packedCount = items.filter(item => item.packed).length;
  const totalCount = items.length;
  const progressPercent = totalCount === 0 ? 0 : Math.round((packedCount / totalCount) * 100);

  useEffect(() => {
    if (progressPercent === 100 && totalCount > 0) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [progressPercent, totalCount]);

  const toggleItem = async (id) => {
    try {
      const response = await api.put(`/trips/${tripId}/checklist/${id}/toggle`);
      setItems(items.map(item => item.id === id ? response.data : item));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    try {
      const response = await api.post(`/trips/${tripId}/checklist`, { text: newItemText });
      setItems([...items, response.data]);
      setNewItemText('');
    } catch (err) {
      console.error(err);
    }
  };

  const deleteItem = async (id) => {
    try {
      await api.delete(`/trips/${tripId}/checklist/${id}`);
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center animate-pulse">Loading checklist...</div>;

  return (
    <div className="roam-card p-6 md:p-8 relative overflow-hidden animate-in fade-in duration-500">
      {/* Confetti Animation Overlay */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50 animate-in fade-in zoom-in duration-300">
          <div className="text-8xl drop-shadow-2xl animate-bounce">🎉🎒🎊</div>
        </div>
      )}

      {/* HEADER & PROGRESS BAR */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-3">
          <h3 className="text-[1.5rem] font-[800] text-[var(--text-primary)]">Packing List</h3>
          <span className="text-sm font-bold text-[#6C63FF] bg-[#EEF0FF] px-3 py-1 rounded-full">
            {packedCount}/{totalCount} items packed 🎒
          </span>
        </div>
        
        <div className="w-full h-3 bg-[#E8E8F0] rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-[#6C63FF] to-[#A78BFA] transition-all duration-1000 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        {progressPercent === 100 && totalCount > 0 && (
          <p className="text-xs font-bold text-[#2ECC71] mt-2 animate-pulse text-right">All packed and ready to go! ✅</p>
        )}
      </div>

      {/* ITEM LIST */}
      <div className="space-y-3 mb-8">
        {items.length === 0 ? (
          <div className="text-center py-8 opacity-60">
            <div className="text-4xl mb-2">🎒</div>
            <p className="font-medium text-[var(--text-secondary)]">Your checklist is empty.</p>
          </div>
        ) : (
          items.map(item => (
            <div 
              key={item.id} 
              className={`group flex items-center justify-between p-3 rounded-[12px] border border-transparent transition-all duration-300 ${
                item.packed ? 'bg-[#F4F6FF] opacity-60' : 'bg-white border-[#E8E8F0] hover:border-[#6C63FF]/30 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => toggleItem(item.id)}>
                <div className={`w-6 h-6 rounded-[6px] flex items-center justify-center border-2 transition-colors duration-200 shrink-0 ${
                  item.packed ? 'bg-[#6C63FF] border-[#6C63FF]' : 'border-[#C8C8DC] group-hover:border-[#6C63FF]'
                }`}>
                  {item.packed && <span className="text-white text-sm font-bold leading-none select-none">✓</span>}
                </div>
                
                <div className="flex-1 min-w-0 flex items-center gap-3">
                  <span className={`font-semibold transition-all duration-300 ${item.packed ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}`}>
                    {item.text}
                  </span>
                  
                  <div className="shrink-0 relative group/avatar">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${item.addedBy}&background=EEF0FF&color=6C63FF&bold=true&size=32`} 
                      alt={item.addedBy}
                      title={`Added by ${item.addedBy}`}
                      className="w-5 h-5 rounded-full border border-white shadow-sm opacity-50 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={() => deleteItem(item.id)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#FF6B6B] opacity-0 group-hover:opacity-100 hover:bg-[#FF6B6B]/10 transition-all shrink-0 ml-2"
                title="Delete item"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      {/* ADD ITEM INPUT */}
      <form onSubmit={handleAddItem} className="relative mt-auto border-t border-[#E8E8F0] pt-6">
        <div className="relative flex items-center">
          <span className="absolute left-4 text-xl opacity-50">✨</span>
          <input 
            type="text" 
            className="roam-input pl-12 pr-24 h-14 bg-[#F8F9FF] border-transparent focus:bg-white"
            placeholder="Add something to the list..."
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
          />
          <button 
            type="submit"
            disabled={!newItemText.trim()}
            className="absolute right-2 roam-btn-primary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Item
          </button>
        </div>
      </form>
      
    </div>
  );
}
