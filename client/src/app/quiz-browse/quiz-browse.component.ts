import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { map, switchMap, startWith, debounceTime } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

import { AuthService } from '@auth0/auth0-angular';

import { SearchResponse, QuizService, Match } from '../quiz.service';

@Component({
  selector: 'app-quiz-browse',
  templateUrl: './quiz-browse.component.html',
  styleUrls: ['./quiz-browse.component.scss']
})
export class QuizBrowseComponent implements OnInit {

  minLengthTerm = 2;

  filterForm = new FormControl<string>('');

  filteredTitles: Observable<Match[]>;

  constructor(private router: Router, private quizService : QuizService, public auth: AuthService) {
    this.filteredTitles = this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        switchMap((value : string | null) => {
          if (value) {
            return this.quizService.searchQuiz(value).pipe(
               map((resp: SearchResponse) => resp.data)
              );
          } else {
            return of([]);
          }
        }),
      );
  }
   
  displayFn(item?: Match) : string {
    return item ? item.title : '';
  } 
    
  doQuiz(value : Match) {
    this.router.navigate(['/quiz', value.id]);
  }  
    
  ngOnInit() {
    
  }

}
