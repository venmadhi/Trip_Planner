import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';

export default function PollsTab({ tripId }) {
  const user = useAuthStore((state) => state.user);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newPoll, setNewPoll] = useState({ question: '', options: ['', ''] });

  useEffect(() => {
    fetchPolls();
  }, [tripId]);

  const fetchPolls = async () => {
    try {
      const response = await api.get(`/trips/${tripId}/polls`);
      setPolls(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOption = () => {
    setNewPoll({ ...newPoll, options: [...newPoll.options, ''] });
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newPoll.options];
    updatedOptions[index] = value;
    setNewPoll({ ...newPoll, options: updatedOptions });
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    if (!newPoll.question.trim() || newPoll.options.filter(o => o.trim()).length < 2) return;
    
    const optionsWithIds = newPoll.options
      .filter(o => o.trim())
      .map((text) => ({ text }));

    try {
      const response = await api.post(`/trips/${tripId}/polls`, {
        question: newPoll.question,
        options: optionsWithIds
      });
      setPolls([response.data, ...polls]);
      setIsCreating(false);
      setNewPoll({ question: '', options: ['', ''] });
    } catch (err) {
      console.error(err);
    }
  };

  const handleVote = async (pollId, optionId) => {
    try {
      const response = await api.put(`/trips/${tripId}/polls/${pollId}/vote/${optionId}`);
      setPolls(polls.map(p => p.id === pollId ? response.data : p));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center animate-pulse">Loading polls...</div>;

  return (
    <div className="roam-card p-6 md:p-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8 border-b border-[#E8E8F0] pb-4">
        <div>
          <h3 className="text-[1.5rem] font-[800] text-[var(--text-primary)]">Group Polls</h3>
          <p className="text-sm font-medium text-[var(--text-secondary)]">Vote on decisions together.</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)} 
          className="roam-btn-primary shadow-sm flex items-center gap-2"
        >
          <span className="text-lg leading-none">+</span> Create Poll
        </button>
      </div>

      {isCreating && (
        <div className="fixed inset-0 bg-[#1A1A2E]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-[24px] w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-2xl font-[800] text-[var(--text-primary)] mb-6">Create New Poll</h3>
            <form onSubmit={handleCreatePoll} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">Question</label>
                <input required className="roam-input" value={newPoll.question} onChange={e => setNewPoll({...newPoll, question: e.target.value})} placeholder="What do you want to ask?" />
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-bold text-[var(--text-primary)]">Options</label>
                {newPoll.options.map((opt, idx) => (
                  <input key={idx} className="roam-input bg-[#F8F9FF]" value={opt} onChange={e => handleOptionChange(idx, e.target.value)} placeholder={`Option ${idx + 1}`} required={idx < 2} />
                ))}
                <button type="button" onClick={handleAddOption} className="text-sm font-bold text-[#6C63FF] hover:text-[#5A52D5]">+ Add another option</button>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#E8E8F0] mt-6">
                <button type="button" onClick={() => setIsCreating(false)} className="px-6 py-2 rounded-[10px] font-bold text-[var(--text-secondary)] hover:bg-[#F4F6FF] transition-colors">Cancel</button>
                <button type="submit" className="roam-btn-primary">Post Poll</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {polls.length === 0 ? (
          <div className="text-center py-8 opacity-60">
            <div className="text-4xl mb-2">🗳</div>
            <p className="font-medium text-[var(--text-secondary)]">No polls yet.</p>
          </div>
        ) : polls.map(poll => {
          let winnerId = null;
          if (poll.status === 'Closed') {
            let maxVotes = -1;
            poll.options.forEach(o => {
              if (o.votes > maxVotes) { maxVotes = o.votes; winnerId = o.id; }
            });
          }

          return (
            <div key={poll.id} className="p-5 rounded-[16px] border border-[#E8E8F0] shadow-sm bg-white hover:border-[#6C63FF]/30 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-xl font-[800] text-[var(--text-primary)] leading-tight">{poll.question}</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shrink-0 ${poll.status === 'Closed' ? 'bg-[#E8E8F0] text-[var(--text-secondary)]' : 'bg-[#2ECC71]/10 text-[#2ECC71]'}`}>
                  {poll.status}
                </span>
              </div>

              <div className="space-y-3">
                {poll.options.map(option => {
                  const percent = poll.totalVotes === 0 ? 0 : Math.round((option.votes / poll.totalVotes) * 100);
                  const isSelected = poll.userVotedOptionId === option.id;
                  const isWinner = poll.status === 'Closed' && option.id === winnerId;
                  
                  let bgFillClass = "bg-[#EEF0FF]";
                  if (isWinner) bgFillClass = "bg-[#2ECC71]/20";
                  else if (isSelected) bgFillClass = "bg-[#6C63FF]/20";

                  let borderClass = "border-[#E8E8F0]";
                  if (isWinner) borderClass = "border-[#2ECC71]";
                  else if (isSelected) borderClass = "border-[#6C63FF]";

                  return (
                    <button 
                      key={option.id}
                      onClick={() => handleVote(poll.id, option.id)}
                      disabled={poll.status === 'Closed'}
                      className={`relative w-full text-left p-3 rounded-[12px] border transition-all overflow-hidden group ${borderClass} ${poll.status === 'Open' ? 'hover:border-[#6C63FF] cursor-pointer' : 'cursor-default'}`}
                    >
                      <div className={`absolute inset-0 transition-all duration-1000 ease-out opacity-50 ${bgFillClass}`} style={{ width: `${percent}%` }}></div>
                      <div className="relative z-10 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected || isWinner ? (isWinner ? 'border-[#2ECC71]' : 'border-[#6C63FF]') : 'border-[#C8C8DC] group-hover:border-[#6C63FF]'}`}>
                            {(isSelected || isWinner) && <div className={`w-2.5 h-2.5 rounded-full ${isWinner ? 'bg-[#2ECC71]' : 'bg-[#6C63FF]'}`}></div>}
                          </div>
                          <span className={`font-semibold ${isWinner ? 'text-[#2ECC71]' : (isSelected ? 'text-[#6C63FF]' : 'text-[var(--text-primary)]')}`}>
                            {option.text} {isWinner && '👑'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[var(--text-secondary)]">{option.votes} votes</span>
                          <span className="text-xs font-bold text-[var(--text-muted)] w-8 text-right">{percent}%</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs font-bold text-[var(--text-muted)] mt-4">{poll.totalVotes} total votes</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
