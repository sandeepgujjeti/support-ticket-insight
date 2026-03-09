export interface StructuredTicket {
  ticketId: string;
  customerName: string;
  location: string;
  product: string;
  issueType: string;
  description: string;
  sentiment: 'Positive' | 'Negative';
  sentimentScore: number;
}

const POSITIVE_WORDS = [
  'love', 'amazing', 'fantastic', 'great', 'excellent', 'happy', 'pleased',
  'best', 'superb', 'incredible', 'phenomenal', 'exceeded', 'recommend',
  'wonderful', 'perfect', 'impressed', 'delighted', 'happier', 'enjoy'
];

const NEGATIVE_WORDS = [
  'frustrated', 'disappointed', 'terrible', 'nightmare', 'unhappy', 'broken',
  'faulty', 'crashed', 'defective', 'upset', 'annoyed', 'frustrating',
  'impossible', 'worst', 'horrible', 'awful', 'refund', 'complaint',
  'stopped', 'cracked', 'dead', 'failing', 'issue', 'problem', 'concern'
];

const ISSUE_KEYWORDS: Record<string, string[]> = {
  'Hardware Defect': ['broken', 'cracked', 'defective', 'faulty', 'dead pixels', 'stopped working'],
  'Performance Issue': ['slow', 'crashes', 'crashed', 'overheating', 'flickering', 'freezing'],
  'Battery Problem': ['battery', 'charging', 'battery life', 'drain'],
  'Connectivity Issue': ['bluetooth', 'connectivity', 'disconnect', 'syncing', 'wifi'],
  'Software Bug': ['software', 'update', 'bug', 'glitch', 'infotainment'],
  'Quality Complaint': ['quality', 'durability', 'expected better'],
  'Positive Feedback': ['love', 'amazing', 'fantastic', 'great', 'excellent', 'happy', 'pleased', 'best'],
};

const PRODUCTS = [
  'iPhone 15 Pro', 'Samsung Galaxy S24', 'MacBook Air M3', 'Dell XPS 15',
  'Sony WH-1000XM5', 'iPad Pro 12.9', 'Google Pixel 8', 'HP Spectre x360',
  'Apple Watch Ultra 2', 'Bose QuietComfort', 'Microsoft Surface Pro 9',
  'Canon EOS R6', 'LG OLED TV', 'Fitbit Charge 6', 'Nintendo Switch OLED',
  'Lenovo ThinkPad X1 Carbon', 'Dyson V15', 'AirPods Pro 2',
  'Samsung Smart Fridge', 'Tesla Model 3'
];

const US_CITIES = [
  'New York', 'San Francisco', 'Chicago', 'Houston', 'Seattle', 'Boston',
  'Los Angeles', 'Miami', 'Denver', 'Phoenix', 'Portland', 'Atlanta',
  'Dallas', 'Minneapolis', 'San Diego', 'Austin', 'Nashville', 'Detroit',
  'Columbus', 'Charlotte'
];

function analyzeSentiment(text: string): { sentiment: 'Positive' | 'Negative'; score: number } {
  const lower = text.toLowerCase();
  let score = 0;
  POSITIVE_WORDS.forEach(w => { if (lower.includes(w)) score += 1; });
  NEGATIVE_WORDS.forEach(w => { if (lower.includes(w)) score -= 1; });
  return { sentiment: score >= 0 ? 'Positive' : 'Negative', score };
}

function extractName(text: string): string {
  const patterns = [
    /(?:my name is|i'm|i am|this is|hi,?\s*i'm)\s+([A-Z][a-z]+ [A-Z][a-z]+)/i,
    /^([A-Z][a-z]+ [A-Z][a-z]+)(?:,|\s+here|\s+from)/,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return m[1];
  }
  return 'Unknown';
}

function extractLocation(text: string): string {
  for (const city of US_CITIES) {
    if (text.includes(city)) return city;
  }
  return 'Unknown';
}

function extractProduct(text: string): string {
  for (const product of PRODUCTS) {
    if (text.toLowerCase().includes(product.toLowerCase())) return product;
  }
  return 'Unknown';
}

function classifyIssue(text: string): string {
  const lower = text.toLowerCase();
  let bestMatch = 'General Inquiry';
  let bestScore = 0;
  for (const [issue, keywords] of Object.entries(ISSUE_KEYWORDS)) {
    const score = keywords.filter(k => lower.includes(k)).length;
    if (score > bestScore) { bestScore = score; bestMatch = issue; }
  }
  return bestMatch;
}

function extractTicketId(text: string): string {
  const m = text.match(/TKT-\d+/i);
  return m ? m[0] : `TKT-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
}

export function processTickets(rawText: string): StructuredTicket[] {
  const lines = rawText.split('\n').filter(l => l.trim());
  return lines.map(line => {
    const { sentiment, score } = analyzeSentiment(line);
    return {
      ticketId: extractTicketId(line),
      customerName: extractName(line),
      location: extractLocation(line),
      product: extractProduct(line),
      issueType: classifyIssue(line),
      description: line.replace(/^TKT-\d+:\s*/, '').trim(),
      sentiment,
      sentimentScore: score,
    };
  });
}
