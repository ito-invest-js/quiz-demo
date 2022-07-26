import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizBrowseComponent } from './quiz-browse.component';

describe('QuizBrowseComponent', () => {
  let component: QuizBrowseComponent;
  let fixture: ComponentFixture<QuizBrowseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuizBrowseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
