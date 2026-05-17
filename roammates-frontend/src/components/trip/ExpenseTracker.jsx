import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';

export default function ExpenseTracker({ tripId }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [members, setMembers] = useState([]);
  const user = useAuthStore(state => state.user);

  const [newExpense, setNewExpense] = useState({ description: '', amount: '', paidBy: '', category: 'Food' });

  useEffect(() => {
    fetchExpenses();
    fetchMembers();
  }, [tripId]);

  const fetchExpenses = async () => {
    try {
      const response = await api.get(`/trips/${tripId}/expenses`);
      setExpenses(response.data);
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
          setNewExpense(prev => ({ ...prev, paidBy: trip.members[0].fullName }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const budget = 100000;
  const budgetPercent = Math.min((totalSpent / budget) * 100, 100);
  
  const memberCount = members.length || 1;
  const fairShare = totalSpent / memberCount;

  // Calculate roughly what current user paid vs fair share
  const myTotalPaid = expenses.filter(e => e.paidBy === user?.fullName).reduce((s, e) => s + e.amount, 0);
  const myBalance = myTotalPaid - fairShare; 
  // Positive means people owe me, negative means I owe people

  const getBudgetColor = () => {
    if (budgetPercent > 90) return 'bg-[#FF6B6B]';
    if (budgetPercent > 70) return 'bg-[#F7C948]';
    return 'bg-[#2ECC71]';
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!newExpense.description || !newExpense.amount) return;
    try {
      const response = await api.post(`/trips/${tripId}/expenses`, {
        description: newExpense.description,
        amount: Number(newExpense.amount),
        paidBy: newExpense.paidBy,
        category: newExpense.category
      });
      setExpenses([response.data, ...expenses]);
      setIsAdding(false);
      setNewExpense({ ...newExpense, description: '', amount: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const CATEGORY_ICONS = {
    'Food': '🍽️',
    'Stay': '🏨',
    'Activity': '🎯',
    'Transport': '✈️',
    'Shopping': '🛍️'
  };

  if (loading) return <div className="p-8 text-center animate-pulse">Loading expenses...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* SUMMARY BAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[#6C63FF] to-[#A78BFA] text-white p-5 rounded-[16px] shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 text-6xl opacity-20">💰</div>
          <h4 className="text-white/80 font-bold text-sm uppercase tracking-wider mb-1">Total Spent</h4>
          <p className="text-3xl font-[800]">₹{totalSpent.toLocaleString(undefined, {maximumFractionDigits:0})}</p>
        </div>
        
        <div className="bg-gradient-to-br from-[#4facfe] to-[#00f2fe] text-white p-5 rounded-[16px] shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 text-6xl opacity-20">📊</div>
          <h4 className="text-white/80 font-bold text-sm uppercase tracking-wider mb-1">Fair Share (per person)</h4>
          <p className="text-3xl font-[800]">₹{fairShare.toLocaleString(undefined, {maximumFractionDigits:0})}</p>
        </div>
        
        <div className={`text-white p-5 rounded-[16px] shadow-sm relative overflow-hidden ${myBalance >= 0 ? 'bg-gradient-to-br from-[#2ECC71] to-[#27ae60]' : 'bg-gradient-to-br from-[#FF6B6B] to-[#ff8e8e]'}`}>
          <div className="absolute -right-4 -bottom-4 text-6xl opacity-20">💸</div>
          <h4 className="text-white/80 font-bold text-sm uppercase tracking-wider mb-1">
            {myBalance >= 0 ? 'You are owed' : 'You Owe'}
          </h4>
          <p className="text-3xl font-[800]">₹{Math.abs(myBalance).toLocaleString(undefined, {maximumFractionDigits:0})}</p>
        </div>
      </div>

      {/* BUDGET METER */}
      <div className="roam-card p-6">
        <div className="flex justify-between items-end mb-2">
          <h3 className="font-[800] text-[var(--text-primary)]">Trip Budget</h3>
          <span className="text-sm font-bold text-[var(--text-secondary)]">₹{totalSpent.toLocaleString(undefined, {maximumFractionDigits:0})} / ₹{budget.toLocaleString()}</span>
        </div>
        <div className="w-full h-3 bg-[#E8E8F0] rounded-full overflow-hidden">
          <div 
            className={`h-full ${getBudgetColor()} transition-all duration-1000 ease-out`} 
            style={{ width: `${budgetPercent}%` }}
          ></div>
        </div>
        {budgetPercent > 90 && <p className="text-xs font-bold text-[#FF6B6B] mt-2">⚠️ Warning: Nearing budget limit!</p>}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* EXPENSE LIST */}
        <div className="roam-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-[800] text-[var(--text-primary)]">Expenses</h3>
            <Button onClick={() => setIsAdding(true)} className="roam-btn-primary px-4 py-2 text-sm shadow-sm">
              + Add Expense
            </Button>
          </div>

          <div className="space-y-3">
            {expenses.length === 0 ? (
               <div className="text-center py-8 opacity-60">
                 <div className="text-4xl mb-2">💸</div>
                 <p className="font-medium text-[var(--text-secondary)]">No expenses recorded yet.</p>
               </div>
            ) : expenses.map((exp) => (
              <div key={exp.id} className="flex items-center justify-between p-3 rounded-[12px] border border-[#E8E8F0] hover:border-[#6C63FF]/30 hover:bg-[#F8F9FF] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#EEF0FF] flex items-center justify-center text-lg shadow-sm border border-white">
                    {CATEGORY_ICONS[exp.category] || '💸'}
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--text-primary)]">{exp.description}</h4>
                    <p className="text-xs font-semibold text-[var(--text-secondary)]">Paid by <span className="text-[#6C63FF]">{exp.paidBy}</span></p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-[800] text-lg text-[var(--text-primary)]">₹{exp.amount.toLocaleString()}</span>
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase">
                    {exp.date ? new Date(exp.date).toLocaleDateString() : 'Today'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ADD EXPENSE MODAL */}
      {isAdding && (
        <div className="fixed inset-0 bg-[#1A1A2E]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-[24px] w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-2xl font-[800] text-[var(--text-primary)] mb-6">Add New Expense</h3>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">Description</label>
                <input required className="roam-input" value={newExpense.description} onChange={e => setNewExpense({...newExpense, description: e.target.value})} placeholder="What was this for?" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">Amount (₹)</label>
                <input required type="number" step="0.01" className="roam-input" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} placeholder="0" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">Paid By</label>
                  <select className="roam-input bg-white" value={newExpense.paidBy} onChange={e => setNewExpense({...newExpense, paidBy: e.target.value})}>
                    {members.map(m => (
                      <option key={m.id} value={m.fullName}>{m.fullName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">Category</label>
                  <select className="roam-input bg-white" value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})}>
                    {Object.keys(CATEGORY_ICONS).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#E8E8F0] mt-4">
                <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-2 rounded-[10px] font-bold text-[var(--text-secondary)] hover:bg-[#F4F6FF]">Cancel</button>
                <button type="submit" className="roam-btn-primary">Add Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
