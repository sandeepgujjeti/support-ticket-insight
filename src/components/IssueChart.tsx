import { StructuredTicket } from '@/lib/nlpEngine';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = [
  'hsl(220, 72%, 50%)', 'hsl(160, 60%, 45%)', 'hsl(38, 92%, 50%)',
  'hsl(280, 60%, 55%)', 'hsl(0, 72%, 55%)', 'hsl(190, 70%, 45%)',
];

export function IssueChart({ tickets }: { tickets: StructuredTicket[] }) {
  const counts: Record<string, number> = {};
  tickets.forEach(t => { counts[t.issueType] = (counts[t.issueType] || 0) + 1; });
  const data = Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="glass-card rounded-lg p-6 stat-glow">
      <h3 className="text-lg font-semibold font-display mb-4">Most Common Issues</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="value" radius={[0, 6, 6, 0]}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
