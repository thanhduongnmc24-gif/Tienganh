// 1. Đăng ký Service Worker (cho PWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker đã đăng ký:', registration);
      })
      .catch(error => {
        console.log('Đăng ký ServiceWorker thất bại:', error);
      });
  });
}

// 2. Gọi API Gemini để lấy "Câu nói của ngày"
document.addEventListener('DOMContentLoaded', () => {
  layCauNoiCuaNgay();
});

async function layCauNoiCuaNgay() {
  const quoteElement = document.getElementById('quote-text');
  
  try {
    // 1. Gửi yêu cầu tới backend (server.js) của chúng ta
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // 2. Đây là prompt chúng ta gửi cho Gemini
      body: JSON.stringify({ 
        prompt: 'Hãy cho tôi một câu nói truyền cảm hứng ngắn gọn về việc học tập, bằng cả tiếng Anh và tiếng Việt.' 
      }),
    });

    if (!response.ok) {
      throw new Error('Mạng không ổn định');
    }

    // 3. Nhận kết quả từ backend
    const data = await response.json();
    
    // 4. Hiển thị lên màn hình
    quoteElement.innerText = data.result;

  } catch (error) {
    console.error('Lỗi:', error);
    quoteElement.innerText = 'Không thể tải câu nói. Vui lòng thử lại.';
  }
}
