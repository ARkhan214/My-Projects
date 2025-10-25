package com.emranhss.mkbankspring.security;

import com.emranhss.mkbankspring.jwt.JwtAuthenticationFilter;
import com.emranhss.mkbankspring.jwt.JwtService;
import com.emranhss.mkbankspring.service.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http,
                                           JwtAuthenticationFilter jwtAuthenticationFilter,
                                           UserService userService) throws Exception {

        return http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(req -> req
                        .requestMatchers(
                                "/images/**",
                                "/error",
                                "/api/employees/profile",
                                "/api/user/**",
                                "/api/transactions/*/deposits",
                                "/api/transactions/*/withdraws",
                                "/api/auth/**",
                                "/api/account/all",
                                "/api/account/**",
                                "/api/user/login",
                                "/api/user/login/**",

                                "/api/user/active/**",
                                "/api/transactions/account/**",
                                "/api/transactions/**",
                                "/api/account/",
                                "/api/employees/",
                                "/api/employees/**",
                                "/api/transactions/**",
                                "/api/transactions/tr/**",
                                "/api/transactions/statement",
                                "/api/employees/**",
                                "/api/user/reset-password",
                                "/api/user/forgot-password",
                                "/api/transactions/pay/water",
                                "/api/loan/**",
                                "/api/admin/loans/**",
                                "/api/fd/create",
                                "/api/fd/**",
                                "/api/dps/**",
                                "/api/dps/pay/{dpsId}",
                                "/api/fd/close/{fdId}/{accountId}",
                                "/{fdId}/transactions",
                                "/api/account/receiver/{receiverId}",
                                "/api/admin/loans/pending",
                                "/api/admin/loans/all",
                                "/api/loans/total"


                        )
                        .permitAll()
                                .requestMatchers("/api/user/profile").authenticated()
                                .requestMatchers("/api/loans/apply","/api/transactions/statement").hasRole("USER")
                                .requestMatchers("/api/loans/**").hasAnyRole("USER","ADMIN")
//                        .requestMatchers("/api/transactions/**","/api/account/").hasRole("USER")
//                        .requestMatchers("/api/employees/","/api/employees/**","/api/transactions/**","/api/transactions/tr/**").hasRole("EMPLOYEE")
                        .anyRequest().authenticated()
                )
                .userDetailsService(userService)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }


    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter(JwtService jwtService, UserService userService) {
        return new JwtAuthenticationFilter(jwtService, userService);
    }


    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder encoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:4200", "http://localhost:5000"));
        configuration.setAllowedMethods(List.of("GET", "POST", "DELETE", "PUT", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Cache_Control", "Content-type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
