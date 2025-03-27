package API.BookingPlane.Service;

import API.BookingPlane.Model.Account;
import API.BookingPlane.Model.CartItem;
import API.BookingPlane.Model.Product;
import API.BookingPlane.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private AccountRepository accountRepository;

    // Thêm sản phẩm vào giỏ hàng
    public CartItem addItemToCart(Long productId, UUID accountId, LocalDate checkInDate, LocalDate checkOutDate) {
        Optional<Product> productOpt = productRepository.findById(productId);
        Optional<Account> accountOpt = accountRepository.findById(accountId);

        if (productOpt.isPresent() && accountOpt.isPresent()) {
            Product product = productOpt.get();
            Account account = accountOpt.get();

            // Kiểm tra xem sản phẩm đã có trong giỏ hàng của tài khoản này chưa
            Optional<CartItem> existingCartItemOpt = cartItemRepository.findByProductAndAccount(product, account);

            if (existingCartItemOpt.isPresent()) {
                // Nếu sản phẩm đã có trong giỏ hàng, cập nhật ngày
                CartItem existingCartItem = existingCartItemOpt.get();

                // Cập nhật checkInDate và checkOutDate (nếu cần thiết)
                if (!existingCartItem.getCheckInDate().equals(checkInDate) || !existingCartItem.getCheckOutDate().equals(checkOutDate)) {
                    existingCartItem.setCheckInDate(checkInDate);
                    existingCartItem.setCheckOutDate(checkOutDate);
                    existingCartItem.setNight(existingCartItem.calculateNights()); // Cập nhật số đêm mới
                    return cartItemRepository.save(existingCartItem);
                } else {
                    // Nếu ngày không thay đổi, thông báo cho người dùng rằng giỏ hàng không cần cập nhật
                    throw new RuntimeException("Sản phẩm đã tồn tại trong giỏ hàng với ngày giống nhau.");
                }
            } else {
                // Nếu chưa có, thêm mới vào giỏ hàng
                CartItem cartItem = new CartItem(product, account, checkInDate, checkOutDate);
                cartItem.setNight(cartItem.calculateNights());
                return cartItemRepository.save(cartItem);
            }
        } else {
            throw new RuntimeException("Product or Account not found.");
        }
    }


    // Danh sách sản phẩm giỏ hàng của khách hàng
    public List<CartItem> listCartItems(UUID accountId) {
        Optional<Account> accountOpt = accountRepository.findById(accountId);
        if (accountOpt.isPresent()) {
            return cartItemRepository.findByAccount_Id(accountId);
        } else {
            throw new RuntimeException("Account not found.");
        }
    }

    // Cập nhật ngày check-in và check-out của sản phẩm trong giỏ hàng
    public CartItem updateCartItem(Long cartItemId, LocalDate checkInDate, LocalDate checkOutDate) {
        Optional<CartItem> cartItemOpt = cartItemRepository.findById(cartItemId);
        if (cartItemOpt.isPresent()) {
            CartItem cartItem = cartItemOpt.get();

            // Cập nhật ngày check-in và check-out
            cartItem.setCheckInDate(checkInDate);
            cartItem.setCheckOutDate(checkOutDate);

            // Tính lại số đêm và giá
            cartItem.setNight(cartItem.calculateNights()); // Cập nhật số đêm
            cartItem.setPrice(cartItem.calculatePrice()); // Cập nhật giá dựa trên số đêm

            // Lưu lại CartItem với thông tin đã cập nhật
            return cartItemRepository.save(cartItem);
        } else {
            throw new RuntimeException("Cart item not found with id: " + cartItemId);
        }
    }


    // Xóa sản phẩm khỏi giỏ hàng
    public void deleteCartItem(Long cartItemId) {
        if (!cartItemRepository.existsById(cartItemId)) {
            throw new RuntimeException("Sản phẩm trong giỏ hàng không tồn tại.");
        }
        cartItemRepository.deleteById(cartItemId);
    }

    public void removeItemsFromCart(UUID accountId, List<Long> productIds) {
        cartItemRepository.deleteByAccountIdAndProductIds(accountId, productIds);
    }
}
