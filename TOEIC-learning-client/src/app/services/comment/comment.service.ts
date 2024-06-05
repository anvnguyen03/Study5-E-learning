import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private baseUrl = 'http://localhost:8080/api/v1/comments'

  constructor(private httpClient: HttpClient) { }

  getAllCommentsByTest(testId: number): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/${testId}`)
  }

}
