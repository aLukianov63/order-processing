package com.alukianov.server.config;

import com.alukianov.server.security.CustomUserDetailsServer;
import com.alukianov.server.user.Role;
import com.alukianov.server.user.User;
import com.alukianov.server.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserService userService;

    @Value("#{'${settings.security.allowed-origins}'.split(',')}")
    public List<String> allowedOrigins;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors((cors) -> cors
                        .configurationSource(corsConfigurationSource())
                )
                .authorizeHttpRequests((authorize) -> authorize
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET,"/api/v1/categories/**").permitAll()
                        .requestMatchers(HttpMethod.POST,"/api/v1/categories/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET,"/api/v1/products/**").permitAll()
                        .requestMatchers(HttpMethod.POST,"/api/v1/products/**").hasRole("ADMIN")
                        .requestMatchers("/api/v1/users/me").authenticated()
                        .requestMatchers("/api/v1/users/*/basket").authenticated()
                        .requestMatchers("/api/v1/users/*/orders").authenticated()
                        .requestMatchers("/api/v1/users", "/api/v1/users/").hasRole("ADMIN")
                        .requestMatchers("/api/v1/basketItems").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/v1/orders").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/v1/orders/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .httpBasic((basicSecurity) -> basicSecurity
                        .authenticationEntryPoint((request, response, authException) ->
                                response.sendError(
                                        HttpStatus.UNAUTHORIZED.value(),
                                        HttpStatus.UNAUTHORIZED.getReasonPhrase())
                        )
                );

        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        CustomUserDetailsServer customerDetails = new CustomUserDetailsServer(userService);

        User admin1 = User.builder()
                .username("admin1")
                .email("admin1@mail.com")
                .password("$2a$08$E.YB53P9QWAhOHNh7hqoyeJk9wsknb9wH8l4rPVIT6dHMPzMqJNhy") // 12345
                .role(Role.ROLE_ADMIN)
                .build();

        User admin2 = User.builder()
                .username("admin2")
                .email("admin2@mail.com")
                .password("$2a$05$aa.QrdtD574R2sL6pzptW.cKofdUXZKbOR3GAwvRhWMxaVPkqUtJ6") // 123452
                .role(Role.ROLE_ADMIN)
                .build();

        customerDetails.startInit(admin1, admin2);
        return customerDetails;
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowCredentials(true);
        configuration.setAllowedOrigins(allowedOrigins);
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "DELETE", "PUT", "UPDATE"));
        configuration.setAllowedHeaders(
                Arrays.asList("Origin", "Content-Type", "Accept", "responseType", "Authorization")
        );

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            UserDetailsService userDetailsService, PasswordEncoder passwordEncoder
    ) {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userDetailsService);
        authenticationProvider.setPasswordEncoder(passwordEncoder);

        return new ProviderManager(authenticationProvider);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(8);
    }

}