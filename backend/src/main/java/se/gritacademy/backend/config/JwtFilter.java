package se.gritacademy.backend.config;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import se.gritacademy.backend.config.JwtUtil;
import se.gritacademy.backend.entity.user.User;
import se.gritacademy.backend.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public JwtFilter(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String token = extractToken(request);
        if (token != null) {
            User user = getUserFromToken(token);
            String role = jwtUtil.getRoleFromToken(token);
            setAuthentication(user, role);
        }

        filterChain.doFilter(request, response);
    }

    /**
     * HELPER: Extract Bearer token from Authorization header
     */
    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }

    /**
     * HELPER: Validate token and fetch the corresponding user
     */
    private User getUserFromToken(String token) {
        if (!jwtUtil.validateToken(token)) {
            throw new RuntimeException("Invalid JWT token");
        }

        String email = jwtUtil.getEmailFromToken(token);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    /**
     * HELPER: Set authentication in Spring Security context
     */
    private void setAuthentication(User user, String role) {
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(
                        user,
                        null,
                        List.of(new SimpleGrantedAuthority(role))
                );
        SecurityContextHolder.getContext().setAuthentication(auth);
    }
}