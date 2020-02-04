package com.openhome.config;


import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class SimpleCORSFilter implements Filter {
	
	private final Logger logger = LoggerFactory.getLogger(SimpleCORSFilter.class);
	
	 public SimpleCORSFilter() {
		// TODO Auto-generated constructor stub
		logger.info("%%%%%%%%%%%%%%%%%%%%%%%%%%%5 SIMPLE CORS FILTER INTILIALIZED");
	}
    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;
//System.out.println("!!!!!!!!!!!!!!!!!!!!!!request"+request.getHeader("Origin"));
//System.out.println("!!!!!!!!!!!!!!!!!!!!!!request"+request.getHeader("origin"));
        response.setHeader("Access-Control-Allow-Origin",request.getHeader("Origin"));
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Allow-Methods", "POST,GET,PUT,OPTIONS,DELETE");
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setHeader("Access-Control-Allow-Headers", "Origin,Content-Type, Accept, X-Requested-With, remember-me");

//        chain.doFilter(req, res);
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
        } else {
            chain.doFilter(req, res);
        }
    }

    @Override
    public void init(FilterConfig filterConfig) {
    }

    @Override
    public void destroy() {
    }
}
