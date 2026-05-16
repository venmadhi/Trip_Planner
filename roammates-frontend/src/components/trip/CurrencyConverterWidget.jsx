import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CurrencyConverterWidget() {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [result, setResult] = useState(null);
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);

  const currencies = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD', 'SGD', 'CHF', 'CNY'];

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const apiKey = import.meta.env.VITE_EXCHANGERATE_API_KEY;
        if (!apiKey) {
          // Fallback mock rates
          setRates({
            USD: 1, EUR: 0.93, GBP: 0.79, INR: 83.12, JPY: 148.5, AUD: 1.52, CAD: 1.35, SGD: 1.34, CHF: 0.88, CNY: 7.19
          });
          setLoading(false);
          return;
        }

        const response = await axios.get(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
        setRates(response.data.conversion_rates);
      } catch (error) {
        console.error("Error fetching rates:", error);
        // Fallback mock rates on error
        setRates({
          USD: 1, EUR: 0.93, GBP: 0.79, INR: 83.12, JPY: 148.5, AUD: 1.52, CAD: 1.35, SGD: 1.34, CHF: 0.88, CNY: 7.19
        });
      } finally {
        setLoading(false);
      }
    };
    fetchRates();
  }, []);

  const handleConvert = () => {
    if (!amount || !rates) return;
    const amountInUSD = amount / rates[fromCurrency];
    const converted = amountInUSD * rates[toCurrency];
    setResult(converted.toFixed(2));
  };

  if (loading) return (
    <div className="roam-card h-[200px] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#6C63FF] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="roam-card p-6">
      <h3 className="text-lg font-[800] text-[var(--text-primary)] mb-5">💱 Currency Converter</h3>
      
      <div className="space-y-4">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] font-bold text-lg">₹</span>
          <input 
            type="number" 
            className="roam-input pl-8 text-lg font-bold h-12"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            className="roam-input flex-1 bg-[#F8F9FF] font-bold text-center h-12"
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
          >
            {currencies.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          
          <div className="text-[#6C63FF] bg-[#EEF0FF] w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 shadow-sm border border-white">
            →
          </div>
          
          <select 
            className="roam-input flex-1 bg-[#F8F9FF] font-bold text-center h-12"
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
          >
            {currencies.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <button 
          onClick={handleConvert}
          className="roam-btn-primary w-full h-12 mt-2"
        >
          Convert
        </button>

        {result !== null && (
          <div className="mt-5 pt-4 border-t border-[#E8E8F0] text-center animate-in fade-in zoom-in-95">
            <p className="text-[2rem] font-[800] text-transparent bg-clip-text bg-gradient-to-r from-[#6C63FF] to-[#A78BFA] tracking-tight leading-none mb-1">
              {result} <span className="text-xl">{toCurrency}</span>
            </p>
            <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
              1 {fromCurrency} = {(rates[toCurrency] / rates[fromCurrency]).toFixed(4)} {toCurrency}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
