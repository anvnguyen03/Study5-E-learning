package com.toeic.mapper;

import java.util.ArrayList;
import java.util.List;

import com.toeic.dto.response.CommentResponse;
import com.toeic.entity.Comment;

public class CommentResponseConverter {

	public static List<CommentResponse> convertToCommentResponse(List<Comment> comments) {
		List<CommentResponse> commentsResp = new ArrayList<>();
		for (Comment comment : comments) {
			CommentResponse commentResp = new CommentResponse();
			commentResp.setId(comment.getId());
			commentResp.setUsername(comment.getUser().getUsername());
			commentResp.setDate(comment.getDate());
			commentResp.setContent(comment.getContent());
			if (comment.getParentComment() != null) {
				commentResp.setParentId(comment.getParentComment().getId());
			}
			commentResp.setTestId(comment.getId());
			
			List<CommentResponse> commetsRespReplies = new ArrayList<>();
			if (comment.getReplies() != null) {
				commetsRespReplies = convertToCommentResponse(comment.getReplies());
			}
			commentResp.setReplies(commetsRespReplies);
			commentsResp.add(commentResp);
		}
		
		return commentsResp;
	}
}
