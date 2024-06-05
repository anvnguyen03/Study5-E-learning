package com.toeic.dto;

import lombok.Data;

@Data
public class CommentRequest {
	private String content;
	
	private Long userId;
	
	private Long parentId;
	
	private Long testId;
}
