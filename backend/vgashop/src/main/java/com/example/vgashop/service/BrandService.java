package com.example.vgashop.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.vgashop.entity.Brand;
import com.example.vgashop.exception.DuplicateResourceException;
import com.example.vgashop.exception.ResourceNotFoundException;
import com.example.vgashop.repository.BrandRepository;



@Service
public class BrandService {

    private final BrandRepository brandRepository;

    public BrandService(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
    }

    // get all
    public Page<Brand> getAllBrands(
        int page,
        int size,
        String sortBy,
        String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("desc")
        ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        
        Sort finalSort = Sort.by(Sort.Direction.ASC, "displayOrder").and(sort);

        PageRequest pageable = PageRequest.of(page, size, finalSort);

        return brandRepository.findAll(pageable);
    }

    // Retrieve all
    public List<Brand> getAllNoPage() {
        return brandRepository.findAll(Sort.by(Sort.Direction.ASC, "displayOrder").and(Sort.by("name").ascending()));
    }

    // By ID
    public Brand getBrandId(Long Id) {
        // return brandRepository.findById(Id).orElseThrow(() ->

        //     );

        return brandRepository.findByIdAndDeleted(Id, false)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thương hiệu với ID " + Id));
    }

    // Search
    public Page<Brand> searchBrand(
        String keyWord,
        int page, int size
    ) {

        if (keyWord == null || keyWord.trim().isEmpty()) {
            return getAllBrands(page, size, "name", "asc");
        }
        PageRequest pageable = PageRequest.of(page, size, Sort.by("name").ascending());

        return brandRepository.findByNameContaining(keyWord.trim(), pageable);
    }


    public Page<Brand> filterBrands(String keyWord, Boolean status, int page, int size, String sortBy, String direction) {
        keyWord = (keyWord == null) ? "" : keyWord.trim();

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
                
        Sort finalSort = Sort.by(Sort.Direction.ASC, "displayOrder").and(sort);

        PageRequest pageable = PageRequest.of(page, size, finalSort);
        if (keyWord.isEmpty() && status == null) {
            return brandRepository.findAll(pageable);
        }

        if (keyWord.isEmpty()) {
            return brandRepository.findByStatus(status, pageable);
        }

        if (status == null) {
            return brandRepository.findByNameContaining(keyWord, pageable);
        }


        return brandRepository.findByNameContainingIgnoreCaseAndStatus(keyWord, status, pageable);
    }


    public Brand createBrand(Brand brand) {
        if (brandRepository.existsByNameIgnoreCase(brand.getName())) {
            throw new DuplicateResourceException("Thương hiệu '" + brand.getName() + "' đã tồn tại!");
        }


        if (brand.getSlug() == null || brand.getSlug().trim().isEmpty()) {
            brand.setSlug(generateSlug(brand.getName()));
        }
        return  brandRepository.save(brand);
    }

    // Update existing
    public Brand updateBrand(Long id, Brand newBrand) {
        // Brand brand = brandRepository.findById(id).orElse(null);

        // if (brand != null) {
        //     brand.setName(newBrand.getName());
        //     return brandRepository.save(brand);
        // }
        // return null;

        return brandRepository.findByIdAndDeleted(id, false)
        .map(brand -> {
            // Validation
            if (!brand.getName().equalsIgnoreCase(newBrand.getName()) && brandRepository.existsByNameIgnoreCase(newBrand.getName())) {
                throw new DuplicateResourceException("Tên thương hiệu '" + newBrand.getName() + "' đã tồn tại!");
            }
            brand.setName(newBrand.getName());
            brand.setLogo(newBrand.getLogo());
            brand.setDescription(newBrand.getDescription());
            brand.setStatus(newBrand.getStatus());

            // Update existing
            if (!brand.getName().equalsIgnoreCase(newBrand.getName()) && (newBrand.getSlug() == null || newBrand.getSlug().trim().isEmpty())) {
                brand.setSlug(generateSlug(newBrand.getName()));
            } else if(newBrand.getSlug() != null) {
                brand.setSlug(newBrand.getSlug());
            }
            return brandRepository.save(brand);
        })

        .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thương hiệu với ID " + id));
    }

    // Delete
    public void  deleteBrand(Long id) {

        // if (!brandRepository.existsById(id)) {

        // }
        // brandRepository.deleteById(id);
       if (!brandRepository.existsByIdAndDeleted(id, false)) {
        throw new ResourceNotFoundException("Không tìm thấy thương hiệu với ID " + id);
    }


    Brand brand = brandRepository.findByIdAndDeleted(id, false)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thương hiệu với ID " + id));

    // Hard delete to trigger DB constraints for demo
    brandRepository.delete(brand);
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
