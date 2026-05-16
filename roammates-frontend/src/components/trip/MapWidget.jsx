import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MapWidget({ destination }) {
  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex justify-between items-center">
          Destination Map
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-hidden rounded-b-xl">
        <div className="w-full h-[200px] bg-muted relative">
           <iframe
             title="Map"
             width="100%"
             height="100%"
             style={{ border: 0 }}
             loading="lazy"
             allowFullScreen
             src={`https://maps.google.com/maps?q=${encodeURIComponent(destination || 'Paris')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
           ></iframe>
        </div>
      </CardContent>
    </Card>
  );
}
