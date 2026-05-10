import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import api from '@/lib/axios'

export default function JoinTrip() {
  const { inviteCode } = useParams()
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login but maybe save the invite code in state/localStorage to redirect back
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
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Join Trip</CardTitle>
          <CardDescription>You have been invited to join a trip!</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Click below to accept the invitation and join your Roammates.</p>
          {error && <p className="text-sm text-destructive mb-4">{error}</p>}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>Cancel</Button>
          <Button onClick={handleJoin} disabled={loading}>
            {loading ? 'Joining...' : 'Accept Invitation'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
