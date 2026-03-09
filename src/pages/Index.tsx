import { useState, useMemo } from 'react';
import { processTickets } from '@/lib/nlpEngine';
import { sampleTickets } from '@/data/sampleTickets';
import { StatsRow } from '@/components/StatsRow';
import { IssueChart } from '@/components/IssueChart';
import { SentimentChart } from '@/components/SentimentChart';
import { ProductChart } from '@/components/ProductChart';
import { LocationChart } from '@/components/LocationChart';
import { TicketTable } from '@/components/TicketTable';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Brain, Upload, ChevronDown, ChevronUp, Download } from 'lucide-react';

const Index = () => {
  const [rawText, setRawText] = useState(sampleTickets);
  const [showInput, setShowInput] = useState(false);
  const tickets = useMemo(() => processTickets(rawText), [rawText]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setRawText(ev.target?.result as string);
    reader.readAsText(file);
  };

  const downloadCsv = () => {
    const headers = ['Ticket ID,Customer Name,Location,Product,Issue Type,Sentiment,Description'];
    const rows = tickets.map(t =>
      `${t.ticketId},"${t.customerName}","${t.location}","${t.product}","${t.issueType}",${t.sentiment},"${t.description.replace(/"/g, '""')}"`
    );
    const blob = new Blob([headers.concat(rows).join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'structured_tickets.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary text-primary-foreground">
              <Brain size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display">NLP Ticket Analyzer</h1>
              <p className="text-xs text-muted-foreground">Extract structured insights from unstructured support tickets</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowInput(!showInput)}>
              {showInput ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              <span className="ml-1.5 hidden sm:inline">Input Data</span>
            </Button>
            <Button variant="outline" size="sm" onClick={downloadCsv}>
              <Download size={16} />
              <span className="ml-1.5 hidden sm:inline">Export CSV</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Input Section */}
        {showInput && (
          <div className="glass-card rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold font-display">Raw Ticket Data</h2>
              <label className="cursor-pointer">
                <input type="file" accept=".txt,.csv" className="hidden" onChange={handleFileUpload} />
                <Button variant="secondary" size="sm" asChild>
                  <span><Upload size={14} className="mr-1.5" />Upload .txt</span>
                </Button>
              </label>
            </div>
            <Textarea
              value={rawText}
              onChange={e => setRawText(e.target.value)}
              rows={8}
              className="font-mono text-xs"
              placeholder="Paste unstructured ticket text here..."
            />
          </div>
        )}

        {/* Stats */}
        <StatsRow tickets={tickets} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IssueChart tickets={tickets} />
          <SentimentChart tickets={tickets} />
          <ProductChart tickets={tickets} />
          <LocationChart tickets={tickets} />
        </div>

        {/* Data Table */}
        <TicketTable tickets={tickets} />
      </main>
    </div>
  );
};

export default Index;
