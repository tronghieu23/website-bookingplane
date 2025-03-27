package API.BookingPlane.Service;

import API.BookingPlane.Model.Product;
import API.BookingPlane.Repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    @Autowired
    private CloudinaryService cloudinaryService;
    private final ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));
    }
    private String extractBase64String(String dataUrl) {
        return dataUrl.split(",")[1];
    }
    public Product createProduct(Product product) {
        if (product.getImage() != null && !product.getImage().isEmpty()) {
            try {
                String imageUrlString = product.getImage();
                File imageFile;

                if (imageUrlString.startsWith("data:")) {
                    String base64Image = extractBase64String(imageUrlString);
                    byte[] imageBytes = Base64.getDecoder().decode(base64Image);
                    imageFile = File.createTempFile("image", ".tmp");
                    try (FileOutputStream fos = new FileOutputStream(imageFile)) {
                        fos.write(imageBytes);
                    }
                } else {
                    URL imageUrl = new URL(imageUrlString);
                    imageFile = File.createTempFile("image", ".tmp");
                    try (InputStream in = imageUrl.openStream()) {
                        Files.copy(in, imageFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
                    }
                }

                String newImageUrl = cloudinaryService.uploadImage(imageFile);
                imageFile.delete();
                product.setImage(newImageUrl);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        if (product.getSubImages() != null && !product.getSubImages().isEmpty()) {
            List<String> uploadedSubImages = new ArrayList<>();
            for (String subImage : product.getSubImages()) {
                try {
                    File subImageFile;
                    if (subImage.startsWith("data:")) {
                        String base64Image = extractBase64String(subImage);
                        byte[] imageBytes = Base64.getDecoder().decode(base64Image);
                        subImageFile = File.createTempFile("subImage", ".tmp");
                        try (FileOutputStream fos = new FileOutputStream(subImageFile)) {
                            fos.write(imageBytes);
                        }
                    } else {
                        URL subImageUrl = new URL(subImage);
                        subImageFile = File.createTempFile("subImage", ".tmp");
                        try (InputStream in = subImageUrl.openStream()) {
                            Files.copy(in, subImageFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
                        }
                    }

                    String uploadedSubImageUrl = cloudinaryService.uploadImage(subImageFile);
                    subImageFile.delete();
                    uploadedSubImages.add(uploadedSubImageUrl);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            product.setSubImages(uploadedSubImages);
        }

        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product productDetails) {
        Product product = getProductById(id);
        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setLocation(productDetails.getLocation());
        product.setRating(productDetails.getRating());
        product.setTotalReviews(productDetails.getTotalReviews());
        product.setImage(productDetails.getImage());

        if (productDetails.getImage() != null && !productDetails.getImage().isEmpty()) {
            try {
                String imageUrlString = productDetails.getImage();
                File imageFile;
                if (imageUrlString.startsWith("data:")) {
                    String base64Image = extractBase64String(imageUrlString);
                    byte[] imageBytes = Base64.getDecoder().decode(base64Image);
                    imageFile = File.createTempFile("image", ".tmp");
                    try (FileOutputStream fos = new FileOutputStream(imageFile)) {
                        fos.write(imageBytes);
                    }
                } else {
                    URL imageUrl = new URL(imageUrlString);
                    imageFile = File.createTempFile("image", ".tmp");
                    try (InputStream in = imageUrl.openStream()) {
                        Files.copy(in, imageFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
                    }
                }
                String newImageUrl = cloudinaryService.uploadImage(imageFile);
                imageFile.delete();
                product.setImage(newImageUrl);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        if (productDetails.getSubImages() != null && !productDetails.getSubImages().isEmpty()) {
            List<String> uploadedSubImages = new ArrayList<>();
            for (String subImage : productDetails.getSubImages()) {
                try {
                    File subImageFile;
                    if (subImage.startsWith("data:")) {
                        String base64Image = extractBase64String(subImage);
                        byte[] imageBytes = Base64.getDecoder().decode(base64Image);
                        subImageFile = File.createTempFile("subImage", ".tmp");
                        try (FileOutputStream fos = new FileOutputStream(subImageFile)) {
                            fos.write(imageBytes);
                        }
                    } else {
                        URL subImageUrl = new URL(subImage);
                        subImageFile = File.createTempFile("subImage", ".tmp");
                        try (InputStream in = subImageUrl.openStream()) {
                            Files.copy(in, subImageFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
                        }
                    }
                    String uploadedSubImageUrl = cloudinaryService.uploadImage(subImageFile);
                    subImageFile.delete();
                    uploadedSubImages.add(uploadedSubImageUrl);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            product.setSubImages(uploadedSubImages);
        }

        product.setSquareFootage(productDetails.getSquareFootage());
        product.setMaxGuests(productDetails.getMaxGuests());
        product.setAmenities(productDetails.getAmenities());
        product.setIsAvailable(productDetails.getIsAvailable());
        product.setStandardCheckInTime(productDetails.getStandardCheckInTime());
        product.setStandardCheckOutTime(productDetails.getStandardCheckOutTime());
        product.setCategory(productDetails.getCategory());
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }
    public long getTotalProducts() {
        return productRepository.count(); // Sử dụng JPA Repository để đếm
    }

}

