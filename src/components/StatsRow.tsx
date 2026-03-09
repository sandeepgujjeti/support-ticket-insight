import { StructuredTicket } from '@/lib/nlpEngine';
import { FileText, Users, MapPin, TrendingDown } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
}

function StatCard({ icon, label, value, sub }: StatCardProps) {
  return (
    <div className="glass-card rounded-lg p-5 stat-glow flex items-start gap-4">
      <div className="p-2.5 rounded-lg bg-primary/10 text-primary">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold font-display mt-0.5">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </div>
    </div>
  );
}

export function StatsRow({ tickets }: { tickets: StructuredTicket[] }) {
  const negCount = tickets.filter(t => t.sentiment === 'Negative').length;
  const uniqueLocations = new Set(tickets.map(t => t.location).filter(l => l !== 'Unknown')).size;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard icon={<FileText size={20} />} label="Total Tickets" value={tickets.length} />
      <StatCard icon={<Users size={20} />} label="Unique Customers" value={tickets.length} />
      <StatCard icon={<MapPin size={20} />} label="Locations" value={uniqueLocations} />
      <StatCard icon={<TrendingDown size={20} />} label="Negative Sentiment" value={`${Math.round(negCount / tickets.length * 100)}%`} sub={`${negCount} of ${tickets.length} tickets`} />
    </div>
  );
}
