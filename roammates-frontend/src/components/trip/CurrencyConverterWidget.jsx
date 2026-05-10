import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function CurrencyConverterWidget() {
  const [rates, setRates] = useState(null);
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR'];

  useEffect(() => {
    const fetchRates = async () => {
      const apiKey = import.meta.env.VITE_EXCHANGERATE_API_KEY;
      
      if (!apiKey) {
        setError("Missing API Key");
        return;
      }

      try {
        const response = await axios.get(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
        setRates(response.data.conversion_rates);
      } catch (err) {
        setError("Failed to fetch exchange rates.");
      }
    };

    fetchRates();
  }, []);

  const handleConvert = () => {
    if (!rates) return;
    
    // Convert logic (everything is relative to USD in the base fetch)
    const fromRate = rates[fromCurrency];
    const toRate = rates[toCurrency];
    
    if (fromRate && toRate) {
      const valueInUsd = amount / fromRate;
      const convertedValue = valueInUsd * toRate;
      setResult(convertedValue.toFixed(2));
    }
  };

  if (error) return (
    <Card className="glass-card">
      <CardContent className="p-4 text-center">
        <p className="text-sm text-destructive">{error}</p>
        {error === "Missing API Key" && <p className="text-xs text-muted-foreground mt-2">Add VITE_EXCHANGERATE_API_KEY to your .env file.</p>}
      </CardContent>
    </Card>
  );

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-md">Currency Converter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            className="w-full border rounded p-2 text-sm"
          />
        </div>
        <div className="flex space-x-2">
          <select 
            value={fromCurrency} 
            onChange={(e) => setFromCurrency(e.target.value)}
            className="w-full border rounded p-2 text-sm bg-background"
          >
            {currencies.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <span className="flex items-center text-muted-foreground">→</span>
          <select 
            value={toCurrency} 
            onChange={(e) => setToCurrency(e.target.value)}
            className="w-full border rounded p-2 text-sm bg-background"
          >
            {currencies.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <Button onClick={handleConvert} className="w-full" variant="secondary" size="sm">
          Convert
        </Button>
        {result !== null && (
          <div className="text-center font-semibold text-lg mt-2">
            {result} {toCurrency}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
