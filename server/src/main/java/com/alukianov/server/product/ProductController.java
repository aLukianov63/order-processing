package com.alukianov.server.product;

import com.alukianov.server.utils.ServerResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping(value = "/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    private ResponseEntity<ServerResponse> findAllProducts() {
        return ResponseEntity.ok(ServerResponse.builder()
                        .status(HttpStatus.OK.value())
                        .message("All products list")
                        .payload(productService.findAll())
                        .build());
    }

    @GetMapping(value = "/{id}")
    private ResponseEntity<ServerResponse> findProductById(@PathVariable Long id) {
        Optional<ProductDTO> productDTO = productService.findById(id);

        if (productDTO.isPresent()) {
            return ResponseEntity.ok(ServerResponse.builder()
                    .status(HttpStatus.OK.value())
                    .message("Product with id: " + id)
                    .payload(productDTO)
                    .build());
        }
        return new ResponseEntity<>(ServerResponse.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Product with id " + id + " not found")
                    .build(),
                    HttpStatus.NOT_FOUND);
    }

    @PostMapping
    private ResponseEntity<ServerResponse> saveProduct(@RequestBody ProductDTO productDTO) {
        try {
            productService.save(productDTO);
        } catch (RuntimeException exception) {
            return new ResponseEntity<>(ServerResponse.builder()
                        .status(HttpStatus.NOT_FOUND.value())
                        .message(exception.getMessage())
                        .build(),
                        HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(ServerResponse.builder()
                        .status(HttpStatus.OK.value())
                        .message("Product added!")
                        .build());
    }
}
