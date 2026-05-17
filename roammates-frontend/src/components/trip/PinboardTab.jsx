import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';

export default function PinboardTab({ tripId }) {
  const user = useAuthStore((state) => state.user);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchAnnouncements();
  }, [tripId]);

  const fetchAnnouncements = async () => {
    try {
      const response = await api.get(`/trips/${tripId}/pinboard`);
      setAnnouncements(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      const response = await api.post(`/trips/${tripId}/pinboard`, { message: newMessage });
      setAnnouncements([response.data, ...announcements]);
      setIsPosting(false);
      setNewMessage('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleReact = async (announcementId, emoji) => {
    try {
      const response = await api.put(`/trips/${tripId}/pinboard/${announcementId}/react`, { emoji });
      setAnnouncements(announcements.map(ann => ann.id === announcementId ? response.data : ann));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center animate-pulse">Loading pinboard...</div>;

  return (
    <div className="roam-card p-6 md:p-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8 border-b border-[#E8E8F0] pb-4">
        <div>
          <h3 className="text-[1.5rem] font-[800] text-[var(--text-primary)]">Pinboard</h3>
          <p className="text-sm font-medium text-[var(--text-secondary)]">Important group announcements.</p>
        </div>
        <button 
          onClick={() => setIsPosting(true)} 
          className="bg-white text-[#6C63FF] border-2 border-[#6C63FF] hover:bg-[#6C63FF] hover:text-white font-bold rounded-[10px] px-5 py-2 shadow-sm transition-all duration-300"
        >
          + Post Announcement
        </button>
      </div>

      {isPosting && (
        <div className="fixed inset-0 bg-[#1A1A2E]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-[24px] w-full max-w-lg p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-2xl font-[800] text-[var(--text-primary)] mb-6">Post Announcement</h3>
            <form onSubmit={handlePost} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">Message</label>
                <textarea required className="roam-input h-32 resize-none text-lg p-4" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type your announcement here..." />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#E8E8F0] mt-6">
                <button type="button" onClick={() => setIsPosting(false)} className="px-6 py-2 rounded-[10px] font-bold text-[var(--text-secondary)] hover:bg-[#F4F6FF] transition-colors border-2 border-transparent hover:border-[#E8E8F0]">Cancel</button>
                <button type="submit" className="roam-btn-primary px-8">Post</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {announcements.length === 0 ? (
          <div className="text-center py-8 opacity-60">
            <div className="text-4xl mb-2">📌</div>
            <p className="font-medium text-[var(--text-secondary)]">No announcements yet.</p>
          </div>
        ) : announcements.map(ann => (
          <div key={ann.id} className="relative p-6 rounded-[16px] border border-[#E8E8F0] bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6C63FF] to-[#A78BFA]"></div>
            <div className="flex items-center gap-3 mb-4">
              <img src={`https://ui-avatars.com/api/?name=${ann.author}&background=EEF0FF&color=6C63FF&bold=true`} alt={ann.author} className="w-10 h-10 rounded-full border-2 border-[#EEF0FF]" />
              <div>
                <h4 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
                  {ann.author}
                </h4>
                <p className="text-xs font-semibold text-[var(--text-secondary)]">
                  {new Date(ann.timeAgo).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            <p className="text-[var(--text-primary)] font-medium text-lg leading-relaxed mb-6">{ann.message}</p>
            <div className="flex items-center gap-2 border-t border-[#E8E8F0] pt-4">
              {['👍', '❤️', '😂'].map(emoji => (
                <button 
                  key={emoji} onClick={() => handleReact(ann.id, emoji)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F8F9FF] border border-[#E8E8F0] hover:bg-[#EEF0FF] hover:border-[#6C63FF]/30 transition-all font-semibold text-sm text-[var(--text-secondary)] hover:text-[#6C63FF]"
                >
                  <span className="text-base">{emoji}</span> {ann.reactions[emoji] > 0 && ann.reactions[emoji]}
                </button>
              ))}
            </div>
            <div className="absolute top-4 right-4 text-2xl opacity-20 drop-shadow-sm rotate-45">📌</div>
          </div>
        ))}
      </div>
    </div>
  );
}
