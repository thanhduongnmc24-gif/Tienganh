// Nạp các thư viện cần thiết
require('dotenv').config(); // Để đọc khóa API từ biến môi trường
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Khởi tạo app Express
const app = express();
const port = process.env.PORT || 3000;

// Khởi tạo Gemini
// KIỂM TRA LƯU Ý BÊN DƯỚI VỀ TÊN MODEL NÀY
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 1. Phục vụ các tệp tĩnh (frontend PWA)
// Bất cứ thứ gì trong thư mục 'public' đều có thể truy cập qua web
app.use(express.static('public'));

// 2. Cho phép máy chủ nhận dữ liệu JSON (để nhận prompt)
app.use(express.json());

// 3. Tạo một đường dẫn API để gọi Gemini
app.post('/api/gemini', async (req, res) => {
  try {
    // Lấy prompt (câu lệnh) từ yêu cầu của frontend
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Vui lòng cung cấp prompt.' });
    }

    // Gọi model Gemini theo yêu cầu của bạn
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Trả kết quả về cho frontend
    res.json({ result: text });

  } catch (error) {
    console.error('Lỗi khi gọi Gemini API:', error);
    res.status(500).json({ error: 'Có lỗi xảy ra trên máy chủ.' });
  }
});

// Khởi động máy chủ
app.listen(port, () => {
  console.log(`Máy chủ đang chạy tại http://localhost:${port}`);
});
