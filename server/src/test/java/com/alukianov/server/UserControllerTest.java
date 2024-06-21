package com.alukianov.server;

import com.alukianov.server.basket.BasketService;
import com.alukianov.server.order.OrderService;
import com.alukianov.server.user.User;
import com.alukianov.server.user.UserController;
import com.alukianov.server.user.UserService;
import com.alukianov.server.utils.ServerResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @InjectMocks
    private UserController userController;

    @Mock
    private UserService userService;

    @Mock
    private BasketService basketService;

    @Mock
    private OrderService orderService;

    @Test
    void findAllUsers_shouldReturnOkAndUserList() {
        List<User> userList = List.of(
                User.builder().id(1L).username("user1").build(),
                User.builder().id(2L).username("user2").build()
        );
        Mockito.when(userService.findAll()).thenReturn(userList);

        ResponseEntity<ServerResponse> response = userController.findAllUsers();

        assertThat(((ResponseEntity<?>) response).getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().payload()).isEqualTo(userList);
    }

    @Test
    void findUserById_shouldReturnOkAndUserWhenUserExists() {
        Long userId = 1L;
        User user = User.builder().id(userId).username("user1").build();
        Mockito.when(userService.findById(userId)).thenReturn(Optional.of(user));

        ResponseEntity<ServerResponse> response = userController.findUserById(userId);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().payload()).isEqualTo(Optional.of(user));
    }

    @Test
    void findUserById_shouldReturnNotFoundWhenUserDoesNotExist() {
        Long userId = 1L;
        Mockito.when(userService.findById(userId)).thenReturn(Optional.empty());

        ResponseEntity<ServerResponse> response = userController.findUserById(userId);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(response.getBody().message()).isEqualTo("User with id " + userId + " not found");
    }



    @Test
    void findUserBasket_shouldReturnNotFoundWhenUserDoesNotExist() {
        Long userId = 1L;
        Mockito.when(userService.findById(userId)).thenReturn(Optional.empty());

        ResponseEntity<ServerResponse> response = userController.findUserBasket(userId);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(response.getBody().message()).isEqualTo("User with id " + userId + " not found");
    }



    @Test
    void findUserOrders_shouldReturnNotFoundWhenUserDoesNotExist() {
        Long userId = 1L;
        Mockito.when(userService.findById(userId)).thenReturn(Optional.empty());

        ResponseEntity<ServerResponse> response = userController.findUserOrders(userId);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(response.getBody().message()).isEqualTo("User with id " + userId + " not found");
    }
}
