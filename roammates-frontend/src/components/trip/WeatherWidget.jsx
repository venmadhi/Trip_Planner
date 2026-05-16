import { useState, useEffect } from 'react';
import axios from 'axios';

export default function WeatherWidget({ destination }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
        if (!apiKey) {
          // Mock data if no API key
          setWeather({
            temp: 72,
            condition: 'Partly Cloudy',
            humidity: 45,
            wind: 8,
            icon: '04d'
          });
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${destination}&units=imperial&appid=${apiKey}`
        );
        
        setWeather({
          temp: Math.round(response.data.main.temp),
          condition: response.data.weather[0].main,
          humidity: response.data.main.humidity,
          wind: Math.round(response.data.wind.speed),
          icon: response.data.weather[0].icon
        });
      } catch (error) {
        console.error("Error fetching weather:", error);
        // Mock fallback on error
        setWeather({
          temp: 68,
          condition: 'Sunny',
          humidity: 50,
          wind: 5,
          icon: '01d'
        });
      } finally {
        setLoading(false);
      }
    };

    if (destination) {
      fetchWeather();
    }
  }, [destination]);

  if (loading) {
    return (
      <div className="roam-card h-[200px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#6C63FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!weather) return null;

  // Determine dot color based on temp
  const getDotColor = (temp) => {
    if (temp > 80) return 'bg-[#FF6B6B] shadow-[#FF6B6B]/50'; // Hot
    if (temp > 60) return 'bg-[#F7C948] shadow-[#F7C948]/50'; // Warm
    return 'bg-[#2ECC71] shadow-[#2ECC71]/50'; // Cool
  };

  return (
    <div className="relative rounded-[16px] overflow-hidden shadow-[0_4px_14px_rgba(108,99,255,0.08)] border border-[#E8E8F0] p-6 transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(108,99,255,0.15)] bg-gradient-to-br from-[#EEF0FF] to-[#E6E8FA]">
      
      {/* Background decoration */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/40 rounded-full blur-2xl pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-sm font-[800] text-[#6C63FF] uppercase tracking-wider">Weather in {destination}</h3>
          <div className={`w-3 h-3 rounded-full shadow-md ${getDotColor(weather.temp)}`}></div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-[3.5rem] leading-none font-[800] text-[var(--text-primary)] tracking-tighter">
              {weather.temp}°
            </div>
            <div className="text-lg font-bold text-[var(--text-secondary)] mt-1">
              {weather.condition}
            </div>
          </div>
          
          <img 
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} 
            alt={weather.condition}
            className="w-20 h-20 drop-shadow-md"
            onError={(e) => e.target.style.display = 'none'}
          />
        </div>

        <div className="flex gap-4 mt-6 pt-4 border-t border-white/50">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Humidity</span>
            <span className="text-sm font-semibold text-[var(--text-primary)]">{weather.humidity}%</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Wind</span>
            <span className="text-sm font-semibold text-[var(--text-primary)]">{weather.wind} mph</span>
          </div>
        </div>
      </div>
    </div>
  );
}
