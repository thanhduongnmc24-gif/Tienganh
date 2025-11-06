// --- BẮT ĐẦU CODE PWA (SERVICE WORKER) ---
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
// --- KẾT THÚC CODE PWA ---


// --- BẮT ĐẦU CODE ĐIỀU HƯỚNG TRANG ---
document.addEventListener('DOMContentLoaded', () => {
  // Tải câu nói ngay khi mở app (nếu ở trang chủ)
  if (document.getElementById('page-home').classList.contains('active')) {
    layCauNoiCuaNgay();
  }
  // Khởi tạo các nút nav
  initNavigation();
});

function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const pages = document.querySelectorAll('.page');

  navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault(); 
      const targetPageId = link.dataset.page;
      
      // Ẩn/hiện trang
      pages.forEach(page => page.classList.remove('active'));
      navLinks.forEach(nav => nav.classList.remove('active'));

      document.getElementById(targetPageId).classList.add('active');
      link.classList.add('active');
      
      // Chỉ gọi API nếu chuyển đến trang chủ
      if (targetPageId === 'page-home') {
        // Hàm layCauNoiCuaNgay() có sẵn logic để không tải lại nếu đã có
        layCauNoiCuaNgay(); 
      }
      
      window.scrollTo(0, 0);
    });
  });
}
// --- KẾT THÚC CODE ĐIỀU HƯỚNG TRANG ---


// --- BẮT ĐẦU CODE GỌI GEMINI (TẢI NGẦM) ---
async function layCauNoiCuaNgay() {
  const quoteElement = document.getElementById('quote-text');
  const loadingText = quoteElement.querySelector('.loading-text');

  // 1. Nếu không có chữ "Đang tải..." (tức là đã tải xong), thì không làm gì cả.
  if (!loadingText) {
    return; 
  }

  // 2. Nếu đang tải, vẫn chạy yêu cầu fetch
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'Hãy cho tôi 3 câu nói truyền cảm hứng ngắn gọn về việc học tập, bằng cả tiếng Anh và tiếng Việt. Định dạng câu trả lời bằng Markdown.'
      }),
      // Đã gỡ bỏ 'signal' để cho phép tải ngầm
    });

    if (!response.ok) {
      throw new Error('Mạng không ổn định');
    }
    const data = await response.json();
    
    // Xử lý Markdown đơn giản
    let htmlResult = data.result;
    htmlResult = htmlResult.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    htmlResult = htmlResult.split('\n').map(line => {
      if (line.trim().startsWith('*')) {
        return '<p>• ' + line.replace(/[\* ]+/,'') + '</p>';
      }
      return '<p>'s + line + '</p>';
    }).join('');

    quoteElement.innerHTML = htmlResult;

  } catch (error) {
    // Chỉ xử lý lỗi chung, vì không còn 'AbortError'
    console.error('Lỗi:', error);
    // Chỉ cập nhật text nếu nó vẫn đang ở trạng thái loading
    const currentLoadingText = quoteElement.querySelector('.loading-text');
    if (currentLoadingText) {
      currentLoadingText.innerText = 'Không thể tải câu nói. Vui lòng thử lại.';
    }
  }
}
// --- KẾT THÚC CODE GỌI GEMINI ---
