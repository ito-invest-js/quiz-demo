import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormGroup, FormBuilder, Validators, FormArray, ValidatorFn, ValidationErrors } from '@angular/forms';

import { Quiz, AllQuizResponse, QuizService, QuestionType } from '../quiz.service';

const questionValidator: ValidatorFn = (control) => {

  if(control.get("type")?.value == QuestionType.Single) {
    // Check only question with single type  
    var answers = control.get("answers") as FormArray;
    if ( answers.length == 2 ) {
      if (answers.at(0).get("isCorrect")?.value ^ answers.at(1)?.get("isCorrect")?.value) {
        // if one of the two anwsers is correct, valid
        return null;
      } else {
        // otherwise not valid
        return {
            'validQuestionError': {
                reason: 'One Answer shall be correct.',
                value: control.value
            }
        };
      }
    } else {
      return null;
    }
  } else {
    // Always valid regarding answers selection
    return null;
  }
}

@Component({
  selector: 'app-quiz-add',
  templateUrl: './quiz-add.component.html',
  styleUrls: ['./quiz-add.component.scss']
})

export class QuizAddComponent implements OnInit {

  form: FormGroup = new FormGroup({});

  constructor(private router: Router, private quizService: QuizService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      title: [null, [Validators.required]],
      author: [''],
      questions: this.fb.array([], Validators.required),
    });
  }
  
  onChangeQuestionType(questionIndex : number, value : number) {
    ((this.questions().at(questionIndex) as FormGroup).controls['answers'] as FormArray).clear();
    this.addAnswer(questionIndex);
    this.addAnswer(questionIndex);
  }
  
  questions(): FormArray {
    return this.form.get("questions") as FormArray
  }
  
  newQuestion(): FormGroup {
    return this.fb.group({
      question: [null, [Validators.required]],
      type: [0],
      answers: this.fb.array([this.fb.group({
          answer: [null, [Validators.required]],
          isCorrect: false,
        }),this.fb.group({
          answer: [null, [Validators.required]],
          isCorrect: false,
        })]),
      }, { validators: questionValidator })
  }
  
  addQuestion(form: any) {
    this.questions().push(this.newQuestion());
  }
  
  removeQuestion(questionIndex:number) {
    this.questions().removeAt(questionIndex);
  }
  
  answers(questionIndex:number) : FormArray {
    return this.questions().at(questionIndex).get("answers") as FormArray
  }
  
  newAnswer(): FormGroup {
    return this.fb.group({
      answer: [null, [Validators.required]],
      isCorrect: false,
    })
  }
  
  addAnswer(questionIndex:number) {
    this.answers(questionIndex).push(this.newAnswer());
  }
  
  removeAnswer(questionIndex:number,answerIndex:number) {
    this.answers(questionIndex).removeAt(answerIndex);
  }

  saveQuiz(form: any) {
    this.quizService.addQuiz(form.value).subscribe(response => {
        console.log(response);
        this.router.navigateByUrl('/quiz-list');
      }, error => {
    });
    
  }

}
