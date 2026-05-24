describe('Kịch bản Automation Test: Đăng nhập User qua Modal', () => {
  
  it('TEST CASE 1: Hiển thị lỗi khi nhập sai tài khoản', () => {
    // 1. Máy tự động mở trang chủ
    cy.visit('/') 
    
    // 2. Click vào icon/nút Đăng nhập trên thanh Header để mở Modal
    // Dựa vào code Header.jsx, nút có title="Đăng nhập"
    cy.get('button[title="Đăng nhập"]').click()
    
    // 3. Đợi Modal hiện ra, tìm ô Tên đăng nhập và gõ
    cy.get('input[placeholder="Nhập tài khoản hoặc email"]').type('taikhoansai')
    
    // 4. Tìm ô Password và gõ mật khẩu
    cy.get('input[placeholder="Nhập mật khẩu"]').type('123456')
    
    // 5. Bấm nút Submit (ĐĂNG NHẬP) trong Form
    // Dùng class cụ thể của nút đăng nhập để không bị trùng với nút Đăng ký ở dưới Footer
    cy.get('.auth-submit-btn').click()
    
    // 6. Kiểm tra xem có hiện lên cái Toast báo lỗi không
    // Các thư viện Toast (như react-toastify) đôi khi render popup ở ngoài root DOM
    // Nên mình dùng cách tìm kiếm rộng hơn (tìm chữ "Invalid" trong toàn bộ trang web)
    cy.get('body').should('contain.text', 'Invalid username') 
  })
})
