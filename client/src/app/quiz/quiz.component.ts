import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, switchMap, map } from 'rxjs';

import { QuizResponse, QuizService, Quiz, Question, Answer, QuestionType } from '../quiz.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {

  quiz$: Observable<Quiz>;

  quiz : Quiz | undefined;
  
  evaluation : string = "";

  constructor(private route: ActivatedRoute, private quizService : QuizService) { 
    this.quiz$ = this.route.params.pipe(
      switchMap((params: Params) => {
        return this.quizService.getQuiz(params['id']).pipe(
               map((resp: QuizResponse) => resp.data)
              );
      })
    );
    this.quiz$.subscribe(val => {
      val.questions.map(q => {
        if(q.type == QuestionType.Single) {
          q.error = true;
        }
      }); // Initialize error state on single questions. TODO : handle this another way.
      this.quiz = val
    });
  }

  changeAnswer(question : Question, answer : Answer, value:boolean) : void {
    answer.isChecked = value;
    if(question.type == QuestionType.Single) {
      if(question.answers[0].isChecked !== question.answers[1].isChecked) {
        question.error = false;
      } else {
        question.error = true;
      }
    }
  }

  evaluateQuiz(): void {
    if(this.quiz) {
      var correct_number = this.quiz ? this.quiz.questions.map(q => q.answers.reduce((a,b) => {if (b.isCorrect === (b.isChecked ? b.isChecked : false)) { return a * 1} else {return 0}}, 1)).reduce((a,b) => a+b , 0) : 0;
      this.evaluation = "You aswered "+correct_number+"/"+this.quiz.questions.length+" question(s) correctly";
    }
  }

  ngOnInit(): void {
  }

}
