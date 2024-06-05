package com.toeic.service.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.toeic.controller.WebSocketController;
import com.toeic.dto.CommentRequest;
import com.toeic.entity.Comment;
import com.toeic.entity.Test;
import com.toeic.entity.User;
import com.toeic.mapper.CommentResponseConverter;
import com.toeic.repository.CommentRepository;
import com.toeic.repository.TestRepository;
import com.toeic.repository.UserRepository;
import com.toeic.service.CommentServcice;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentServciceImpl implements CommentServcice{

	private final CommentRepository commentRepository;
	private final UserRepository userRepository;
	private final TestRepository testRepository;
	private final WebSocketController webSocketController;
	
	@Override
	public ResponseEntity<?> getAllComments() {
		List<Comment> comments = commentRepository.findAll();
		List<Comment> rootComments = new ArrayList<>();
		for (Comment comment : comments) {
			if (comment.getParentComment() == null) {
				rootComments.add(comment);
			}
		}
		// Sắp xếp bình luận theo thời gian giảm dần (từ mới nhất đến cũ nhất)
		Collections.sort(rootComments, (c1, c2) -> c2.getDate().compareTo(c1.getDate()));
		return ResponseEntity.ok(CommentResponseConverter.convertToCommentResponse(rootComments));
	}
	
	@Override
	public ResponseEntity<?> getAllCommentsByTest(Long testId) {
		Optional<Test> optionalTest = testRepository.findById(testId);
		if (optionalTest.isEmpty()) {
			return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
		}
		
		Test test = optionalTest.get();
		List<Comment> comments = commentRepository.findAllByTest(test);
		// Lấy ra toàn bộ bình luận gốc -> lấy replies
		List<Comment> rootComments = new ArrayList<>();
		for (Comment comment : comments) {
			if (comment.getParentComment() == null) {
				rootComments.add(comment);
			}
		}
		// Sắp xếp bình luận theo thời gian giảm dần (từ mới nhất đến cũ nhất)
		Collections.sort(rootComments, (c1, c2) -> c2.getDate().compareTo(c1.getDate()));
		return ResponseEntity.ok(CommentResponseConverter.convertToCommentResponse(rootComments));
	}
	
	@Override
	public ResponseEntity<?> createComment(CommentRequest commentRequest) {
		Optional<User> optionalUser = userRepository.findById(commentRequest.getUserId());
		Optional<Test> optionalTest = testRepository.findById(commentRequest.getTestId());
		if (optionalUser.isEmpty() || optionalTest.isEmpty()) {
			return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
		}
		User user = optionalUser.get();
		Test test = optionalTest.get();
		
		Comment comment = new Comment();
		comment.setContent(commentRequest.getContent());
		comment.setDate(new Date());
		comment.setUser(user);
		comment.setTest(test);
		if (commentRequest.getParentId() != null) {
			Optional<Comment> optionalParentComment = commentRepository.findById(commentRequest.getParentId());
			if (optionalParentComment.isEmpty()) {
				return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
			}
			Comment parentComment = optionalParentComment.get();
			comment.setParentComment(parentComment);
			commentRepository.save(comment);
			
			parentComment.getReplies().add(comment);
			commentRepository.save(parentComment);
			
			// Gửi thông báo real-time đến user nếu có bình luận cha
//			webSocketController.sendNotification(String.valueOf(parentComment.getUser().getId())
//					, user.getFullname() + " vừa trả lời bình luận của bạn!");
			
		} else {
			comment.setParentComment(null);
			commentRepository.save(comment);
		}
		
		return ResponseEntity.ok(null);
	}
}
