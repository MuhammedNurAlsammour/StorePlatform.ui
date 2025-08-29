import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangePasswordFirstLoginComponent } from './change-password-first-login.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('ChangePasswordFirstLoginComponent', () => {
  let component: ChangePasswordFirstLoginComponent;
  let fixture: ComponentFixture<ChangePasswordFirstLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePasswordFirstLoginComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ someParam: 'someValue' }), 
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordFirstLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Add additional tests as needed
});
