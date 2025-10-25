package com.emranhss.mkbankspring.restcontroller;

import com.emranhss.mkbankspring.dto.AuthenticationResponse;
import com.emranhss.mkbankspring.entity.Accounts;
import com.emranhss.mkbankspring.entity.User;
import com.emranhss.mkbankspring.repository.TokenRepository;
import com.emranhss.mkbankspring.repository.UserRepository;
import com.emranhss.mkbankspring.service.AuthService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user/")
public class UserRestController {

    @Autowired
    private AuthService authService;

    @Autowired
    private TokenRepository tokenRepository;

    @Autowired
    private UserRepository userRepository;


    //Method for only user Save,update or register (Method number -1)
    @PostMapping("")
    public ResponseEntity<Map<String,String>>saveUser(
            @RequestPart(value = "user")String userJson,
            @RequestParam(value = "photo")MultipartFile file
    ) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        User user = objectMapper.readValue(userJson, User.class);

        try {
            authService.saveOrUpdateUser(user, file);
            Map<String, String> response = new HashMap<>();
            response.put("Message", "User Added Successfully ");

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {

            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("Message", "User Add Faild " + e);
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // for Show User view by id (Method Number -2)
    @GetMapping("{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = authService.findUserById(id);
        if (user != null){
            return ResponseEntity.ok(user);
        }else {
            return ResponseEntity.notFound().build();
        }
    }


    //Method for show all users (Method Number -3)
    @GetMapping("all")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = authService.findAll();
        return ResponseEntity.ok(users);

    }

    @PostMapping("login")
    public ResponseEntity<AuthenticationResponse>  login(@RequestBody User request){
        return ResponseEntity.ok(authService.authenticate(request));

    }

    @GetMapping("/active/{id}")
    public ResponseEntity<String> activeUser(@PathVariable("id") Long id){

        String response= authService.activeUser(id);
        return  ResponseEntity.ok(response);
    }


    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("Missing or invalid Authorization header.");
        }

        String token = authHeader.substring(7);  // Strip "Bearer "

        tokenRepository.findByToken(token).ifPresent(savedToken -> {
            savedToken.setLogout(true);  // Mark token as logged out
            tokenRepository.save(savedToken);
        });

        return ResponseEntity.ok("Logged out successfully.");
    }


//for admin profile
    @GetMapping("/profile")
    public ResponseEntity<?> getProfileForAdmin(Authentication authentication) {

        System.out.println("Authenticated User: " + authentication.getName());
        System.out.println("Authorities: " + authentication.getAuthorities());
        String email = authentication.getName();
        Optional<User> user =userRepository.findByEmail(email);
        User userEntity = user.orElseThrow(() -> new RuntimeException("User not found")); // safe check
        User user1 = authService.findById(userEntity.getId());
        return ResponseEntity.ok(user1);
    }

    //for pasword reset
    @PostMapping("forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestParam String email) {
        String result = authService.forgotPassword(email);
        return ResponseEntity.ok(Map.of("message", result));
    }

    @PostMapping("reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestParam String token,
                                                             @RequestParam String newPassword) {
        String result = authService.resetPassword(token, newPassword);
        return ResponseEntity.ok(Map.of("message", result));
    }

}
