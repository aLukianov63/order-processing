package com.alukianov.server.user;

import com.alukianov.server.basket.Basket;
import com.alukianov.server.basket.BasketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    private final BasketRepository basketRepository;

    public User save(User user) {
        user.setCreateAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        Basket basket = Basket.builder()
                .owner(user)
                .createAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        User temp = userRepository.save(user);
        basketRepository.save(basket);
        return temp;
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public  Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }

}