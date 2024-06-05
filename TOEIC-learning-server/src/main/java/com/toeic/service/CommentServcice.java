package com.toeic.service;

import org.springframework.http.ResponseEntity;

import com.toeic.dto.CommentRequest;

public interface CommentServcice {

	ResponseEntity<?> getAllCommentsByTest(Long testId);

	ResponseEntity<?> createComment(CommentRequest commentRequest);

	ResponseEntity<?> getAllComments();

}
