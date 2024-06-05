package com.toeic.service;

import com.toeic.dto.SignInRequest;
import com.toeic.dto.SignUpRequest;
import com.toeic.dto.ValidateTokenRequest;
import com.toeic.dto.response.JwtAuthenticationResponse;
import com.toeic.entity.User;

public interface AuthenticationService {
	User signup(SignUpRequest signUpRequest);
	JwtAuthenticationResponse signin(SignInRequest signInRequest);
	Boolean validateToken(ValidateTokenRequest token);
}
