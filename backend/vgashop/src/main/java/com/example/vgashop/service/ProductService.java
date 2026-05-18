package com.example.vgashop.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.vgashop.dto.ProductDTO;
import com.example.vgashop.entity.Product;
import com.example.vgashop.exception.DuplicateResourceException;
import com.example.vgashop.exception.ResourceNotFoundException;
import com.example.vgashop.repository.ProductRepository;
import com.example.vgashop.dto.ProductImageDTO;

@Service
public class ProductService {

    private final CategoryService categoryService;
    private final BrandService brandService;
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository, BrandService brandService, CategoryService categoryService) {
        this.productRepository = productRepository;
        this.brandService = brandService;
        this.categoryService = categoryService;
    }

    // Retrieve all
    // public Page<Product> getAllProducts(Pageable pageable) {
    //     return productRepository.findAll(pageable);
    // }

    public Page<Product> getAllProducts(
        int page,
        int size,
        String sortBy,
        String direction
    ) {
        // Sort sort;

        // if (direction.equalsIgnoreCase("desc")) {
        //     sort = Sort.by(sortBy).descending();
        // } else {
        //     sort = Sort.by(sortBy).ascending();
        // }

        Sort sort = direction.equalsIgnoreCase("desc")
        ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();


        Sort finalSort = Sort.by(Sort.Direction.ASC, "displayOrder").and(sort);

        PageRequest pageable = PageRequest.of(page, size, finalSort);

        return productRepository.findByDeletedFalse(pageable);
    }

    // By ID

    public Product getProductById(Long id) {
        return productRepository.findByIdAndDeleted(id, false)
                .orElseThrow(() -> 
                    new ResourceNotFoundException("Không tìm thấy sản phẩm với ID " + id)
                );
    }

    // Search
    public Page<Product> searchProducts(String keyWord, Pageable pageable) {
        if (keyWord == null || keyWord.trim().isEmpty()) {
            return productRepository.findAll(pageable);
        }
        return productRepository.findByNameContaining(keyWord, pageable);
    }


    public Page<Product> filterByBrand(String brand) {
        return productRepository.findByBrand_Name(brand, Pageable.unpaged());
    }

    // Search
    public Page<Product> searchAndFilter(String keyWord, String brand, Pageable pageable) {
        return productRepository.findByNameContainingAndBrand_Name(keyWord, brand, pageable);
    }

    // Product
    public Page<Product> filterProducts(
        String keyWord,
        List<Long> brandId,
        Double minPrice,
        Double maxPrice,
        int page,
        int size,
        String sortBy,
        String direction
    ) {

        // Process

        // if (keyWord == null) {
        //     keyWord = "";
        // }

        // if (minPrice == null) {
        //     minPrice = 0.0;
        // }

        // if (maxPrice == null) {
        //     maxPrice = Double.MAX_VALUE;
        // }

        keyWord = (keyWord == null) ? "" : keyWord;
        minPrice = (minPrice == null) ? 0.0 : minPrice;
        maxPrice = (maxPrice == null) ? Double.MAX_VALUE : maxPrice;

        // Sort sort;

        // if (direction.equalsIgnoreCase("desc")) {
        //     sort = Sort.by(sortBy).descending();
        // } else {
        //     sort = Sort.by(sortBy).ascending();
        // }

        Sort sort = direction.equalsIgnoreCase("desc")
        ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        PageRequest pageable = PageRequest.of(page, size, sort);

        if (brandId == null || brandId.isEmpty()) {
            return productRepository.findByNameContainingAndPriceBetween(keyWord, minPrice, maxPrice, pageable);
        }

        return productRepository.findByNameContainingAndBrand_IdInAndPriceBetween(keyWord, brandId, minPrice, maxPrice, pageable);
    }


    public Product creatProduct(Product product) {
        if (productRepository.existsByNameIgnoreCase(product.getName())) {
            throw new DuplicateResourceException("Sản phẩm với tên '" + product.getName() + "' đã tồn tại!");
        }

        // Validation
        if (product.getSku() != null && !product.getSku().trim().isEmpty()) {
            if (productRepository.existsBySkuIgnoreCase(product.getSku().trim())) {
                throw new DuplicateResourceException("Sku '" + product.getSku() + "' đã tồn tại!");
            }
        }

        // Validation
        if (product.getPrice() == null || product.getPrice().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Giá sản phẩm phải lớn hơn 0");
        }

        // Validation
        if (product.getStock() == null || product.getStock() < 0) {
            throw new IllegalArgumentException("Số lượng tồn kho không thể âm!");
        }

        // Validation
        if (product.getName() == null || product.getName().isEmpty()) {
            throw new IllegalArgumentException("Tên sản phẩm không để trống!");
        }
        return productRepository.save(product);
    }

    // Update existing
    public Product updateProduct(Long id, Product newProduct) {
        // Product product = productRepository.findById(id).orElse(null);

        // if (product != null) {
        //     product.setName(newProduct.getName());
        //     product.setPrice(newProduct.getPrice());
        //     product.setStock(newProduct.getStock());
        //     product.setDescription(newProduct.getDescription());
        //     product.setImgUrl(newProduct.getImgUrl());
        //     product.setBrand(newProduct.getBrand());

        //     return productRepository.save(product);
        // }

        // return null;
        return productRepository.findByIdAndDeleted(id, false)
                .map(product -> {
                    product.setName(newProduct.getName());
                    product.setPrice(newProduct.getPrice());
                    product.setOldPrice(newProduct.getOldPrice());
                    product.setStock(newProduct.getStock());
                    product.setDescription(newProduct.getDescription());
                    product.setImgUrl(newProduct.getImgUrl());
                    product.setBrand(newProduct.getBrand());
                    product.setCategory(newProduct.getCategory());

                    return productRepository.save(product);
                })
                .orElseThrow(() -> new ResourceNotFoundException("không tìm thấy sản phẩm với ID " + id));
    }

    // Delete
    public void deleteProduct(Long id) {
        if (!productRepository.existsByIdAndDeleted(id, false)) {
            throw new ResourceNotFoundException("Không tìm thấy sản phẩm với ID " + id);
        }
        // productRepository.deleteById(id);
        Product product = productRepository.findByIdAndDeleted(id, false)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với ID " + id));

        product.setDeleted(true);
        productRepository.save(product);
    }

    // Product
    public Product createProductWithImage(ProductImageDTO dto) {
        if (productRepository.existsByNameIgnoreCase(dto.getName())) {
            throw new DuplicateResourceException("Sản phẩm với tên '" + dto.getName() + "' đã tồn tại!");
        }

        if (dto.getSku() != null && !dto.getSku().trim().isEmpty()) {
            if (productRepository.existsBySkuIgnoreCase(dto.getSku().trim())) {
                throw new DuplicateResourceException("Sku '" + dto.getSku() + "' đã tồn tại!");
            }
        }

        // Image
        String imgUrl = uploadImageFile(dto.getImageFile());

        Product product = new Product();
        product.setName(dto.getName());
        product.setPrice(dto.getPrice());
        product.setOldPrice(dto.getOldPrice());
        product.setStock(dto.getStock());
        product.setDescription(dto.getDescription());
        product.setImgUrl(imgUrl);
        product.setSku(dto.getSku());

        product.setGpuModel(dto.getGpuModel());
        product.setVram(dto.getVram());
        product.setMemoryType(dto.getMemoryType());
        product.setCoolingType(dto.getCoolingType());
        product.setPowerConnectors(dto.getPowerConnectors());
        product.setRecommendedPsu(dto.getRecommendedPsu());
        product.setDimension(dto.getDimension());

        if (dto.getBrandId() != null) {
            product.setBrand(brandService.getBrandId(dto.getBrandId()));
        }

        if (dto.getCategoryId() != null) {
            product.setCategory(categoryService.getCategoryById(dto.getCategoryId()));
        }

        return productRepository.save(product);
    }

    // Update existing
    public Product updateProductWithImage(Long id, ProductImageDTO dto) {
        return productRepository.findByIdAndDeleted(id, false)
                .map(product -> {
                    if (!product.getName().equalsIgnoreCase(dto.getName()) && productRepository.existsByNameIgnoreCase(dto.getName())) {
                        throw new DuplicateResourceException("Sản phẩm với tên '" + dto.getName() + "' đã tồn tại!");
                    }

                    if (dto.getSku() != null && !dto.getSku().trim().isEmpty()) {
                        if (!dto.getSku().trim().equalsIgnoreCase(product.getSku()) && productRepository.existsBySkuIgnoreCase(dto.getSku().trim())) {
                            throw new DuplicateResourceException("Sku '" + dto.getSku() + "' đã tồn tại!");
                        }
                    }

                    product.setName(dto.getName());
                    product.setPrice(dto.getPrice());
                    product.setOldPrice(dto.getOldPrice());
                    product.setStock(dto.getStock());
                    product.setDescription(dto.getDescription());
                    if (dto.getSku() != null) product.setSku(dto.getSku());

                    product.setGpuModel(dto.getGpuModel());
                    product.setVram(dto.getVram());
                    product.setMemoryType(dto.getMemoryType());
                    product.setCoolingType(dto.getCoolingType());
                    product.setPowerConnectors(dto.getPowerConnectors());
                    product.setRecommendedPsu(dto.getRecommendedPsu());
                    product.setDimension(dto.getDimension());

                    // Update existing
                    if (dto.getImageFile() != null && !dto.getImageFile().isEmpty()) {
                        String imgUrl = uploadImageFile(dto.getImageFile());
                        product.setImgUrl(imgUrl);
                    }

                    if (dto.getBrandId() != null) {
                        product.setBrand(brandService.getBrandId(dto.getBrandId()));
                    }
                    if (dto.getCategoryId() != null) {
                        product.setCategory(categoryService.getCategoryById(dto.getCategoryId()));
                    }

                    return productRepository.save(product);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm ID: " + id));
    }

    // Image
    private String uploadImageFile(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File ảnh không được để trống!");
        }

        try {
            String uplaodDir = "uploads/products/";
            java.nio.file.Path uploadPath = java.nio.file.Paths.get(uplaodDir);


            if (!java.nio.file.Files.exists(uploadPath)) {
                java.nio.file.Files.createDirectories(uploadPath);
            }


            String originalFileName = file.getOriginalFilename();
            String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            String fileName = System.currentTimeMillis() + "_" + originalFileName;

            java.nio.file.Path filePath = uploadPath.resolve(fileName);

            file.transferTo(filePath.toAbsolutePath().toFile());

            return "/uploads/products/" + fileName; // Image
        } catch (Exception e) {
            throw new RuntimeException("Không thể upload file ảnh: " + e.getMessage(), e);
        }
    }
}
