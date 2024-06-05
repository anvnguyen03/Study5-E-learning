package com.toeic.service;


import org.springframework.http.ResponseEntity;

import com.toeic.dto.TestRequest;

public interface TestService {
	ResponseEntity<?> getAll(String title, int page, int size);
	ResponseEntity<?> getByCategory(String catename, String title,int page, int size);
	ResponseEntity<?> getById(long id);
	ResponseEntity<?> createTest(TestRequest testDto);
	ResponseEntity<?> updateTest(TestRequest testDto);
	ResponseEntity<?> deleteTest(TestRequest testDto);
	ResponseEntity<?> getAllNoPagin();
	ResponseEntity<?> changeStatus(long id);
}
