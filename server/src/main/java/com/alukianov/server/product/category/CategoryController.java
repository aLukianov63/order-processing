package com.alukianov.server.product.category;

import com.alukianov.server.utils.ServerResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping(value = "/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ServerResponse> findAllCategories() {
        return ResponseEntity.ok(ServerResponse.builder()
                        .status(HttpStatus.OK.value())
                        .message("All categories")
                        .payload(categoryService.findAll())
                        .build());
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<ServerResponse> findCategoryById(@PathVariable Long id) {
        Optional<Category> category = categoryService.findById(id);

        return category.map(value -> ResponseEntity.ok(ServerResponse.builder()
                .status(HttpStatus.OK.value())
                .message("Category with id: " + id)
                .payload(value)
                .build())).orElseGet(() -> new ResponseEntity<>(ServerResponse.builder()
                .status(HttpStatus.NOT_FOUND.value())
                .message("Category not found")
                .build(),
                HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<ServerResponse> saveCategory(@RequestBody Category category) {
        categoryService.save(category);
        return ResponseEntity.ok(ServerResponse.builder()
                        .status(HttpStatus.OK.value())
                        .message("Category saved!")
                        .build());
    }

}
