/**
 * serviceData.js — Dữ liệu trang Dịch vụ & Chính sách
 * Ảnh local tại /public/images/blog/
 */
export const servicePages = [
  {
    id: 'gioi-thieu',
    label: 'Giới thiệu',
    icon: '🏢',
    title: 'Giới thiệu VGA STORE',
    description: 'Hơn một thập kỷ dẫn đầu thị trường linh kiện máy tính Hi-End',
    heroImage: '/images/blog/service-showroom.jpg',
    content: [
      {
        type: 'text',
        body: 'Hơn một thập kỷ dẫn đầu thị trường linh kiện máy tính Hi-End, VGA STORE tự hào là điểm đến tin cậy của hàng nghìn game thủ, streamer và các chuyên gia sáng tạo trên khắp Việt Nam. Chúng tôi không chỉ bán phần cứng — chúng tôi mang đến những giải pháp sức mạnh tính toán tiên tiến nhất.',
      },
      {
        type: 'heading',
        body: 'Sứ mệnh & Tầm nhìn',
      },
      {
        type: 'text',
        body: 'Cung cấp sức mạnh tính toán tối đa, giúp mọi người chinh phục mọi thử thách trong thế giới số. Trở thành hệ thống bán lẻ công nghệ số 1 Đông Nam Á.',
      },
      {
        type: 'heading',
        body: 'Sức mạnh lõi — Đội ngũ & Dịch vụ',
      },
      {
        type: 'features',
        items: [
          { icon: '⚡', title: 'Kỹ thuật Hi-End', desc: 'Đội ngũ chuyên gia dày dặn kinh nghiệm lắp ráp PC, custom watercooling và build máy trạm render.' },
          { icon: '🤝', title: 'Hợp tác Chính hãng', desc: 'Đối tác chính thức của NVIDIA, AMD, ASUS, MSI, Gigabyte — đảm bảo chính sách hỗ trợ tốt nhất.' },
          { icon: '🎯', title: 'Tư vấn Cá nhân hóa', desc: 'Cung cấp giải pháp PC tối ưu cho từng nhu cầu từ chơi game đến máy trạm render chuyên nghiệp.' },
        ],
      },
      {
        type: 'heading',
        body: 'Giá trị cốt lõi',
      },
      {
        type: 'list',
        items: [
          'TẬN TÂM: Coi khách hàng là trọng tâm, luôn lắng nghe và đáp ứng vượt mong đợi.',
          'CHUYÊN NGHIỆP: Quy trình làm việc rõ ràng, nhanh chóng và chính xác.',
          'TỐC ĐỘ: Phản hồi và xử lý dịch vụ cực nhanh, không để khách hàng chờ đợi.',
        ],
      },
    ],
  },
  {
    id: 'he-thong-cua-hang',
    label: 'Hệ thống cửa hàng',
    icon: '📍',
    title: 'Hệ thống Showroom VGA STORE',
    description: 'Mở cửa 08:00 – 21:00 tất cả các ngày trong tuần',
    heroImage: '/images/blog/service-showroom.jpg',
    content: [
      {
        type: 'text',
        body: 'Chúng tôi luôn mở cửa từ 08:00 đến 21:00 tất cả các ngày trong tuần (kể cả Lễ, Tết). Đội ngũ kỹ thuật viên và tư vấn viên luôn sẵn sàng hỗ trợ quý khách.',
      },
      {
        type: 'stores',
        items: [
          {
            name: 'Showroom Trụ sở — Hà Nội',
            address: '123 Thái Hà, Phường Trung Liệt, Quận Đống Đa, TP. Hà Nội',
            phone: '1900.5301 (Nhánh 1)',
            hours: '08:00 - 21:00 hàng ngày',
          },
          {
            name: 'Showroom Trung tâm — TP.HCM',
            address: '456 Cách Mạng Tháng 8, Phường 11, Quận 3, TP. Hồ Chí Minh',
            phone: '1900.5301 (Nhánh 2)',
            hours: '08:00 - 21:00 hàng ngày',
          },
        ],
      },
    ],
  },
  {
    id: 'thu-cu-doi-moi',
    label: 'Thu cũ đổi mới',
    icon: '🔄',
    title: 'Chương trình: Thu Cũ Đổi Mới (Trade-in)',
    description: 'Trợ giá thu cũ đổi mới lên đến 15%',
    content: [
      {
        type: 'text',
        body: 'Nâng cấp bộ máy của bạn dễ dàng hơn bao giờ hết với chương trình trợ giá thu cũ đổi mới lên đến 15%. Áp dụng cho tất cả các dòng Card màn hình và linh kiện PC.',
      },
      {
        type: 'table',
        headers: ['Tình trạng sản phẩm', 'Mức giá thu lại (So với giá thị trường)'],
        rows: [
          ['Hàng Fullbox, còn bảo hành hãng > 12 tháng', 'Thu lại 80% - 85%'],
          ['Hàng No-box, còn bảo hành hãng < 12 tháng', 'Thu lại 70% - 75%'],
          ['Hàng hết bảo hành, hình thức đẹp, hoạt động tốt', 'Thu lại 50% - 60%'],
          ['Hàng lỗi nhẹ (nóng, rỉ sét tản nhiệt)', 'Thương lượng trực tiếp sau khi test'],
        ],
      },
      {
        type: 'note',
        body: 'Lưu ý: Giá trên chỉ mang tính chất tham khảo. Kỹ thuật viên sẽ kiểm tra thực tế (Furmark test) trước khi báo giá cuối cùng.',
      },
    ],
  },
  {
    id: 'ho-tro-ky-thuat',
    label: 'Hỗ trợ kỹ thuật tận nơi',
    icon: '🔧',
    title: 'Dịch vụ kỹ thuật tại nhà',
    description: 'Hợp tác với ALD Service — lắp ráp & bảo trì tại nhà',
    heroImage: '/images/blog/service-tech-repair.jpg',
    content: [
      {
        type: 'text',
        body: 'VGA STORE hợp tác với ALD Service cung cấp dịch vụ lắp ráp và bảo trì máy tính ngay tại nhà bạn với chi phí tối ưu nhất.',
      },
      {
        type: 'priceBox',
        title: 'COMBO LẮP ĐẶT — 449.000đ',
        subtitle: 'Dành cho khách hàng đang có linh kiện cần lắp ráp PC mới tại nhà!',
        items: [
          'Kiểm tra tình trạng linh kiện tương thích.',
          'Lắp ráp & đi dây cable management chuyên nghiệp trong PC.',
          'Cài đặt Windows và các phần mềm, driver cơ bản.',
        ],
        note: 'Bảo hành: 7 ngày kể từ khi hoàn tất dịch vụ.',
      },
    ],
  },
  {
    id: 'tra-cuu-bao-hanh',
    label: 'Tra cứu bảo hành',
    icon: '🔍',
    title: 'Tra cứu thông tin & Tình trạng bảo hành',
    description: 'Nhập SĐT hoặc S/N để kiểm tra tình trạng bảo hành',
    content: [
      {
        type: 'text',
        body: 'Quý khách vui lòng nhập chính xác Số điện thoại mua hàng hoặc Mã Serial Number (S/N) trên sản phẩm để kiểm tra tình trạng bảo hành.',
      },
      {
        type: 'warrantyForm',
      },
    ],
  },
  {
    id: 'chinh-sach-giao-hang',
    label: 'Chính sách giao hàng',
    icon: '🚚',
    title: 'Chính sách & Thời gian giao hàng',
    description: 'Giao hàng nhanh nội thành trong 2 giờ',
    content: [
      {
        type: 'table',
        headers: ['Khu vực giao hàng', 'Phương thức', 'Thời gian dự kiến', 'Phí giao hàng'],
        rows: [
          ['Nội thành HN & TP.HCM', 'Giao hỏa tốc (Grab/Ahamove)', 'Trong vòng 2 giờ', 'Miễn phí (Đơn > 5tr)'],
          ['Ngoại thành HN & TP.HCM', 'Giao xe tải / CPN', 'Trong ngày', '20.000đ - 50.000đ'],
          ['Các tỉnh thành khác', 'Chuyển phát GHTK / Viettel Post', '2 - 4 ngày làm việc', 'Theo cước bưu điện'],
        ],
      },
    ],
  },
  {
    id: 'chinh-sach-bao-hanh',
    label: 'Chính sách bảo hành',
    icon: '🛡️',
    title: 'Chính sách bảo hành sản phẩm',
    description: 'Đổi mới 100% trong 7 ngày nếu lỗi nhà sản xuất',
    content: [
      {
        type: 'heading',
        body: 'Điều kiện bảo hành',
      },
      {
        type: 'list',
        items: [
          'Sản phẩm còn trong thời hạn bảo hành được tính kể từ ngày giao hàng.',
          'Tem bảo hành của VGA STORE và tem của nhà phân phối phải còn nguyên vẹn.',
          'Số Serial/IMEI trên sản phẩm phải trùng khớp với trên hệ thống.',
        ],
      },
      {
        type: 'heading',
        body: 'Các trường hợp TỪ CHỐI bảo hành',
      },
      {
        type: 'list',
        items: [
          'Sản phẩm bị can thiệp phần cứng (tự ý tháo ốc, độ chế tản nhiệt).',
          'Sản phẩm bị hư hỏng do tác động cơ học (rơi vỡ, móp méo, trầy xước sâu).',
          'Sản phẩm bị cháy nổ do nguồn điện không ổn định hoặc côn trùng xâm nhập.',
        ],
      },
      {
        type: 'note',
        body: 'Cam kết: Đổi mới 100% trong vòng 7 ngày đầu tiên nếu sản phẩm phát sinh lỗi phần cứng từ nhà sản xuất.',
      },
    ],
  },
  {
    id: 'thanh-toan',
    label: 'Thanh toán',
    icon: '💳',
    title: 'Hướng dẫn thanh toán',
    description: 'Thanh toán tiền mặt, chuyển khoản, COD',
    content: [
      {
        type: 'text',
        body: 'VGA STORE cung cấp các phương thức thanh toán an toàn, bảo mật và tiện lợi nhất cho khách hàng.',
      },
      {
        type: 'heading',
        body: '1. Thanh toán tiền mặt / Quẹt thẻ',
      },
      {
        type: 'list',
        items: [
          'Thanh toán trực tiếp bằng tiền mặt tại các quầy thu ngân của hệ thống Showroom.',
          'Hỗ trợ quẹt thẻ nội địa (ATM) và thẻ quốc tế (Visa, Mastercard, JCB) miễn phí quẹt thẻ.',
        ],
      },
      {
        type: 'heading',
        body: '2. Chuyển khoản ngân hàng (Internet Banking)',
      },
      {
        type: 'list',
        items: [
          'Cú pháp chuyển khoản: [Mã đơn hàng] - [Số điện thoại]',
          'Ngân hàng Vietcombank - STK: 0123456789 - Chủ TK: CÔNG TY TNHH VGA STORE',
          'Hệ thống sẽ tự động xác nhận đơn hàng sau 2-5 phút kể từ khi nhận được thanh toán.',
        ],
      },
      {
        type: 'heading',
        body: '3. Thanh toán khi nhận hàng (COD)',
      },
      {
        type: 'text',
        body: 'Áp dụng cho các đơn hàng có giá trị dưới 20.000.000 VNĐ. Quý khách được quyền kiểm tra tình trạng ngoại quan của sản phẩm trước khi thanh toán cho nhân viên giao hàng.',
      },
    ],
  },
  {
    id: 'tra-gop',
    label: 'Mua hàng trả góp',
    icon: '📊',
    title: 'Chính sách Mua hàng Trả góp 0%',
    description: 'Trả góp 0% qua thẻ tín dụng & công ty tài chính',
    content: [
      {
        type: 'text',
        body: 'Sở hữu ngay bộ máy tính mơ ước mà không cần lo lắng về tài chính với chính sách trả góp siêu ưu đãi.',
      },
      {
        type: 'heading',
        body: '1. Trả góp qua Thẻ tín dụng (Visa/Mastercard)',
      },
      {
        type: 'list',
        items: [
          'Lãi suất 0%: Hỗ trợ hơn 25 ngân hàng lớn (Sacombank, Techcombank, VPBank, VIB...).',
          'Kỳ hạn linh hoạt: Lựa chọn trả góp trong 3, 6, 9, hoặc 12 tháng.',
          'Thủ tục: Không cần duyệt hồ sơ, chỉ cần thẻ tín dụng còn đủ hạn mức.',
        ],
      },
      {
        type: 'heading',
        body: '2. Trả góp qua Công ty tài chính',
      },
      {
        type: 'list',
        items: [
          'Thủ tục đơn giản: Chỉ cần CCCD gắn chip.',
          'Duyệt siêu tốc: Nhận kết quả chỉ trong 15 - 30 phút tại Showroom.',
          'Trả trước linh hoạt: Chỉ từ 10% - 30% giá trị sản phẩm.',
        ],
      },
    ],
  },
  {
    id: 'huong-dan-mua-hang',
    label: 'Hướng dẫn mua hàng',
    icon: '📋',
    title: 'Hướng dẫn Đặt hàng Trực tuyến',
    description: 'Chốt đơn chỉ trong 4 bước đơn giản',
    content: [
      {
        type: 'text',
        body: 'Quy trình mua hàng trên website VGA STORE được thiết kế tối giản, giúp bạn chốt đơn chỉ trong 4 bước:',
      },
      {
        type: 'steps',
        items: [
          { step: 1, title: 'Tìm kiếm', desc: 'Sử dụng thanh tìm kiếm hoặc duyệt qua Menu danh mục để tìm sản phẩm mong muốn.' },
          { step: 2, title: 'Thêm vào giỏ', desc: 'Xem chi tiết cấu hình, chọn số lượng và nhấn nút "THÊM VÀO GIỎ" hoặc "MUA NGAY".' },
          { step: 3, title: 'Nhập thông tin', desc: 'Điền đầy đủ thông tin giao hàng (Tên, SĐT, Địa chỉ). Bạn có thể đăng nhập để tích điểm.' },
          { step: 4, title: 'Thanh toán', desc: 'Chọn phương thức thanh toán và nhấn "XÁC NHẬN ĐƠN HÀNG".' },
        ],
      },
      {
        type: 'note',
        body: 'Trong vòng 30 phút sau khi đặt hàng (giờ hành chính), tổng đài viên sẽ gọi điện để xác nhận thời gian giao hàng với bạn.',
      },
    ],
  },
  {
    id: 'bao-mat',
    label: 'Chính sách bảo mật',
    icon: '🔒',
    title: 'Chính sách Bảo mật Thông tin',
    description: 'Cam kết bảo vệ dữ liệu cá nhân theo NĐ 13/2023',
    content: [
      {
        type: 'text',
        body: 'Sự riêng tư của khách hàng là ưu tiên hàng đầu tại VGA STORE. Chúng tôi cam kết bảo vệ dữ liệu cá nhân tuân thủ theo Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.',
      },
      {
        type: 'heading',
        body: 'Mục đích thu thập dữ liệu',
      },
      {
        type: 'list',
        items: [
          'Xử lý và giao đơn hàng chính xác đến địa chỉ của bạn.',
          'Lưu trữ thông tin để phục vụ công tác tra cứu bảo hành điện tử.',
          'Gửi email/SMS thông báo trạng thái đơn hàng hoặc khuyến mãi (nếu bạn cho phép).',
        ],
      },
      {
        type: 'heading',
        body: 'Cam kết bảo mật',
      },
      {
        type: 'text',
        body: 'Chúng tôi TUYỆT ĐỐI KHÔNG bán, chia sẻ hoặc trao đổi thông tin cá nhân của khách hàng cho bất kỳ bên thứ 3 nào vì mục đích thương mại. Dữ liệu thanh toán thẻ được mã hóa qua cổng thanh toán quốc tế chuẩn PCI DSS.',
      },
    ],
  },
  {
    id: 'dieu-khoan',
    label: 'Điều khoản dịch vụ',
    icon: '📄',
    title: 'Điều khoản Dịch vụ chung',
    description: 'Điều khoản sử dụng website',
    content: [
      {
        type: 'text',
        body: 'Bằng việc truy cập và sử dụng website vgastore.com, quý khách mặc nhiên đồng ý với các điều khoản dưới đây:',
      },
      {
        type: 'list',
        items: [
          'Bản quyền nội dung: Mọi hình ảnh, bài viết trên website đều thuộc bản quyền VGA STORE.',
          'Giá cả và thông tin: VGA STORE có quyền từ chối hoặc hủy đơn hàng có giá sai lệch do lỗi hệ thống.',
          'Hành vi gian lận: VGA STORE bảo lưu quyền khóa tài khoản đối với hành vi bom hàng, spam hệ thống.',
        ],
      },
    ],
  },
  {
    id: 've-sinh-pc',
    label: 'Vệ sinh PC miễn phí',
    icon: '✨',
    title: 'Đặc quyền: Vệ sinh PC miễn phí trọn đời',
    description: 'Áp dụng cho khách mua PC/VGA tại VGA STORE',
    content: [
      {
        type: 'text',
        body: 'Khách hàng mua PC nguyên bộ hoặc Card màn hình tại VGA STORE sẽ được hưởng đặc quyền vệ sinh phần cứng hoàn toàn MIỄN PHÍ trọn đời.',
      },
      {
        type: 'heading',
        body: 'Quy trình vệ sinh tiêu chuẩn',
      },
      {
        type: 'steps',
        items: [
          { step: 1, title: 'Tiếp nhận', desc: 'Tiếp nhận máy, test nhiệt độ và hiệu năng ban đầu.' },
          { step: 2, title: 'Hút bụi', desc: 'Hút bụi, thổi bụi các linh kiện bằng máy nén khí chuyên dụng.' },
          { step: 3, title: 'Vệ sinh chi tiết', desc: 'Vệ sinh cánh quạt, khe tản nhiệt bằng cọ mềm và dung dịch.' },
          { step: 4, title: 'Tra keo', desc: 'Tra lại keo tản nhiệt hiệu năng cao (Arctic MX-4 / MX-6).' },
          { step: 5, title: 'Hoàn tất', desc: 'Lắp ráp, đi lại dây cáp gọn gàng và test lại nhiệt độ.' },
        ],
      },
      {
        type: 'note',
        body: 'Khách hàng vui lòng mang máy trực tiếp tới hệ thống Showroom. Thời gian xử lý dự kiến: 45 - 60 phút.',
      },
    ],
  },
];
