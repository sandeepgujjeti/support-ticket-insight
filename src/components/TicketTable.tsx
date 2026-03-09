import { StructuredTicket } from '@/lib/nlpEngine';
import { Badge } from '@/components/ui/badge';

export function TicketTable({ tickets }: { tickets: StructuredTicket[] }) {
  return (
    <div className="glass-card rounded-lg p-6 overflow-auto">
      <h3 className="text-lg font-semibold font-display mb-4">Structured Ticket Data</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {['Ticket ID', 'Customer', 'Location', 'Product', 'Issue Type', 'Sentiment'].map(h => (
                <th key={h} className="text-left py-3 px-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tickets.map(t => (
              <tr key={t.ticketId} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                <td className="py-3 px-3 font-mono text-xs">{t.ticketId}</td>
                <td className="py-3 px-3">{t.customerName}</td>
                <td className="py-3 px-3">{t.location}</td>
                <td className="py-3 px-3 font-medium">{t.product}</td>
                <td className="py-3 px-3">
                  <Badge variant={t.issueType === 'Positive Feedback' ? 'default' : 'secondary'} className="text-xs">
                    {t.issueType}
                  </Badge>
                </td>
                <td className="py-3 px-3">
                  <Badge
                    className={`text-xs ${
                      t.sentiment === 'Positive'
                        ? 'bg-success/15 text-success border-success/30'
                        : 'bg-destructive/15 text-destructive border-destructive/30'
                    }`}
                    variant="outline"
                  >
                    {t.sentiment}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
