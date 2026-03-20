const express = require('express');
const app = express();
app.use(express.json({ limit: '10mb' }));

app.options('/api/analyze', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.status(200).end();
});

app.post('/api/analyze', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
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
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: image } },
            { type: 'text', text: `你是台灣發票辨識專家。請辨識這張發票並回傳 JSON，不要有其他文字。格式：{"vendor":"賣方","invoiceNo":"號碼","date":"YYYY/MM/DD","total":金額,"tax":稅額,"confidence":信心度,"items":[{"name":"品項","amount":金額,"category":"分類"}]}` },
          ],
        }],
      }),
    });
    const data = await response.json();
    const text = data.content[0].text;
    const clean = text.replace(/```json|```/g, '').trim();
    return res.status(200).json(JSON.parse(clean));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: '辨識失敗' });
  }
});

app.listen(process.env.PORT || 3000, () => console.log('Server running'));
