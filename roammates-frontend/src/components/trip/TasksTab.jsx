import { useState, useEffect } from 'react';
import api from '@/lib/axios';

export default function TasksTab({ tripId }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', assignee: '', deadline: '' });
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchTasks();
    fetchMembers();
  }, [tripId]);

  const fetchTasks = async () => {
    try {
      const response = await api.get(`/trips/${tripId}/tasks`);
      setTasks(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await api.get('/trips');
      const trip = response.data.find(t => t.id.toString() === tripId.toString());
      if (trip && trip.members) {
        setMembers(trip.members);
        if (trip.members.length > 0) {
          setNewTask(prev => ({ ...prev, assignee: trip.members[0].fullName }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    try {
      const response = await api.post(`/trips/${tripId}/tasks`, newTask);
      setTasks([...tasks, response.data]);
      setIsAdding(false);
      setNewTask({ ...newTask, title: '', deadline: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTaskStatus = async (id) => {
    try {
      const response = await api.put(`/trips/${tripId}/tasks/${id}/toggle`);
      setTasks(tasks.map(t => t.id === id ? response.data : t));
    } catch (err) {
      console.error(err);
    }
  };

  const getDeadlineColor = (deadline, status) => {
    if (status === 'Done') return 'bg-[#EEF0FF] text-[#6C63FF]';
    if (!deadline) return 'bg-[#E8E8F0] text-[var(--text-secondary)]';
    
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'bg-[#FF6B6B]/10 text-[#FF6B6B] border border-[#FF6B6B]/20';
    if (diffDays <= 3) return 'bg-[#F7C948]/20 text-[#D49E00] border border-[#F7C948]/30';
    return 'bg-[#2ECC71]/10 text-[#2ECC71] border border-[#2ECC71]/20';
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Done': return 'bg-[#2ECC71]/10 text-[#2ECC71] font-bold border border-[#2ECC71]/30';
      case 'In Progress': return 'bg-[#F7C948]/20 text-[#D49E00] font-bold border border-[#F7C948]/30';
      default: return 'bg-[#F8F9FF] text-[var(--text-secondary)] font-semibold border border-[#E8E8F0]';
    }
  };

  if (loading) return <div className="p-8 text-center animate-pulse">Loading tasks...</div>;

  return (
    <div className="roam-card p-6 md:p-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 border-b border-[#E8E8F0] pb-4">
        <div>
          <h3 className="text-[1.5rem] font-[800] text-[var(--text-primary)]">Task Board</h3>
          <p className="text-sm font-medium text-[var(--text-secondary)]">Delegate and track trip responsibilities.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)} 
          className="roam-btn-primary shadow-sm flex items-center gap-2"
        >
          <span className="text-lg leading-none">+</span> Add Task
        </button>
      </div>

      {/* TASK LIST */}
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center py-8 opacity-60">
            <div className="text-4xl mb-2">📋</div>
            <p className="font-medium text-[var(--text-secondary)]">No tasks assigned yet.</p>
          </div>
        ) : (
          tasks.map(task => (
            <div 
              key={task.id} 
              className={`p-4 rounded-[16px] border transition-all duration-300 flex items-center gap-4 ${
                task.status === 'Done' ? 'bg-[#F4F6FF] border-transparent opacity-70' : 'bg-white border-[#E8E8F0] hover:border-[#6C63FF]/30 hover:shadow-md'
              }`}
            >
              <button 
                onClick={() => toggleTaskStatus(task.id)}
                className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center border-2 transition-colors ${
                  task.status === 'Done' 
                    ? 'bg-[#2ECC71] border-[#2ECC71] text-white' 
                    : task.status === 'In Progress'
                    ? 'bg-white border-[#F7C948] text-[#F7C948]'
                    : 'bg-white border-[#C8C8DC] text-transparent hover:border-[#6C63FF]'
                }`}
              >
                {task.status === 'Done' ? '✓' : (task.status === 'In Progress' ? '⚙' : '✓')}
              </button>

              <div className="flex-1 min-w-0">
                <h4 className={`text-lg font-bold leading-tight mb-1 ${task.status === 'Done' ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}`}>
                  {task.title}
                </h4>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${getStatusStyle(task.status)}`}>
                    {task.status}
                  </span>
                  
                  {task.deadline && (
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 ${getDeadlineColor(task.deadline, task.status)}`}>
                      ⏱ {new Date(task.deadline).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}
                    </span>
                  )}
                </div>
              </div>

              <div className="shrink-0 flex flex-col items-center gap-1">
                <img 
                  src={`https://ui-avatars.com/api/?name=${task.assignee}&background=EEF0FF&color=6C63FF&bold=true`} 
                  alt={task.assignee}
                  className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                  title={`Assigned to ${task.assignee}`}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* ADD TASK MODAL */}
      {isAdding && (
        <div className="fixed inset-0 bg-[#1A1A2E]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-[24px] w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-2xl font-[800] text-[var(--text-primary)] mb-6">Assign New Task</h3>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">Task Title</label>
                <input required className="roam-input" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} placeholder="What needs to be done?" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">Assign To</label>
                  <select required className="roam-input bg-white" value={newTask.assignee} onChange={e => setNewTask({...newTask, assignee: e.target.value})}>
                    {members.map(m => (
                      <option key={m.id} value={m.fullName}>{m.fullName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">Deadline</label>
                  <input type="date" required className="roam-input" value={newTask.deadline} onChange={e => setNewTask({...newTask, deadline: e.target.value})} />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-[#E8E8F0] mt-6">
                <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-2 rounded-[10px] font-bold text-[var(--text-secondary)] hover:bg-[#F4F6FF] transition-colors border-2 border-transparent hover:border-[#E8E8F0]">Cancel</button>
                <button type="submit" className="roam-btn-primary">Assign Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
