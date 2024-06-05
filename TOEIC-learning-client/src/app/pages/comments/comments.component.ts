import { Component, Input, OnInit } from '@angular/core';
import { CommentComponent } from '../comment/comment.component';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CommentService } from '../../services/comment/comment.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule,
    CommentComponent],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})

export class CommentsComponent implements OnInit{

  @Input() currentUserId: number | undefined
  @Input() currentTestId!: number
  isLoggedIn: boolean = false
  comments?: CommentInterface[]
  commentForm!: FormGroup

  constructor(private authService: AuthService,
    private commentService: CommentService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.checkLogin()
    this.getComments()

    this.commentForm = this.fb.group({
      content: ['', Validators.required]
    })
  }

  checkLogin(): boolean {
    return this.authService.getToken() ? true : false
  }

  getComments() {
    this.commentService.getAllCommentsByTest(this.currentTestId).subscribe({
      next: (resp) => {
        this.comments = resp
        console.log(this.comments)
      }
    })
  }
  
  addComment() {
    console.log(this.currentUserId)
    console.log(this.commentForm.get('content')?.value)
    this.commentForm.reset()
  }

}

export interface CommentInterface {
  id: number
  content: string
  date: string
  username: string
  testId: number
  parentId: null | number
  replies: CommentInterface[]
}