import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function WeatherWidget({ destination }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
      
      if (!apiKey) {
        setError("Missing API Key");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${destination}&units=metric&appid=${apiKey}`);
        setWeather(response.data);
      } catch (err) {
        setError("Failed to fetch weather data.");
      } finally {
        setLoading(false);
      }
    };

    if (destination) {
      fetchWeather();
    }
  }, [destination]);

  if (loading) return <Card className="glass-card"><CardContent className="p-4 text-center text-sm">Loading weather...</CardContent></Card>;
  
  if (error) return (
    <Card className="glass-card">
      <CardContent className="p-4 text-center">
        <p className="text-sm text-destructive">{error}</p>
        {error === "Missing API Key" && <p className="text-xs text-muted-foreground mt-2">Add VITE_OPENWEATHER_API_KEY to your .env file.</p>}
      </CardContent>
    </Card>
  );

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex justify-between items-center">
          Weather in {destination}
          {weather && weather.weather[0] && (
            <img 
              src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} 
              alt="Weather icon" 
              className="w-8 h-8"
            />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {weather ? (
          <div>
            <div className="text-3xl font-bold">{Math.round(weather.main.temp)}°C</div>
            <p className="text-sm text-muted-foreground capitalize">{weather.weather[0].description}</p>
            <div className="flex justify-between mt-4 text-xs text-muted-foreground">
              <span>Humidity: {weather.main.humidity}%</span>
              <span>Wind: {weather.wind.speed} m/s</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No data available.</p>
        )}
      </CardContent>
    </Card>
  );
}
