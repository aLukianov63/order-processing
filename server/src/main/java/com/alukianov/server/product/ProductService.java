package com.alukianov.server.product;

import com.alukianov.server.product.category.CategoryRepository;
import com.alukianov.server.product.inventory.Inventory;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private  final ProductDTOMapper productDTOMapper;
    private final CategoryRepository categoryRepository;

    public Product save(ProductDTO productDTO) {

        if (categoryRepository.findById(productDTO.categoryId()).isEmpty()) {
            throw new EntityNotFoundException("Category with id " + productDTO.categoryId() + " not found");
        }

        Product product = Product.builder()
                .title(productDTO.title())
                .description(productDTO.description())
                .imageUrl(productDTO.image())
                .price(productDTO.price())
                .category(categoryRepository.findById(productDTO.categoryId()).get())
                .inventory(Inventory.builder()
                        .createdAt(LocalDateTime.now())
                        .quantity(productDTO.quantity())
                        .updatedAt(LocalDateTime.now())
                        .build())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return productRepository.save(product);
    }

    public Optional<ProductDTO> findById(Long id) {

        if (productRepository.findById(id).isEmpty()) {
            return Optional.empty();
        }

        return Optional.of(productDTOMapper.apply(productRepository.findById(id).get()));
    }

    public List<ProductDTO> findAll() {
        return productRepository.findAll().stream().map(productDTOMapper).toList();
    }

    public void deleteById(Long id) {
        productRepository.deleteById(id);
    }

}
