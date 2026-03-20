// 換成你的 Vercel 部署網址
const API_BASE = 'https://zhangbao-backend.vercel.app';

export interface InvoiceItem {
  name: string;
  amount: number;
  category: string;
}

export interface Invoice {
  vendor: string;
  invoiceNo: string;
  date: string;
  total: number;
  tax: number;
  confidence: number;
  items: InvoiceItem[];
}

export async function analyzeInvoice(base64Image: string): Promise<Invoice> {
  const response = await fetch(`${API_BASE}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64Image }),
  });

  if (!response.ok) throw new Error('辨識失敗');
  return response.json();
}
