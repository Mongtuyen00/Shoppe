export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  // 🔑 Affiliate ID của bạn (giữ cố định)
  const AFFILIATE_ID = "17355620333";

  try {
    // Biến link gốc thành object URL
    const originalUrl = new URL(url);

    // ⚡ Xóa hết query string cũ (cho sạch)
    originalUrl.search = "";

    // ✅ Chỉ gắn affiliate id (Shopee sẽ tự đưa về campaign mặc định)
    const affiliateLink = `${originalUrl.toString()}?utm_source=an_${AFFILIATE_ID}&utm_medium=affiliates`;

    res.status(200).json({ affiliateLink });
  } catch (error) {
    res.status(400).json({ error: 'Invalid URL format' });
  }
}
