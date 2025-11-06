// HÀM CŨ SẼ BỊ THAY THẾ BẰNG HÀM NÀY
async function layCauNoiCuaNgay() {
  const quoteElement = document.getElementById('quote-text');
  
  // Lấy thẻ <p> bên trong
  const loadingText = quoteElement.querySelector('.loading-text');

  // Nếu không còn thẻ loading (đã tải rồi) thì không làm gì cả
  if (!loadingText) {
    return;
  }

  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'Hãy cho tôi 3 câu nói truyền cảm hứng ngắn gọn về việc học tập, bằng cả tiếng Anh và tiếng Việt. Định dạng câu trả lời bằng Markdown.'
      }),
    });

    if (!response.ok) {
      throw new Error('Mạng không ổn định');
    }
    const data = await response.json();
    
    // *** NÂNG CẤP MỚI: Xử lý Markdown đơn giản ***
    let htmlResult = data.result;
    
    // Thay thế **Chữ in đậm** thành <strong>Chữ in đậm</strong>
    htmlResult = htmlResult.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Thay thế các dòng bắt đầu bằng * (hoặc ***) thành <p>• ...</p>
    htmlResult = htmlResult.split('\n').map(line => {
      if (line.trim().startsWith('*')) {
        // Bỏ các dấu * ở đầu và thêm dấu chấm
        return '<p>• ' + line.replace(/[\* ]+/,'') + '</p>';
      }
      // Giữ nguyên các dòng khác (ví dụ: "Tuyệt vời...")
      return '<p>' + line + '</p>';
    }).join(''); // Nối các dòng lại

    // Hiển thị kết quả
    quoteElement.innerHTML = htmlResult;

  } catch (error) {
    console.error('Lỗi:', error);
    loadingText.innerText = 'Không thể tải câu nói. Vui lòng thử lại.';
  }
}
