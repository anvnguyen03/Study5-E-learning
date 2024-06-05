package com.toeic.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.toeic.dto.CommentRequest;
import com.toeic.service.CommentServcice;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class CommentController {
	
	private final CommentServcice commentService;

	@GetMapping("/comments/{test_id}")
	public ResponseEntity<?> getAllCommentsByTest(@PathVariable("test_id") Long testId) {
		return commentService.getAllCommentsByTest(testId);
	}
	
	@PostMapping("/user/comment")
	public ResponseEntity<?> createComment(@RequestBody CommentRequest commentRequest) {
		return commentService.createComment(commentRequest);
	}
}
