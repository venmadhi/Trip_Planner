import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import api from '@/lib/axios'
import CreateTripDialog from '@/components/CreateTripDialog'

export default function Dashboard() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrips()
  }, [])

  const fetchTrips = async () => {
    try {
      const response = await api.get('/trips')
      setTrips(response.data)
    } catch (error) {
      console.error('Failed to fetch trips', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleTripCreated = (newTrip) => {
    setTrips([...trips, newTrip])
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.fullName}!</p>
        </div>
        <div className="flex gap-4">
          <CreateTripDialog onTripCreated={handleTripCreated} />
          <Button onClick={handleLogout} variant="outline">Logout</Button>
        </div>
      </div>

      {loading ? (
        <p>Loading trips...</p>
      ) : trips.length === 0 ? (
        <div className="text-center py-20 border rounded-lg bg-muted/20">
          <h2 className="text-xl font-semibold mb-2">No trips yet</h2>
          <p className="text-muted-foreground mb-4">Create your first trip or join one using an invite link.</p>
          <CreateTripDialog onTripCreated={handleTripCreated} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <Link to={`/trips/${trip.id}`} key={trip.id}>
              <Card className="hover:border-primary transition-colors cursor-pointer h-full">
                <CardHeader>
                  <CardTitle>{trip.title}</CardTitle>
                  <CardDescription>{trip.destination}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <p><strong>Dates:</strong> {trip.startDate} to {trip.endDate}</p>
                    <p><strong>Status:</strong> {trip.status}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
