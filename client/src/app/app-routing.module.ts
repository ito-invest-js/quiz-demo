import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@auth0/auth0-angular';

import { QuizListComponent } from './quiz-list/quiz-list.component';
import { QuizAddComponent } from './quiz-add/quiz-add.component';
import { QuizBrowseComponent } from './quiz-browse/quiz-browse.component';
import { QuizComponent } from './quiz/quiz.component';

const routes: Routes = [
    { path: 'quiz-add', component: QuizAddComponent, canActivate: [AuthGuard] },
    { path: 'quiz-list', component: QuizListComponent, canActivate: [AuthGuard] },
    { path: 'quiz-browse', component: QuizBrowseComponent },
    { path: 'quiz/:id', component: QuizComponent },
    { path: '', redirectTo: '/quiz-browse', pathMatch: 'full' },
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
