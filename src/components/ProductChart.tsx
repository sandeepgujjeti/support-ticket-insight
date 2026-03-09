import { StructuredTicket } from '@/lib/nlpEngine';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = [
  'hsl(220, 72%, 50%)', 'hsl(160, 60%, 45%)', 'hsl(38, 92%, 50%)',
  'hsl(280, 60%, 55%)', 'hsl(0, 72%, 55%)', 'hsl(190, 70%, 45%)',
  'hsl(320, 60%, 50%)', 'hsl(45, 80%, 50%)',
];

export function ProductChart({ tickets }: { tickets: StructuredTicket[] }) {
  const counts: Record<string, number> = {};
  tickets.filter(t => t.sentiment === 'Negative').forEach(t => {
    counts[t.product] = (counts[t.product] || 0) + 1;
  });
  const data = Object.entries(counts)
    .map(([name, value]) => ({ name: name.length > 18 ? name.slice(0, 18) + '…' : name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  return (
    <div className="glass-card rounded-lg p-6 stat-glow">
      <h3 className="text-lg font-semibold font-display mb-4">Product Complaint Frequency</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-35} textAnchor="end" height={80} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
