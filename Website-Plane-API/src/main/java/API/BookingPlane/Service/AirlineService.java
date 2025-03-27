package API.BookingPlane.Service;

import API.BookingPlane.Model.Airline;
import API.BookingPlane.Repository.AirlineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class AirlineService {
    @Autowired
    private CloudinaryService cloudinaryService;
    private final AirlineRepository airlineRepository;

    public AirlineService(AirlineRepository airlineRepository) {
        this.airlineRepository = airlineRepository;
    }

    // Lấy tất cả các hãng hàng không
    public List<Airline> getAllAirlines() {
        return airlineRepository.findAll();
    }

    // Lấy hãng hàng không theo ID
    public Optional<Airline> getAirlineById(Long id) {
        return airlineRepository.findById(id);
    }

    private String extractBase64String(String dataUrl) {
        return dataUrl.split(",")[1];
    }
    // Tạo mới hãng hàng không
    public Airline createAirline(Airline airline) {

        if (airline.getLogo() != null && !airline.getLogo().isEmpty()) {
            try {
                String imageUrlString = airline.getLogo();
                File imageFile;

                if (imageUrlString.startsWith("data:")) {
                    // Xử lý URL dữ liệu
                    String base64Image = extractBase64String(imageUrlString);
                    byte[] imageBytes = Base64.getDecoder().decode(base64Image);

                    // Tạo tệp tạm thời
                    imageFile = File.createTempFile("image", ".tmp");
                    try (FileOutputStream fos = new FileOutputStream(imageFile)) {
                        fos.write(imageBytes);
                    }
                } else {
                    // Xử lý URL thông thường
                    URL imageUrl = new URL(imageUrlString);
                    imageFile = File.createTempFile("image", ".tmp");

                    try (InputStream in = imageUrl.openStream()) {
                        Files.copy(in, imageFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
                    }
                }

                // Tải hình ảnh lên Cloudinary
                String newImageUrl = cloudinaryService.uploadImage(imageFile);

                // Xóa tệp tạm thời
                imageFile.delete();

                // Cập nhật URL hình ảnh trong cơ sở dữ liệu
                airline.setLogo(newImageUrl);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
            return airlineRepository.save(airline);
        }


    // Cập nhật hãng hàng không
    public Airline updateAirline(Long id, Airline airlineDetails) {
        Airline airline = airlineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hãng hàng không với ID: " + id));

        airline.setName(airlineDetails.getName());
        if (airlineDetails.getLogo() != null && !airlineDetails.getLogo().isEmpty()) {
            try {
                String imageUrlString = airlineDetails.getLogo();
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
                airline.setLogo(newImageUrl);
            } catch (IOException e) {
                e.printStackTrace();
            }
            airline.setDescription(airlineDetails.getDescription());
        }
        return airlineRepository.save(airline);
    }

    // Xóa hãng hàng không
    public void deleteAirline(Long id) {
        Airline airline = airlineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hãng hàng không với ID: " + id));
        airlineRepository.delete(airline);
    }
}
