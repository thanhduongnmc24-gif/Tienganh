/* --- BẮT ĐẦU CODE ĐIỀU HƯỚNG TRANG --- */

// Hàm này chạy khi trang đã tải xong
document.addEventListener('DOMContentLoaded', () => {
  
  // Chỉ chạy hàm lấy câu nói nếu chúng ta ở trang chủ
  // (Tránh gọi API khi không cần thiết)
  if (document.getElementById('page-home').classList.contains('active')) {
    layCauNoiCuaNgay();
  }

  // Khởi tạo logic điều hướng
  initNavigation();
});

// Hàm logic chính để chuyển trang
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const pages = document.querySelectorAll('.page');

  navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault(); // Ngăn trình duyệt nhảy (ví dụ: #page-home)

      const targetPageId = link.dataset.page; // Lấy ID trang từ data-page="page-home"

      // 1. Ẩn tất cả các trang
      pages.forEach(page => {
        page.classList.remove('active');
      });

      // 2. Tắt "active" của tất cả các nút nav
      navLinks.forEach(nav => {
        nav.classList.remove('active');
      });

      // 3. Hiện trang mục tiêu
      document.getElementById(targetPageId).classList.add('active');

      // 4. Bật "active" cho nút nav được nhấp
      link.classList.add('active');
      
      // (Tùy chọn) Gọi API nếu chúng ta vừa chuyển đến trang chủ
      if (targetPageId === 'page-home') {
        // Kiểm tra xem đã tải câu nói chưa để tránh gọi lại
        if (document.getElementById('quote-text').innerText === 'Đang tải câu nói...') {
          layCauNoiCuaNgay();
        }
      }
      
      // (Tùy chọn) Cuộn lên đầu trang khi chuyển
      window.scrollTo(0, 0);
    });
  });
}

// Sửa lại hàm cũ một chút:
// Chúng ta chỉ gọi hàm này khi cần
async function layCauNoiCuaNgay() {
  const quoteElement = document.getElementById('quote-text');
  
  // Nếu đã có nội dung, không tải lại
  if (quoteElement.innerText !== 'Đang tải câu nói...') {
    return; 
  }

  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'Hãy cho tôi một câu nói truyền cảm hứng ngắn gọn về việc học tập, bằng cả tiếng Anh và tiếng Việt.'
      }),
    });

    if (!response.ok) {
      throw new Error('Mạng không ổn định');
    }
    const data = await response.json();
    quoteElement.innerText = data.result;

  } catch (error) {
    console.error('Lỗi:', error);
    quoteElement.innerText = 'Không thể tải câu nói. Vui lòng thử lại.';
  }
}

/* --- KẾT THÚC CODE ĐIỀU HƯỚNG TRANG --- */

// (Code PWA cũ của bạn vẫn nằm ở đầu tệp này)
// if ('serviceWorker' in navigator) { ... }
