package com.emranhss.mkbankspring.service;

import com.emranhss.mkbankspring.dto.AuthenticationResponse;
import com.emranhss.mkbankspring.entity.*;
import com.emranhss.mkbankspring.jwt.JwtService;
import com.emranhss.mkbankspring.repository.GLTransactionRepository;
import com.emranhss.mkbankspring.repository.TokenRepository;
import com.emranhss.mkbankspring.repository.UserRepository;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Service
public class AuthService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenRepository tokenRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private AccountService accountService;

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private GLTransactionRepository glTransactionRepository;

    @Autowired
    @Lazy
    private AuthenticationManager authenticationManager;


    @Value("src/main/resources/static/images")
    private String uploadDir;

    //Method for save,update or register (connected with UserResCon Method Number -1)
    //Save user
    public void saveOrUpdateUser(User user, MultipartFile imageFile) {
        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = saveImage(imageFile, user);
            user.setPhoto(fileName);
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(Role.ADMIN);
        user.setActive(true);
        userRepository.save(user);
        sendActivationEmail(user);
    }


    //method for find all user
    public List<User> findAll() {
        return userRepository.findAll();
    }

    //method for find user by id
    public User findById(Long id) {
        return userRepository.findById(id).get();
    }

    //method for find user by id or return null
    public User findUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }


    public void delete(User user) {
        userRepository.delete(user);
    }


    //Method for Send Email (connected with this saveOrUpdateUser methode)
    private void sendActivationEmail(User user) {
        String subject = "Welcome to Our Service – Confirm Your Registration";

        String mailText = "<!DOCTYPE html>"
                + "<html>"
                + "<head>"
                + "<style>"
                + "  body { font-family: Arial, sans-serif; line-height: 1.6; }"
                + "  .container { max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; }"
                + "  .header { background-color: #4CAF50; color: white; padding: 10px; text-align: center; border-radius: 10px 10px 0 0; }"
                + "  .content { padding: 20px; }"
                + "  .footer { font-size: 0.9em; color: #777; margin-top: 20px; text-align: center; }"
                + "</style>"
                + "</head>"
                + "<body>"
                + "  <div class='container'>"
                + "    <div class='content'>"
                + "      <p>Dear " + user.getName() + ",</p>"
                + "      <p>Thank you for registering with us. We are excited to have you on board!</p>"
                + "      <p>Please confirm your email address to activate your account and get started.</p>"
                + "      <p>If you have any questions or need help, feel free to reach out to our support team.</p>"
                + "      <br>"
                + "      <p>Best regards,<br>The Support Team</p>"
                + "    </div>"
                + "    <div class='footer'>"
                + "      &copy; " + java.time.Year.now() + " MK Bank. All rights reserved."
                + "    </div>"
                + "  </div>"
                + "</body>"
                + "</html>";

        try {
            emailService.sendSimpleEmail(user.getEmail(), subject, mailText);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send activation email", e);
        }
    }


    //Method for save image of file in User table
    public String saveImage(MultipartFile file, User user) {

        Path uploadPath = Paths.get(uploadDir + "/user");
        if (!Files.exists(uploadPath)) {
            try {
                Files.createDirectories(uploadPath);  // change here
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
        String fileName = user.getName() + "_" + UUID.randomUUID().toString();
        try {
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return fileName;
    }


    //Method for save image file in Account table
    public String saveImageForAccount(MultipartFile file, Accounts account) {
        Path uploadPath = Paths.get(uploadDir + "/account");
        if (!Files.exists(uploadPath)) {
            try {
                Files.createDirectory(uploadPath);

            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

        String accountName = account.getName();
        String fileName = accountName.trim().replaceAll("\\s+", "_");

        String savedFileName = fileName + "_" + UUID.randomUUID().toString();


        try {
            Path filePath = uploadPath.resolve(savedFileName);
            Files.copy(file.getInputStream(), filePath);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return savedFileName;
    }


    // Account Save or update or registration (connected with AccountResCon Method Number -1)
    public void registerAccount(User user, MultipartFile imageFile, Accounts accountData) {
        // Handle profile image upload for both User and Account
        if (imageFile != null && !imageFile.isEmpty()) {
            String filename = saveImage(imageFile, user);                       // Save user profile photo
            String accountPhoto = saveImageForAccount(imageFile, accountData);  // Save account photo
            accountData.setPhoto(accountPhoto);
            user.setPhoto(filename);
        }

        // Encode password before saving User
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(Role.USER);           // Default role = USER
        user.setActive(true);              // Set user as active
        User savedUser = userRepository.save(user);

        // Link account with this saved user
        accountData.setUser(savedUser);
        accountService.save(accountData);

        // Auto-login step: Generate JWT token for this newly registered user
        String jwtToken = jwtService.generateToken(savedUser);
        saveUserToken(jwtToken, savedUser); // Save token into Token table in DB


        // If account has an initial balance, create the first transaction
        if (accountData.getBalance() > 0) {
            Transaction initialDeposit = new Transaction();
            initialDeposit.setAmount(accountData.getBalance());         // Initial balance amount
            initialDeposit.setType(TransactionType.INITIALBALANCE);     // Mark as INITIALBALANCE type
            initialDeposit.setDescription("Initial deposit");           // Description for clarity
            initialDeposit.setToken(jwtToken);                          // Attach the same JWT token
            transactionService.addTransaction(initialDeposit, accountData.getId(),jwtToken);
        }

        GLTransaction glTxn1 = new GLTransaction();
        glTxn1.setAmount(accountData.getBalance());    // minus because money going out
        glTxn1.setType(GLType.ACCOUNT_OPEN);
        glTxn1.setDescription("Account Openning Balance.Account Id is " + accountData.getId());
        glTxn1.setReferenceId(accountData.getId());
        glTxn1.setReferenceType("ACCOUNT_OPEN");
        glTransactionRepository.save(glTxn1);

        // Send activation email to the user after successful registration
        sendActivationEmail(savedUser);
    }


    //Employ plus user Save
    public void registerEmployee(User user, MultipartFile imageFile, Employee employeeData) {
        if (imageFile != null && !imageFile.isEmpty()) {
            String filename = saveImage(imageFile, user);
            String employeePhoto = saveImageForEmployee(imageFile, employeeData);
            employeeData.setPhoto(employeePhoto);
            user.setPhoto(filename);
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(Role.EMPLOYEE);
        user.setActive(true);
        User savedUser = userRepository.save(user);

        employeeData.setUser(savedUser);

        if (employeeData.getDateOfJoining() != null) {
            Calendar cal = Calendar.getInstance();
            cal.setTime(employeeData.getDateOfJoining());
            cal.add(Calendar.YEAR,30); //joining date theke 30 year.
            employeeData.setRetirementDate(cal.getTime());
        }
        employeeService.save(employeeData);

        sendEmployeeWelcomeEmail(employeeData);

    }


    //Method for save image file in Account table
    public String saveImageForEmployee(MultipartFile file, Employee employee) {
        Path uploadPath = Paths.get(uploadDir + "/employee");

        if (!Files.exists(uploadPath)) {
            try {
                Files.createDirectory(uploadPath);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

        String employeeName = employee.getName();
        String fileName = employeeName.trim().replaceAll("\\s+", "_");

        String savedFileName = fileName + "_" + UUID.randomUUID().toString();
//        String savedFileName = employee + "_" + UUID.randomUUID().toString();
        try {
            Path filePath = uploadPath.resolve(savedFileName);
            Files.copy(file.getInputStream(), filePath);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return savedFileName;
    }

    // mail for employee
    private void sendEmployeeWelcomeEmail(Employee employee) {
        User user = employee.getUser();
        String subject = "Congratulations – Welcome to MK Bank!";

        String mailText = "<!DOCTYPE html>"
                + "<html>"
                + "<head>"
                + "<style>"
                + "  body { font-family: Arial, sans-serif; line-height: 1.6; }"
                + "  .container { max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; }"
                + "  .header { background-color: #2196F3; color: white; padding: 10px; text-align: center; border-radius: 10px 10px 0 0; }"
                + "  .content { padding: 20px; }"
                + "  .footer { font-size: 0.9em; color: #777; margin-top: 20px; text-align: center; }"
                + "</style>"
                + "</head>"
                + "<body>"
                + "  <div class='container'>"
                + "    <div class='content'>"
                + "      <p>Dear " + user.getName() + ",</p>"
                + "      <p>We are delighted to inform you that you have been successfully added as a " + employee.getPosition() + " of MK Bank.</p>"
                + "      <p>Your official email is: <b>" + user.getEmail() + "</b></p>"
                + "      <p>You can now log in to the system using your account credentials provided by the admin.</p>"
                + "      <p>We wish you all the best in your new journey with us.</p>"
                + "      <br>"
                + "      <p>Best regards,<br>The HR & Admin Team</p>"
                + "    </div>"
                + "    <div class='footer'>"
                + "      &copy; " + java.time.Year.now() + " MK Bank. All rights reserved."
                + "    </div>"
                + "  </div>"
                + "</body>"
                + "</html>";

        try {
            emailService.sendSimpleEmail(user.getEmail(), subject, mailText);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send congratulation email", e);
        }
    }


    //AuthService from sir

    //token save
    private void saveUserToken(String jwt, User user) {
        Token token = new Token();
        token.setToken(jwt);
        token.setLogout(false);
        token.setUser(user);

        tokenRepository.save(token);

    }


    //remove toke
    private void removeAllTokenByUser(User user) {

        List<Token> validTokens = tokenRepository.findAllTokenByUser(user.getId());

        if (validTokens.isEmpty()) {
            return;
        }
        validTokens.forEach(t -> {
            t.setLogout(true);
        });

        tokenRepository.saveAll(validTokens);

    }

    // It is Login Method
    public AuthenticationResponse authenticate(User request) {
        // Authenticate Username & Password
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        // Fetch User from DB
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Check Activation Status
        if (!user.isActive()) {
            throw new RuntimeException("Account is not activated. Please check your email for activation link.");
        }

        // Generate JWT Token
        String jwt = jwtService.generateToken(user);

        // Remove Existing Tokens (Invalidate Old Sessions)
        removeAllTokenByUser(user);

        // Save New Token to DB (Optional if stateless)
        saveUserToken(jwt, user);

        // Return Authentication Response
        return new AuthenticationResponse(jwt, "User Login Successful");
    }



    //activeUser method (User sktive korar kaj kore)
    public  String activeUser(Long id){

        User user=userRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("User not Found with this ID "+id));

        if(user !=null){
            user.setActive(true);

            userRepository.save(user);
            return "User Activated Successfully!";

        }else {
            return  "Invalid Activation Token!";
        }

    }

    //For Forgot & Reset Password
    // Forgot Password
    public String forgotPassword(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();

            // 1. Token generate
            String token = UUID.randomUUID().toString();
            user.setResetToken(token);

            // 2. Expiry after 15 munites
            Calendar calendar = Calendar.getInstance();
            calendar.add(Calendar.MINUTE, 15);
            Date expiryDate = calendar.getTime();
            user.setTokenExpiry(expiryDate);

            // 3. Save user
            userRepository.save(user);

            // 4. Reset link & email
            String resetLink = "http://localhost:4200/reset-password?token=" + token;
            String mailBody = "<!DOCTYPE html>"
                    + "<html><body>"
                    + "<p>Dear " + user.getName() + ",</p>"
                    + "<p>You requested a password reset. Click the link below to reset your password:</p>"
                    + "<p><a href=\"" + resetLink + "\">Reset Password</a></p>"
                    + "<p>This link will expire in 15 minutes.</p>"
                    + "<p>Best regards,<br>Support Team</p>"
                    + "</body></html>";

            try {
                sendEmail(user.getEmail(), "Password Reset Request", mailBody);
            } catch (MessagingException e) {
                throw new RuntimeException("Failed to send email", e);
            }
            //for test token (email na dekhe consol theke token pabo.)
            System.out.println("Reset Token:--------- " + token);

            return "Reset link sent to your email!";
        }
        return "User not found!";
    }

    // Reset Password
    public String resetPassword(String token, String newPassword) {
        Optional<User> userOpt = userRepository.findByResetToken(token);
        if (userOpt.isPresent()) {
            User user = userOpt.get();

            Date now = new Date();
            if (user.getTokenExpiry() == null || user.getTokenExpiry().before(now)) {
                return "Token expired!";
            }

            user.setPassword(passwordEncoder.encode(newPassword));
            user.setResetToken(null);
            user.setTokenExpiry(null);
            userRepository.save(user);

            return "Password updated successfully!";
        }
        return "Invalid token!";
    }

    // General sendEmail method
    private void sendEmail(String to, String subject, String body) throws MessagingException {
        emailService.sendSimpleEmail(to, subject, body);
    }
}

