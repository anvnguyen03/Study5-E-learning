import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TestService } from '../../services/test/test.service';
import { AuthService } from '../../services/auth.service';
import { CommentService } from '../../services/comment/comment.service';
import { UserService } from '../../services/user/user.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentsComponent } from '../comments/comments.component';
import { CommentComponent } from '../comment/comment.component';
import { CommentFormComponent } from '../comment-form/comment-form.component';

@Component({
  selector: 'app-test-details',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule,
    CommentsComponent, CommentComponent, CommentFormComponent
  ],
  templateUrl: './test-details.component.html',
  styleUrl: './test-details.component.css'
})
export class TestDetailsComponent implements OnInit{

  isTabTestInfo: boolean = true
  isTabSolution: boolean = false
  isTabPractice: boolean = true
  isTabFullTest: boolean = false

  userId: any
  testId: any
  test: any
  comments: any
  isLoggedIn: boolean = false

  parentId: any
  content: any

  constructor(private testService: TestService,
    private authService: AuthService,
    private commentService: CommentService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {}
  
  ngOnInit() {
    this.isLoggedIn = this.checkLogin()
    this.route.params.subscribe(params => { this.testId = params['id'] })
    this.parentId = null
    this.content = null
    this.userId = this.authService.getUserId()

    this.getTest()
  }

  getTest() {
    this.testService.getById(this.testId).subscribe({
      next: (resp) => {
        this.test = resp
      }
    })
  }

  checkLogin(): boolean {
    return this.authService.getToken() ? true : false
  }

  switchTabInfo() {
    this.isTabTestInfo = !this.isTabTestInfo
    this.isTabSolution = !this.isTabSolution
  }

  switchTakeTestTab() {
    this.isTabPractice = !this.isTabPractice
    this.isTabFullTest = !this.isTabFullTest
  }

}
