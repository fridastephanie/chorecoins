package se.gritacademy.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import se.gritacademy.backend.entity.user.User;
import se.gritacademy.backend.repository.UserRepository;
import se.gritacademy.backend.service.security.TokenBlacklistService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final TokenBlacklistService tokenBlacklistService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getServletPath();
        if (path.startsWith("/api/auth") || path.startsWith("/api/users/register")) {
            filterChain.doFilter(request, response);
            return;
        }
        String token = extractToken(request);
        if (token != null) {
            if (isTokenInvalid(token, response)) {
                return;
            }
            User user = getUserFromToken(token);
            String role = jwtUtil.getRoleFromToken(token);
            setAuthentication(user, role);
        }
        filterChain.doFilter(request, response);
    }

    // ----------------- PRIVATE HELPERS -----------------

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
     * HELPER: Check if token is blacklisted or invalid.
     * If so, send 401 response and return true.
     */
    private boolean isTokenInvalid(String token, HttpServletResponse response) throws IOException {
        if (!jwtUtil.validateToken(token)) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT token");
            return true;
        }
        if (tokenBlacklistService.isTokenBlacklisted(token)) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token has been invalidated (logged out)");
            return true;
        }
        return false;
    }

    /**
     * HELPER: Validate token and fetch the corresponding user
     */
    private User getUserFromToken(String token) {
        Long userId = Long.parseLong(jwtUtil.getUserIdFromToken(token));
        return userRepository.findById(userId)
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