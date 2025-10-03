export default async function handler(req, res) {
  const shortUrl = req.query.url || (req.method === "POST" && req.body && req.body.url);
  if (!shortUrl) {
    return res.status(400).json({ error: "Thiếu URL (tham số ?url=...)" });
  }

  // Affiliate ID bạn giữ cố định
  const AFFILIATE_ID = "17355620333";

  try {
    let finalUrl = shortUrl;

    // Bước 1: thử fetch với redirect follow
    try {
      const resp = await fetch(shortUrl, { method: "GET", redirect: "follow" });
      if (resp && resp.url) finalUrl = resp.url;
    } catch (e) {
      // bỏ qua, sẽ thử fallback
    }

    // Bước 2: nếu vẫn chưa đổi, thử HEAD để đọc header location
    if (!finalUrl || finalUrl === shortUrl) {
      try {
        const head = await fetch(shortUrl, { method: "HEAD", redirect: "manual" });
        const loc = head.headers.get("location");
        if (loc) finalUrl = loc;
      } catch (e) {
        // bỏ qua 
      }
    }

    // Bước 3: nếu vẫn chưa đổi, thử GET manual, không auto follow
    if (!finalUrl || finalUrl === shortUrl) {
      try {
        const getResp = await fetch(shortUrl, { method: "GET", redirect: "manual" });
        const loc = getResp.headers.get("location");
        if (loc) finalUrl = loc;
      } catch (e) {
        // bỏ qua
      }
    }

    // Bây giờ finalUrl là link sản phẩm gốc (nếu resolve được)
    const u = new URL(finalUrl);
    u.search = "";  // xóa query cũ

    // Gắn affiliate id
    const affiliate = `${u.toString()}?utm_source=an_${AFFILIATE_ID}&utm_medium=affiliates`;

    return res.status(200).json({ affiliate });
  } catch (err) {
    return res.status(500).json({ error: "Lỗi khi xử lý link", detail: String(err) });
  }
}
