package com.AirBNB.AirBNB.JWT;

import java.io.IOException;
import java.util.Collections;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.AirBNB.AirBNB.Models.JwtToken;
import com.AirBNB.AirBNB.Models.Role;
import com.AirBNB.AirBNB.Repositories.JwtTokenRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class AuthTokenFilter extends OncePerRequestFilter {

	    @Autowired
	    private JwtUtilis jwtUtils;

	    @Autowired
	    private JwtTokenRepository jwtTokenRepository;

	    private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

	    @Override
	    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
	            throws ServletException, IOException {

	        try {
	            String jwt = jwtUtils.getJwtFromHeader(request);

	            if (jwt != null) {
	                JwtToken storedToken = jwtTokenRepository.findByToken(jwt);

	                if (storedToken == null) {
	                    logger.warn("JWT token not found in database. Token might be invalid or revoked.");
	                } else if (jwtUtils.validateJwtToken(jwt)) {

	                    // Extract username and enum role from JWT
	                    String username = jwtUtils.getUserNameFromJwtToken(jwt);
	                    Role roleEnum = jwtUtils.getRoleFromToken(jwt); // Role.ROLE_HOST etc.
	                
	                    if (roleEnum != null) {
	                        // Create SimpleGrantedAuthority with prefix ROLE_
	                        SimpleGrantedAuthority authority =
	                                new SimpleGrantedAuthority(roleEnum.name()); // e.g. ROLE_HOST

	                        UsernamePasswordAuthenticationToken authentication =
	                                new UsernamePasswordAuthenticationToken(
	                                        username, null, Collections.singletonList(authority));

	                        authentication.setDetails(
	                                new WebAuthenticationDetailsSource().buildDetails(request));
                               
	                        SecurityContextHolder.getContext().setAuthentication(authentication);
	                        logger.debug("✅ Authenticated user: {}, Role: {}", username, roleEnum.name());
	                    }
	                }
	            }
	        } catch (Exception e) {
	            logger.error("Cannot set user authentication: {}", e.getMessage(), e);
	        }

	        filterChain.doFilter(request, response);
	    }
	}   
