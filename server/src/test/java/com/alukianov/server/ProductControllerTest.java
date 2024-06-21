package com.alukianov.server;

import com.alukianov.server.product.ProductController;
import com.alukianov.server.product.ProductDTO;
import com.alukianov.server.product.ProductService;
import com.alukianov.server.utils.ServerResponse;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.test.context.support.WithMockUser;

import java.util.Collections;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProductController.class)
public class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void testFindAllProducts() throws Exception {
        Mockito.when(productService.findAll()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/v1/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(HttpStatus.OK.value()))
                .andExpect(jsonPath("$.message").value("All products list"))
                .andExpect(jsonPath("$.payload").isArray());
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void testFindProductByIdNotFound() throws Exception {
        Mockito.when(productService.findById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/products/1"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(HttpStatus.NOT_FOUND.value()))
                .andExpect(jsonPath("$.message").value("Product with id 1 not found"));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void testFindProductByIdFound() throws Exception {
        ProductDTO productDTO = ProductDTO.builder()
                .id(1L)
                .title("Test Product")
                .description("Test Description")
                .image("Test Image")
                .price(100.0)
                .categoryId(1L)
                .categoryName("Test Category")
                .inventoryId(1L)
                .quantity(10)
                .build();
        Mockito.when(productService.findById(1L)).thenReturn(Optional.of(productDTO));

        mockMvc.perform(get("/api/v1/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(HttpStatus.OK.value()))
                .andExpect(jsonPath("$.message").value("Product with id: 1"))
                .andExpect(jsonPath("$.payload.id").value(1L))
                .andExpect(jsonPath("$.payload.title").value("Test Product"));
    }

}


