package API.BookingPlane.Service;

import API.BookingPlane.Model.Province;
import API.BookingPlane.Repository.ProvinceRepository;
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
public class ProvinceService {

    @Autowired
    private ProvinceRepository provinceRepository;
    @Autowired
    private CloudinaryService cloudinaryService;
    //Tao tinh thanh
    public Province createprovince(Province province)
    {
        if (province.getImage() != null && !province.getImage().isEmpty()) {
            try {
                String imageUrlString = province.getImage();
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
                province.setImage(newImageUrl);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return provinceRepository.save(province);
    }
    //lay danh sach tinh thanh
    public List<Province> getAllprovinces() {
        return provinceRepository.findAll();
    }
    //lay thong tin tinh thanh
    public Optional<Province> getprovinceId(Long Id){
        return provinceRepository.findById(Id);
    }
    //cap nhat thong tin tinh thanh

    private String extractBase64String(String dataUrl) {
        return dataUrl.split(",")[1];
    }
    public Optional<Province> updateprovince(Long id, Province provincedetails){
        return provinceRepository.findById(id).map(province -> {
            province.setName(provincedetails.getName());
            if (provincedetails.getImage() != null && !provincedetails.getImage().isEmpty()) {
                try {
                    String imageUrlString = provincedetails.getImage();
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
                    province.setImage(newImageUrl);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            return provinceRepository.save(province);
        });
    }
    //xoa tinh thanh
    public void deleteprovince(Long id){
        provinceRepository.deleteById(id);
    }
}
