package com.example.vgashop.controler;

import com.example.vgashop.entity.Blog;
import com.example.vgashop.repository.BlogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blogs")
public class BlogController {

    @Autowired
    private BlogRepository blogRepository;

    @GetMapping
    public ResponseEntity<List<Blog>> getAllBlogs() {
        // Sắp xếp theo thứ tự ưu tiên (displayOrder) sau đó mới đến ID
        return ResponseEntity.ok(blogRepository.findByDeletedFalse(Sort.by(Sort.Direction.ASC, "displayOrder").and(Sort.by(Sort.Direction.ASC, "id"))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Blog> getBlogById(@PathVariable Long id) {
        Blog blog = blogRepository.findById(id).orElse(null);
        if (blog != null) {
            blog.setViews((blog.getViews() == null ? 0 : blog.getViews()) + 1);
            blogRepository.save(blog);
            return ResponseEntity.ok(blog);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/featured")
    public ResponseEntity<List<Blog>> getFeaturedBlogs() {
        return ResponseEntity.ok(blogRepository.findByFeaturedTrue());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Blog>> getBlogsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(blogRepository.findByCategory(category));
    }

    @GetMapping("/seed-fake")
    public ResponseEntity<String> seedFakeData() {
        try {
            List<Blog> blogs = blogRepository.findAll();
            String fakeContent = "[{\"type\":\"paragraph\",\"body\":\"Để kiểm chứng sức mạnh của hệ thống, chúng tôi đã đưa thiết bị vào các bài Test khắc nghiệt nhất. Từ Cyberpunk 2077 cho tới Alan Wake 2, mức FPS đổ ra đều hoàn toàn thuyết phục. Chữ mượt là không đủ để diễn tả, mà phải nói là hoàn mỹ, ngay cả ở độ phân giải 4K.\"},{\"type\":\"image\",\"url\":\"https://images.unsplash.com/photo-1587202372775-9002220d575c?q=80&w=1200&auto=format&fit=crop\",\"caption\":\"Hiệu năng tỏa sáng không tì vết nhờ các kiến trúc xử lý ray-tracing tối tân.\"},{\"type\":\"tip\",\"body\":\"Mẹo: Để đẩy mức FPS lên cao hơn nữa, đừng quên kích hoạt các công nghệ mới nhất trong cài đặt đồ họa của Game!\"},{\"type\":\"heading\",\"body\":\"Nhiệt độ và khả năng tản nhiệt\"},{\"type\":\"paragraph\",\"body\":\"Thiết kế Heatsink hầm hố đi kèm hệ thống làm mát đã giữ nhiệt độ ổn định ở ngưỡng an toàn tuyệt đối ngay cả khi hệ thống chạy full-load liên tục. Một ưu điểm cực lớn là độ ồn đã giảm thiểu tối đa, mang lại trải nghiệm êm ái.\"},{\"type\":\"heading\",\"body\":\"Cách tối ưu luồng thông gió (Air-flow) cho hệ thống của bạn\"},{\"type\":\"steps\",\"items\":[{\"step\":1,\"title\":\"Vệ sinh định kỳ\",\"desc\":\"Thường xuyên lau bụi cho các tấm lưới lọc để không khí lưu thông 100%.\"},{\"step\":2,\"title\":\"Sắp xếp dây cáp\",\"desc\":\"Thắt gọn cáp nguồn để không cản trở luồng gió mát đi từ quạt trước.\"},{\"step\":3,\"title\":\"Thiết lập áp suất\",\"desc\":\"Có lượng khí hút vào tương đương lượng khí xả ra ngoài để áp suất luôn cân bằng (Neutral Pressure).\"}]},{\"type\":\"paragraph\",\"body\":\"Tổng kết lại, đây quả thực là nội dung đánh giá chân thực nhất dành cho bạn.\"}]";
            
            for (Blog b : blogs) {
                b.setContent(fakeContent);
                blogRepository.save(b);
            }
            return ResponseEntity.ok("Seeded " + blogs.size() + " blogs.");
        } catch (Exception e) {
            return ResponseEntity.ok("ERROR THROWN: " + e.toString());
        }
    }
}
