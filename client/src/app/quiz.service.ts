import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { environment } from './../environments/environment';

export interface SimpleResponse {
  message: string;
}

export interface Match {
  id : string,
  title: string
}

export interface SearchResponse {
  message: string;
  data : Match[];
}

export interface AllQuizResponse {
  message: string;
  data : Quiz[];
}

export interface QuizResponse {
  message: string;
  data : Quiz;
}

export interface Answer {
  answer: string;
  isCorrect: boolean;
  isChecked: boolean;
}

export enum QuestionType {
  Single,
  Multiple,
}

export interface Question {
  question: string;
  type: QuestionType;
  answers: Array<Answer>;
  error: boolean;
}

export interface Quiz {
  id: string;
  author: string;
  title: string;
  questions: Array<Question>;
}

@Injectable({
  providedIn: 'root'
})

export class QuizService {

  apiURL = environment.backend;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) { }

  getAllQuiz(): Observable<AllQuizResponse> {
    return this.http
      .get<AllQuizResponse>(this.apiURL + '/quiz')
      .pipe(retry(1), catchError(this.handleError));
  }
  
  getQuiz(id : string): Observable<QuizResponse> {
    return this.http
      .get<QuizResponse>(this.apiURL + '/quiz/'+id)
      .pipe(retry(1), catchError(this.handleError));
  }
  
  searchQuiz(title : string): Observable<SearchResponse> {
    return this.http
      .get<SearchResponse>(this.apiURL + '/quiz/title/'+title)
      .pipe(retry(1), catchError(this.handleError));
  }
  
  getAllMyQuiz(): Observable<AllQuizResponse> {
    return this.http
      .get<AllQuizResponse>(this.apiURL + '/secure/quiz')
      .pipe(retry(1), catchError(this.handleError));
  }
  
  addQuiz(input : Quiz) {
    return this.http
      .post<SimpleResponse>(this.apiURL + '/secure/quiz/', input)
      .pipe(retry(1), catchError(this.handleError));
  }
  
  deleteQuiz(id : string) {
    return this.http
      .delete<SimpleResponse>(this.apiURL + "/secure/quiz/" + id)
      .pipe(retry(1), catchError(this.handleError));
  }
  
  // Error handling
  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}
