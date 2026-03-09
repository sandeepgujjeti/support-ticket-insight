import { StructuredTicket } from '@/lib/nlpEngine';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export function SentimentChart({ tickets }: { tickets: StructuredTicket[] }) {
  const pos = tickets.filter(t => t.sentiment === 'Positive').length;
  const neg = tickets.filter(t => t.sentiment === 'Negative').length;
  const data = [
    { name: 'Positive', value: pos },
    { name: 'Negative', value: neg },
  ];

  return (
    <div className="glass-card rounded-lg p-6 stat-glow">
      <h3 className="text-lg font-semibold font-display mb-4">Sentiment Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
            <Cell fill="hsl(160, 60%, 45%)" />
            <Cell fill="hsl(0, 72%, 55%)" />
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
