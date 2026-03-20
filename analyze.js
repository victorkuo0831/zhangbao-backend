export const config = { maxDuration: 30 };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { image } = req.body;
  if (!image) return res.status(400).json({ error: '缺少圖片' });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: image,
                },
              },
              {
                type: 'text',
                text: `你是台灣發票辨識專家。請辨識這張發票並回傳 JSON，不要有其他文字。

格式如下：
{
  "vendor": "賣方名稱",
  "invoiceNo": "發票號碼（格式如 AB-12345678）",
  "date": "日期（格式 YYYY/MM/DD）",
  "total": 總金額數字,
  "tax": 稅額數字,
  "confidence": 辨識信心度0-100,
  "items": [
    {
      "name": "品項名稱",
      "amount": 金額數字,
      "category": "費用分類（從以下選一：辦公費用、餐飲費、交通費、設備耗材、訓練費用、水電雜費、廣告費、其他）"
    }
  ]
}

如果看不清楚某欄位，用合理的預設值填入。`,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    const text = data.content[0].text;

    const clean = text.replace(/```json|```/g, '').trim();
    const invoice = JSON.parse(clean);

    return res.status(200).json(invoice);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: '辨識失敗，請重試' });
  }
}
