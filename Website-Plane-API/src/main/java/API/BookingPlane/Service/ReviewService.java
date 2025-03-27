package API.BookingPlane.Service;

import API.BookingPlane.Model.Product;
import API.BookingPlane.Model.Review;
import API.BookingPlane.Repository.ProductRepository;
import API.BookingPlane.Repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductService productService;
    private final ProductRepository productRepository;
    public List<Review> getAllReviewsByProductId(Long productId) {
        return reviewRepository.findByProductId(productId);
    }

    public Review createReview(Long productId, Review review) {
        // Lấy sản phẩm từ ProductService
        Product product = productService.getProductById(productId);

        // Gắn sản phẩm vào đánh giá
        review.setProduct(product);
        review.setReviewDate(LocalDateTime.now());

        // Lưu đánh giá mới vào cơ sở dữ liệu
        Review savedReview = reviewRepository.save(review);

        // Cập nhật điểm trung bình và tổng số bình luận của sản phẩm
        updateProductReviewStats(productId);

        return savedReview;
    }

    public void updateProductReviewStats(Long productId) {
        Product product = productService.getProductById(productId);

        // Lấy tất cả đánh giá của sản phẩm
        List<Review> reviews = reviewRepository.findByProductId(productId);

        // Tính tổng điểm đánh giá và trung bình
        double averageRating = reviews.stream()
                .mapToDouble(Review::getRating)
                .average()
                .orElse(0.0);

        // Tính tổng số bình luận
        int totalReviews = reviews.size();

        // Cập nhật lại sản phẩm
        product.setRating(averageRating);
        product.setTotalReviews(totalReviews);
        productRepository.save(product);
    }

    public void deleteReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found with ID: " + id));
        reviewRepository.delete(review);
    }
}

