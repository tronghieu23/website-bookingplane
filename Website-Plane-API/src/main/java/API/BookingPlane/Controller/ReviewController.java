package API.BookingPlane.Controller;

import API.BookingPlane.Model.Review;
import API.BookingPlane.Service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products/{productId}/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping
    public List<Review> getAllReviews(@PathVariable Long productId) {
        return reviewService.getAllReviewsByProductId(productId);
    }

    @PostMapping
    public Review createReview(@PathVariable Long productId, @RequestBody Review review) {
        return reviewService.createReview(productId, review);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }
}
