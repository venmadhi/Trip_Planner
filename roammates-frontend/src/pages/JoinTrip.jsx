import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/axios'

export default function JoinTrip() {
  const { inviteCode } = useParams()
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  const handleJoin = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await api.post(`/trips/join/${inviteCode}`)
      navigate(`/trips/${response.data.id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join trip. It might be invalid or you are already a member.')
      setLoading(false)
    }
  }

  if (!isAuthenticated) return null

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--bg)] p-6">
      <div className="bg-white rounded-[24px] w-full max-w-md p-8 sm:p-10 shadow-[0_20px_60px_rgba(108,99,255,0.15)] border border-[#E8E8F0]/50 animate-in fade-in zoom-in-95 duration-500 text-center">
        
        <div className="w-20 h-20 bg-[#EEF0FF] rounded-full mx-auto mb-6 flex items-center justify-center text-4xl shadow-inner">
          🤝
        </div>

        <h1 className="text-3xl font-[800] text-[var(--text-primary)] mb-2 tracking-tight">You're Invited!</h1>
        <p className="text-[var(--text-secondary)] font-medium mb-8">
          You've been invited to join a trip. Click below to accept the invitation and start planning with your Roammates.
        </p>
        
        <div className="bg-[#F8F9FF] border border-dashed border-[#C8C8DC] rounded-[12px] py-4 mb-8">
          <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">Invite Code</p>
          <p className="text-2xl font-[800] text-[#6C63FF] tracking-[0.2em]">{inviteCode}</p>
        </div>

        {error && (
          <div className="bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 text-[#FF6B6B] px-4 py-3 rounded-[12px] text-sm font-bold mb-8">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button 
            onClick={handleJoin} 
            disabled={loading}
            className="roam-btn-primary w-full py-4 text-lg"
          >
            {loading ? 'Joining Trip...' : 'Accept Invitation'}
          </button>
          
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full py-3 rounded-[12px] font-bold text-[var(--text-secondary)] hover:bg-[#F4F6FF] transition-colors"
          >
            Cancel & Go to Dashboard
          </button>
        </div>

      </div>
    </div>
  )
}
