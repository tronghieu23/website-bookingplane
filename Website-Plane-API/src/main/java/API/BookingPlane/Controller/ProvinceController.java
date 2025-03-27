package API.BookingPlane.Controller;

import API.BookingPlane.Model.Province;
import API.BookingPlane.Service.ProvinceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/Province")
public class ProvinceController {
    private final ProvinceService provinceService;
    @Autowired
    public ProvinceController(ProvinceService provinceService){
        this.provinceService = provinceService;
    }

    @PostMapping("/create")
    public ResponseEntity<Province> createprovince(@RequestBody Province province){
        Province createdprovince = provinceService.createprovince(province);
        return ResponseEntity.ok(createdprovince);
    }
    //API lay danh sach tinh thanh
    @GetMapping
    public List<Province> getALlprovince(){
        return provinceService.getAllprovinces();
    }

    //API lay thong tin tinh thanh
    @GetMapping("/{id}")
    public ResponseEntity<Province> getprovinceById(@PathVariable Long id){
        Optional<Province> province = provinceService.getprovinceId(id);
        return province.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    //Cap nhat thong tin  tinh thanh
    @PutMapping("/{id}")
    public ResponseEntity<Province> updateprovince(@PathVariable Long id, @RequestBody Province provinceDetails){
        Optional<Province> updateprovince = provinceService.updateprovince(id,provinceDetails);
        return updateprovince.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    //Xoa thong tin tinh thanh
    @DeleteMapping("/{id}")
    public  ResponseEntity<String> deleteprovince(@PathVariable Long id){
        try{
            provinceService.deleteprovince(id);
            return ResponseEntity.ok("Xóa tỉnh thành thành công!");
        }catch (IllegalStateException ex){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

}
