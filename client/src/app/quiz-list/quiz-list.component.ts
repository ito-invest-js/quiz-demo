import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ClipboardService } from 'ngx-clipboard';

import { Quiz, AllQuizResponse, QuizService } from '../quiz.service';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.scss']
})
export class QuizListComponent implements OnInit {

  quiz: Quiz[] = [];
  error: any;

  constructor(private quizService : QuizService, private clipboardApi: ClipboardService) { }

  ngOnInit(): void {
    this.quizService.getAllMyQuiz().subscribe((resp: AllQuizResponse) => {
      this.quiz = resp.data;
    });
  }
  
  deleteQuiz(id : string) {
    this.quizService.deleteQuiz(id).subscribe((resp: any) => {
      this.quizService.getAllMyQuiz().subscribe((resp: AllQuizResponse) => {
        this.quiz = resp.data;
      });
    });
  }
  
  copyQuizLink(id : string) {
    this.clipboardApi.copyFromContent('https://ide-test.ross128.lu/quiz/'+id);
    window.alert('Quiz link is in your clipboard !');
  }
  
}