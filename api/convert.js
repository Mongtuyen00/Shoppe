// api/convert.js

export default async function handler(req, res) {
  const shortUrl = req.query.url;
  if (!shortUrl) {
    return res.status(400).json({ error: "Thiếu URL sản phẩm" });
  }

  try {
    // Gửi request đến link rút gọn, không follow redirect
    const response = await fetch(shortUrl, { redirect: "manual" });
    const location = response.headers.get("location") || shortUrl;

    // Thông tin Affiliate (đã thay sẵn của bạn)
    const AFFILIATE_ID = "an_17355620333";   // ID Affiliate
    const CAMPAIGN_ID = "id_AVJWQCBswI";     // Campaign ID

    // Gắn tham số Affiliate vào link gốc
    const sep = location.includes("?") ? "&" : "?";
    const affiliateUrl =
      location +
      `${sep}utm_source=${AFFILIATE_ID}&utm_medium=affiliates&utm_campaign=${CAMPAIGN_ID}`;

    return res.status(200).json({ affiliate: affiliateUrl });
  } catch (err) {
    return res.status(500).json({ error: "Lỗi xử lý link" });
  }
}
