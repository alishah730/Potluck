package com.example.potluck;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.ArrayUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.util.WebUtils;

import com.ge.magmon.config.GeNetworkSettings;
import com.ge.magmon.config.SessionCheckInterceptor;


/**
 * This is a Javadoc comment
 * @author 502688796
 */
@SpringBootApplication(scanBasePackages = {"" })
@EnableOAuth2Sso
@EnableAutoConfiguration
@Configuration
@ComponentScan({""})
public class BayWatchApplication extends WebSecurityConfigurerAdapter {

	
	@Autowired
	private Environment environment;
	
	@Autowired(required=false)
	private GeNetworkSettings geNetworkSettings;
	
	@Autowired
	private SessionCheckInterceptor sessionCheckInterceptor;
     
	
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		
		
		// @formatter:off		
		http	
		.logout().logoutRequestMatcher(new AntPathRequestMatcher("/logout")).logoutSuccessUrl("/login")
		.and()
			.antMatcher("/**")
				.authorizeRequests()								
					.anyRequest().authenticated()		
			.and().csrf().csrfTokenRepository(csrfTokenRepository())			
			.and().addFilterAfter(csrfHeaderFilter(), CsrfFilter.class);
		// @formatter:on
	}

	private Filter csrfHeaderFilter() {
		return new OncePerRequestFilter() {
			@Override
			protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,FilterChain filterChain) throws ServletException, IOException {
				CsrfToken csrf = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
				if (csrf != null) {
					Cookie cookie = WebUtils.getCookie(request, "XSRF-TOKEN");
					String token = csrf.getToken();
					if (cookie == null || token != null && (!token.equals(cookie.getValue()))) {
						cookie = new Cookie("XSRF-TOKEN", token);
						cookie.setPath(request.getContextPath());		
						if(!ArrayUtils.contains(environment.getActiveProfiles(), "local")) {
							cookie.setSecure(true);
							cookie.setHttpOnly(true);
						}
						response.addCookie(cookie);
					}
				}
				filterChain.doFilter(request, response);
			}
		};
	}

	private CsrfTokenRepository csrfTokenRepository() {
		HttpSessionCsrfTokenRepository repository = new HttpSessionCsrfTokenRepository();
		repository.setHeaderName("X-XSRF-TOKEN");
		return repository;
	}
	
	
	/**
	 * @param registry
	 * 
	 */
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(sessionCheckInterceptor);
    }
	
    /**
	 * @param args
	 * 
	 */
	public static void main(String[] args) {
		SpringApplication.run(BayWatchApplication.class, args);
	}
}
