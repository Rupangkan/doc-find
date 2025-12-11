
package com.example.server.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import jakarta.servlet.MultipartConfigElement;
import jakarta.servlet.ServletRegistration;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.util.unit.DataSize;
import org.springframework.context.annotation.Bean;
import jakarta.servlet.DispatcherType;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@Configuration
public class MultipartConfig implements WebMvcConfigurer {

    @Value("${spring.servlet.multipart.max-file-size:200MB}")
    private String maxFileSize;

    @Value("${spring.servlet.multipart.max-request-size:200MB}")
    private String maxRequestSize;

    /**
     * Configure multipart upload settings for Spring Boot 3.x
     */
    @Bean
    public MultipartConfigElement multipartConfigElement() {
        MultipartConfigFactory factory = new MultipartConfigFactory();
        factory.setMaxFileSize(parseDataSize(maxFileSize));
        factory.setMaxRequestSize(parseDataSize(maxRequestSize));
        factory.setLocation("/tmp"); // Temporary file location
        return factory.createMultipartConfig();
    }

    /**
     * Add a filter to handle multipart exceptions gracefully
     */
    @Bean
    public FilterRegistrationBean<OncePerRequestFilter> multipartExceptionFilter() {
        FilterRegistrationBean<OncePerRequestFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new OncePerRequestFilter() {
            @Override
            protected void doFilterInternal(
                    jakarta.servlet.http.HttpServletRequest request,
                    jakarta.servlet.http.HttpServletResponse response,
                    jakarta.servlet.FilterChain filterChain) throws IOException, jakarta.servlet.ServletException {
                try {
                    filterChain.doFilter(request, response);
                } catch (MultipartException e) {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    response.getWriter().write("{\"message\": \"File upload error: \" + e.getMessage() + \". Please ensure the request is properly formatted as multipart/form-data.\"}");
                    response.setContentType("application/json");
                }
            }
        });
        registrationBean.setDispatcherTypes(DispatcherType.REQUEST, DispatcherType.FORWARD);
        return registrationBean;
    }

    private DataSize parseDataSize(String size) {
        if (size == null || size.isEmpty()) {
            return DataSize.ofMegabytes(200);
        }
        
        String trimmed = size.trim().toUpperCase();
        if (trimmed.endsWith("MB")) {
            return DataSize.ofMegabytes(Long.parseLong(trimmed.replace("MB", "").trim()));
        } else if (trimmed.endsWith("KB")) {
            return DataSize.ofKilobytes(Long.parseLong(trimmed.replace("KB", "").trim()));
        } else if (trimmed.endsWith("B")) {
            return DataSize.ofBytes(Long.parseLong(trimmed.replace("B", "").trim()));
        }
        
        try {
            return DataSize.ofBytes(Long.parseLong(trimmed));
        } catch (NumberFormatException e) {
            return DataSize.ofMegabytes(200); // 200MB default
        }
    }
}
