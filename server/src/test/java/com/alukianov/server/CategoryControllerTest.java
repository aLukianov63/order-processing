package com.alukianov.server;

import com.alukianov.server.product.category.Category;
import com.alukianov.server.product.category.CategoryController;
import com.alukianov.server.product.category.CategoryService;
import com.alukianov.server.utils.ServerResponse;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class CategoryControllerTest {

    @Mock
    private CategoryService categoryService;

    @InjectMocks
    private CategoryController categoryController;

    public CategoryControllerTest() {
        MockitoAnnotations.openMocks(this);
    }
    @Test
    void testFindAllCategories_Success() {
        ResponseEntity<ServerResponse> expectedResponse = ResponseEntity.ok(ServerResponse.builder()
                .status(HttpStatus.OK.value())
                .message("All categories")
                .payload(Collections.emptyList())
                .build());

        when(categoryService.findAll()).thenReturn(Collections.emptyList());

        ResponseEntity<ServerResponse> actualResponse = categoryController.findAllCategories();

        assertEquals(expectedResponse, actualResponse);
        verify(categoryService, times(1)).findAll();
    }

    @Test
    void testFindCategoryById_Found() {
        long categoryId = 1L;
        Category category = new Category();
        category.setId(categoryId);
        ResponseEntity<ServerResponse> expectedResponse = ResponseEntity.ok(ServerResponse.builder()
                .status(HttpStatus.OK.value())
                .message("Category with id: " + categoryId)
                .payload(category)
                .build());

        when(categoryService.findById(categoryId)).thenReturn(Optional.of(category));

        ResponseEntity<ServerResponse> actualResponse = categoryController.findCategoryById(categoryId);

        assertEquals(expectedResponse, actualResponse);
        verify(categoryService, times(1)).findById(categoryId);
    }

    @Test
    void testFindCategoryById_NotFound() {
        long categoryId = 1L;
        ResponseEntity<ServerResponse> expectedResponse = new ResponseEntity<>(ServerResponse.builder()
                .status(HttpStatus.NOT_FOUND.value())
                .message("Category not found")
                .build(), HttpStatus.NOT_FOUND);

        when(categoryService.findById(categoryId)).thenReturn(Optional.empty());

        ResponseEntity<ServerResponse> actualResponse = categoryController.findCategoryById(categoryId);

        assertEquals(expectedResponse, actualResponse);
        verify(categoryService, times(1)).findById(categoryId);
    }

    @Test
    void testSaveCategory_Success() {
        Category category = new Category();
        ResponseEntity<ServerResponse> expectedResponse = ResponseEntity.ok(ServerResponse.builder()
                .status(HttpStatus.OK.value())
                .message("Category saved!")
                .build());

        ResponseEntity<ServerResponse> actualResponse = categoryController.saveCategory(category);

        assertEquals(expectedResponse, actualResponse);
        verify(categoryService, times(1)).save(category);
    }
}

