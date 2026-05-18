package com.example.vgashop.controler;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.vgashop.dto.BrandDTO;
import com.example.vgashop.entity.Brand;
import com.example.vgashop.repository.ApiResponse;
import com.example.vgashop.service.BrandService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/brands")
@CrossOrigin
public class BrandController {

    private final BrandService brandService;

    public BrandController(BrandService brandService) {
        this.brandService = brandService;
    }

    // get all
    @GetMapping
    public ApiResponse<Page<Brand>> getAll(
        @RequestParam(defaultValue= "0")
        int page,

        @RequestParam(defaultValue= "10")
        int size,

        @RequestParam(defaultValue= "id")
        String sortBy,

        @RequestParam(defaultValue= "asc") 
        String direction

    ) {
        Page<Brand> data = brandService.getAllBrands(page, size, sortBy, direction);
        return ApiResponse.success("Lấy danh sách thương hiệu thành công", data);
    }


    @GetMapping("/filter")
    public ApiResponse<Page<Brand>> filterBrands(
        @RequestParam(required = false) String keyword,
        @RequestParam(required = false) Boolean status,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "name") String sortBy,
        @RequestParam(defaultValue = "asc") String direction) {

    Page<Brand> data = brandService.filterBrands(keyword, status, page, size, sortBy, direction);
    return ApiResponse.success("Lọc thương hiệu thành công", data);
}

    // Retrieve all
    public ApiResponse<List<Brand>> getAllBrandNoPage() {
        List<Brand> data = brandService.getAllNoPage();
        return ApiResponse.success("Lấy tất cả thương hiệu thành công", data);
    }


    @GetMapping("/{id}")
    public ApiResponse<Brand> getBrandById(@PathVariable Long id) {
        // return brandService.getBrandId(id)
        //         .map(ResponseEntity::ok)
        //         .orElseGet(() -> ResponseEntity.notFound().build());

        Brand brand = brandService.getBrandId(id);
        return ApiResponse.success("Lấy thương hiệu thành công", brand);
    }

    // Search
    @GetMapping("/search")
    public ApiResponse<Page<Brand>> search(
        @RequestParam String keyWord,

        @RequestParam(defaultValue= "0")
        int page,

        @RequestParam(defaultValue= "10")
        int size
    ) {
       Page<Brand> data = brandService.searchBrand(keyWord, page, size);
       return ApiResponse.success("Tìm kiếm thương hiệu thành công", data);
    }


    // @PostMapping
    // public Brand create(
    //     @RequestBody Brand brand
    // ) {
    //     return brandService.createBrand(brand);
    // }

    @PostMapping
    public ApiResponse<Brand> create(
        @Valid @RequestBody BrandDTO dto
    ) {

        Brand brand = convertDtoToEntity(dto);
        Brand saved = brandService.createBrand(brand);

        return ApiResponse.success("Tạo thương hiệu thành công", saved);
    }

    // Update existing
    // @PutMapping("/{id}")
    // public Brand update(@PathVariable Long id, @RequestBody Brand brand) {
    //     return brandService.updateBrand(id, brand);
    // }

    @PutMapping("/{id}")
    public ApiResponse<Brand> update(@PathVariable Long id, @Valid @RequestBody BrandDTO dto) {
        Brand brand = convertDtoToEntity(dto);
        Brand updated = brandService.updateBrand(id, brand);
        return ApiResponse.success("Cập nhật thương hiệu thành công", updated);
    }

    // Delete
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        brandService.deleteBrand(id);
        return ApiResponse.message("Xóa thương hiệu thành công");
    }


    private Brand convertDtoToEntity(BrandDTO dto) {
        Brand brand = new Brand();
        brand.setName(dto.getName());
        brand.setDescription(dto.getDescription());
        brand.setStatus(dto.getStatus() != null ? dto.getStatus() : true);


        if (dto.getSlug() != null && !dto.getSlug().trim().isEmpty()) {
            brand.setSlug(dto.getSlug().trim().toLowerCase());
        } else {
            // User
            brand.setSlug(generateSlug(dto.getName()));
        }
        return brand;
    }


    private String generateSlug(String name) {
        if (name == null || name.trim().isEmpty()) {
            return "";
        }

        return name.toLowerCase()
                   .trim()
                   .replaceAll("\\s+", "-")
                   .replaceAll("[^a-z0-9-]", "");
    }
}

