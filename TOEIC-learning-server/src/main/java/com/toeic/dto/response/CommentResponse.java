package com.toeic.dto.response;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class CommentResponse {

	private Long id;
	
	private String content;
	
	private Date date;
	
	private String username;
	
	private Long testId;
	
	private Long parentId;
	
	private List<CommentResponse> replies;
}
