import { Component, Input } from '@angular/core';
import { CommentInterface } from '../comments/comments.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent {

  @Input() comment!: CommentInterface
  @Input() replies!: CommentInterface[]
  @Input() isLoggedIn!: boolean
}
