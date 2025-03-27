package API.BookingPlane.Controller;

import API.BookingPlane.Model.CartItem;
import API.BookingPlane.Service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    // Lấy danh sách giỏ hàng của khách hàng theo accountId
    @GetMapping("account/{accountId}")
    public ResponseEntity<List<CartItem>> listCartItems(@PathVariable UUID accountId) {
        List<CartItem> cartItems = cartService.listCartItems(accountId);
        return ResponseEntity.ok(cartItems);
    }

    // Thêm sản phẩm vào giỏ hàng
    @PostMapping("/create")
    public ResponseEntity<CartItem> addItemToCart(
            @RequestParam Long productId,
            @RequestParam UUID accountId,
            @RequestParam LocalDate checkInDate,
            @RequestParam LocalDate checkOutDate
    ) {
        CartItem cartItem = cartService.addItemToCart(productId, accountId, checkInDate, checkOutDate);
        return ResponseEntity.ok(cartItem);
    }

    // Cập nhật ngày check-in và check-out của sản phẩm trong giỏ hàng
    @PutMapping("/{cartItemId}")
    public ResponseEntity<CartItem> updateCartItem(
            @PathVariable Long cartItemId,
            @RequestParam LocalDate checkInDate,
            @RequestParam LocalDate checkOutDate
    ) {
        CartItem updatedCartItem = cartService.updateCartItem(cartItemId, checkInDate, checkOutDate);
        return ResponseEntity.ok(updatedCartItem);
    }

    // Xóa sản phẩm khỏi giỏ hàng
    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<Void> deleteCartItem(@PathVariable Long cartItemId) {
        cartService.deleteCartItem(cartItemId);
        return ResponseEntity.noContent().build();
    }
}
