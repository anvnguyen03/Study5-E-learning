package com.toeic.entity;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "comment")
@NoArgsConstructor
@AllArgsConstructor
public class Comment implements Serializable{
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	private String content;
	
	private Date date;
	
	@ManyToOne
	@JoinColumn(name = "user_id", nullable = false)
	private User user;
	
	@ManyToOne
	@JoinColumn(name = "test_id", nullable = false)
	@JsonIgnore
	private Test test;
	
	@JsonBackReference
	@ManyToOne
	@JoinColumn(name = "parent_id", nullable = true)
	private Comment parentComment;
	
	@JsonManagedReference
	@OneToMany(mappedBy = "parentComment")
	private List<Comment> replies;
	
//	public CommentResponse getDto() {
//		CommentResponse cmtDto = new CommentResponse();
//		cmtDto.setId(id);
//		cmtDto.setContent(content);
//		cmtDto.setDate(date);
//		cmtDto.setUsername(user.getUsername());
//		cmtDto.setTestId(test.getId());
//		List<CommentResponse> cmtRepliesDto = new ArrayList<>();
//		
//		return cmtDto;
//	}
}
