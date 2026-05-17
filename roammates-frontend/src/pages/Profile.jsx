import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || 'Traveler',
    email: user?.email || 'traveler@example.com',
    city: 'New York, USA',
    avatarUrl: `https://ui-avatars.com/api/?name=${user?.fullName || 'User'}&background=EEF0FF&color=6C63FF&bold=true&size=150`
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...profileData });

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await api.get('/trips');
        setTrips(response.data);
      } catch (error) {
        console.error("Failed to fetch trips", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfileData({
      ...editForm,
      avatarUrl: `https://ui-avatars.com/api/?name=${editForm.fullName}&background=EEF0FF&color=6C63FF&bold=true&size=150`
    });
    setIsEditing(false);
    // Show a global toast here if implemented
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] pb-12 animate-in fade-in duration-700">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E8E8F0] px-6 py-4 flex justify-between items-center shadow-sm">
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="text-2xl">🐝</span>
          <span className="font-[800] text-xl text-[#6C63FF] tracking-tight">Roammates</span>
        </Link>
        <button onClick={handleLogout} className="text-sm font-bold text-[#FF6B6B] hover:text-[#E05252] transition-colors">
          Logout
        </button>
      </nav>

      {/* TOP BANNER */}
      <div className="w-full h-[200px] bg-gradient-to-r from-[#6C63FF] via-[#A78BFA] to-[#FF6B6B] relative overflow-hidden">
        {/* Animated subtle shapes */}
        <div className="absolute top-[-20%] left-[10%] w-[40%] h-[150%] bg-white/10 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
      </div>

      <div className="max-w-[1000px] mx-auto px-6 relative -mt-[50px]">
        
        {/* MAIN PROFILE CARD */}
        <div className="roam-card pt-0 px-8 pb-8 flex flex-col items-center text-center">
          
          {/* Overlapping Avatar */}
          <div className="relative -top-[50px] mb-[-30px]">
            <img 
              src={profileData.avatarUrl} 
              alt="Profile" 
              className="w-[100px] h-[100px] rounded-full border-4 border-white shadow-[0_8px_20px_rgba(108,99,255,0.2)] bg-white object-cover"
            />
          </div>

          <h1 className="text-[1.8rem] font-[800] text-[var(--text-primary)] leading-tight">{profileData.fullName}</h1>
          <p className="text-sm font-semibold text-[var(--text-secondary)] mb-3">{profileData.email}</p>
          
          <div className="flex items-center gap-1 text-[var(--text-muted)] font-medium mb-6">
            <span>📍</span> {profileData.city}
          </div>

          <button 
            onClick={() => setIsEditing(true)}
            className="px-6 py-2 rounded-full border-2 border-[#6C63FF] text-[#6C63FF] font-bold hover:bg-[#6C63FF] hover:text-white transition-all shadow-sm"
          >
            Edit Profile
          </button>
        </div>

        {/* STATS ROW (3 Cards) */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="roam-card p-5 text-center flex flex-col items-center justify-center hover:-translate-y-1 transition-transform">
            <span className="text-3xl mb-2 drop-shadow-sm">✈️</span>
            <span className="text-2xl font-[800] text-[var(--text-primary)]">{trips.length}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Total Trips</span>
          </div>
          <div className="roam-card p-5 text-center flex flex-col items-center justify-center hover:-translate-y-1 transition-transform">
            <span className="text-3xl mb-2 drop-shadow-sm">💰</span>
            <span className="text-2xl font-[800] text-[var(--text-primary)]">₹124k</span>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Total Spent</span>
          </div>
          <div className="roam-card p-5 text-center flex flex-col items-center justify-center hover:-translate-y-1 transition-transform">
            <span className="text-3xl mb-2 drop-shadow-sm">✅</span>
            <span className="text-2xl font-[800] text-[var(--text-primary)]">2</span>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Trips Completed</span>
          </div>
        </div>

        {/* MY TRIPS SECTION (Horizontal Scroll) */}
        <div className="mt-12 mb-6">
          <h2 className="text-2xl font-[800] text-[var(--text-primary)] mb-6">My Trips</h2>
          
          {loading ? (
             <div className="flex justify-center p-12"><div className="w-8 h-8 border-4 border-[#6C63FF] border-t-transparent rounded-full animate-spin"></div></div>
          ) : trips.length === 0 ? (
            <div className="text-center py-12 bg-white/50 border-2 border-dashed border-[#E8E8F0] rounded-[24px]">
              <span className="text-5xl opacity-50 mb-4 block">🗺️</span>
              <p className="font-bold text-[var(--text-secondary)]">You haven't joined any trips yet.</p>
            </div>
          ) : (
            <div className="flex space-x-6 overflow-x-auto pb-6 scrollbar-hide snap-x">
              {trips.map((trip, idx) => (
                <div key={trip.id} className="roam-card p-0 overflow-hidden flex-shrink-0 w-[320px] snap-center hover:shadow-[0_12px_30px_rgba(108,99,255,0.15)] transition-shadow">
                  
                  {/* Card Banner Image */}
                  <div className="relative h-32 w-full bg-muted">
                    <img src={trip.bannerImage || "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=600"} alt="Destination" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E]/90 via-[#1A1A2E]/20 to-transparent" />
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex flex-col">
                    <h3 className="text-lg font-bold text-[var(--text-primary)] leading-tight mb-1 truncate">{trip.title || 'Untitled Trip'}</h3>
                    
                    <div className="space-y-1.5 mt-2">
                      <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)]">
                        <span>📍</span>
                        <span className="truncate">{trip.destination || 'Unknown Location'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)]">
                        <span>📅</span>
                        <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#E8E8F0]">
                      <Link to={`/trips/${trip.id}`} className="text-xs font-bold text-[#6C63FF] hover:text-[#5A52D5] flex items-center transition-colors">
                        Open Trip <span className="ml-1 text-sm leading-none">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditing && (
        <div className="fixed inset-0 bg-[#1A1A2E]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-[24px] w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-2xl font-[800] text-[var(--text-primary)] mb-6">Edit Profile</h3>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              
              <div className="flex flex-col items-center mb-6">
                <div className="relative group cursor-pointer">
                  <img src={editForm.avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full border-2 border-[#E8E8F0]" />
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xl">📷</span>
                  </div>
                </div>
                <p className="text-xs font-bold text-[var(--text-secondary)] mt-2">Change Avatar (Mock)</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">Full Name</label>
                <input required className="roam-input font-semibold" value={editForm.fullName} onChange={e => setEditForm({...editForm, fullName: e.target.value})} />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">City</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">📍</span>
                  <input className="roam-input pl-10 font-semibold" value={editForm.city} onChange={e => setEditForm({...editForm, city: e.target.value})} />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-[#E8E8F0] mt-6">
                <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 rounded-[10px] font-bold text-[var(--text-secondary)] hover:bg-[#F4F6FF] transition-colors border-2 border-transparent hover:border-[#E8E8F0]">Cancel</button>
                <button type="submit" className="roam-btn-primary px-8">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
