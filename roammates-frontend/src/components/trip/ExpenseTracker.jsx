import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function ExpenseTracker({ tripId }) {
  const [expenses, setExpenses] = useState([
    { id: 1, description: 'Flights to Paris', amount: 45000, paidBy: 'Venmadhi', category: 'Transport', date: '2023-10-01' },
    { id: 2, description: 'Airbnb 4 nights', amount: 32000, paidBy: 'Rahul', category: 'Stay', date: '2023-10-02' },
    { id: 3, description: 'Dinner at Le Jules Verne', amount: 12000, paidBy: 'Priya', category: 'Food', date: '2023-10-03' }
  ]);
  
  const [isAdding, setIsAdding] = useState(false);
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', paidBy: 'Venmadhi', category: 'Food' });

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const budget = 100000;
  const budgetPercent = Math.min((totalSpent / budget) * 100, 100);
  
  const getBudgetColor = () => {
    if (budgetPercent > 90) return 'bg-[#FF6B6B]';
    if (budgetPercent > 70) return 'bg-[#F7C948]';
    return 'bg-[#2ECC71]';
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    setExpenses([...expenses, { ...newExpense, id: Date.now(), amount: Number(newExpense.amount), date: new Date().toISOString().split('T')[0] }]);
    setIsAdding(false);
    setNewExpense({ description: '', amount: '', paidBy: 'Venmadhi', category: 'Food' });
  };

  const CATEGORY_ICONS = {
    'Food': '🍽️',
    'Stay': '🏨',
    'Activity': '🎯',
    'Transport': '✈️',
    'Shopping': '🛍️'
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* SUMMARY BAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[#6C63FF] to-[#A78BFA] text-white p-5 rounded-[16px] shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 text-6xl opacity-20">💰</div>
          <h4 className="text-white/80 font-bold text-sm uppercase tracking-wider mb-1">Total Spent</h4>
          <p className="text-3xl font-[800]">₹{totalSpent.toLocaleString()}</p>
        </div>
        
        <div className="bg-gradient-to-br from-[#4facfe] to-[#00f2fe] text-white p-5 rounded-[16px] shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 text-6xl opacity-20">📊</div>
          <h4 className="text-white/80 font-bold text-sm uppercase tracking-wider mb-1">Your Share</h4>
          <p className="text-3xl font-[800]">₹{(totalSpent / 4).toLocaleString()}</p>
        </div>
        
        <div className="bg-gradient-to-br from-[#FF6B6B] to-[#ff8e8e] text-white p-5 rounded-[16px] shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 text-6xl opacity-20">💸</div>
          <h4 className="text-white/80 font-bold text-sm uppercase tracking-wider mb-1">You Owe</h4>
          <p className="text-3xl font-[800]">₹4,500</p>
        </div>
      </div>

      {/* BUDGET METER */}
      <div className="roam-card p-6">
        <div className="flex justify-between items-end mb-2">
          <h3 className="font-[800] text-[var(--text-primary)]">Trip Budget</h3>
          <span className="text-sm font-bold text-[var(--text-secondary)]">₹{totalSpent.toLocaleString()} / ₹{budget.toLocaleString()}</span>
        </div>
        <div className="w-full h-3 bg-[#E8E8F0] rounded-full overflow-hidden">
          <div 
            className={`h-full ${getBudgetColor()} transition-all duration-1000 ease-out`} 
            style={{ width: `${budgetPercent}%` }}
          ></div>
        </div>
        {budgetPercent > 90 && <p className="text-xs font-bold text-[#FF6B6B] mt-2">⚠️ Warning: Nearing budget limit!</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* EXPENSE LIST */}
        <div className="md:col-span-2 roam-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-[800] text-[var(--text-primary)]">Expenses</h3>
            <Button onClick={() => setIsAdding(true)} className="roam-btn-primary px-4 py-2 text-sm shadow-sm">
              + Add Expense
            </Button>
          </div>

          <div className="space-y-3">
            {expenses.map((exp) => (
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
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase">{exp.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BALANCE SECTION */}
        <div className="roam-card p-6 h-fit">
          <h3 className="text-xl font-[800] text-[var(--text-primary)] mb-6">Balances</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-[12px] bg-[#FF6B6B]/10 border border-[#FF6B6B]/20">
              <div className="flex items-center gap-3">
                <img src="https://ui-avatars.com/api/?name=Rahul&background=EEF0FF&color=6C63FF" className="w-8 h-8 rounded-full" alt="Rahul" />
                <div className="text-sm">
                  <span className="font-bold text-[var(--text-primary)]">You owe Rahul</span>
                  <div className="font-[800] text-[#FF6B6B]">₹4,500</div>
                </div>
              </div>
              <Button className="bg-[#FF6B6B] hover:bg-[#E05252] text-white text-xs px-3 py-1.5 rounded-[8px] font-bold shadow-sm">Settle</Button>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-[12px] bg-[#2ECC71]/10 border border-[#2ECC71]/20">
              <div className="flex items-center gap-3">
                <img src="https://ui-avatars.com/api/?name=Priya&background=EEF0FF&color=6C63FF" className="w-8 h-8 rounded-full" alt="Priya" />
                <div className="text-sm">
                  <span className="font-bold text-[var(--text-primary)]">Priya owes you</span>
                  <div className="font-[800] text-[#2ECC71]">₹2,100</div>
                </div>
              </div>
            </div>
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
                <input required type="number" className="roam-input" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} placeholder="0" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">Paid By</label>
                  <select className="roam-input bg-white" value={newExpense.paidBy} onChange={e => setNewExpense({...newExpense, paidBy: e.target.value})}>
                    <option>Venmadhi</option>
                    <option>Rahul</option>
                    <option>Priya</option>
                    <option>Amit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">Category</label>
                  <select className="roam-input bg-white" value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})}>
                    {Object.keys(CATEGORY_ICONS).map(cat => <option key={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-1.5">Receipt (Optional)</label>
                <div className="border-2 border-dashed border-[#E8E8F0] rounded-[10px] p-4 text-center text-sm font-semibold text-[var(--text-secondary)] hover:bg-[#F8F9FF] hover:border-[#6C63FF]/30 cursor-pointer transition-colors">
                  📷 Click to upload receipt
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#E8E8F0]">
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
