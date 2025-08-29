import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AlertConfig, AlertPosition, AlertService, appVersion, BaseComponent, PermissionsService, SpinnerType, TokenReq } from '@coder-pioneers/shared';
import { ChangePassword } from '@features/identity-management/contracts/requests/change-password';
import { UserDefinitionsAuthService } from '@features/identity-management/services/user-definitions-auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-change-password-first-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './change-password-first-login.component.html',
  styleUrl: './change-password-first-login.component.scss'
})
export class ChangePasswordFirstLoginComponent extends BaseComponent implements OnInit, OnDestroy {
  @ViewChild('sliderContainer', { static: true }) sliderContainer!: ElementRef;

  Slides: HTMLElement[] = [];
  Nav: HTMLElement[] = [];
  totalSlides: number = 0;
  current: number = 0;
  autoPlay: boolean = true;
  timeTrans: number = 4000;
  IndexElements: number[] = [];
  private intervalSubscription!: Subscription;



  frmChangeUserPassword?: FormGroup;
  passwordForm!: FormGroup;
  hide = true;
  hideConfirm = true;
  currentSlide = 0;
  autoPlayInterval: any;
  id:string | undefined;


constructor(
  private alertService: AlertService,
  spinner: NgxSpinnerService,
  private router: Router,
  private userAuthService:UserDefinitionsAuthService,

  ){
    const config = new AlertConfig();
    config.duration = 5000;
    config.positionY = AlertPosition.Top;
    config.positionX = AlertPosition.Right;

    alertService.setConfig(config);
    super(spinner);
}

ngOnInit(): void {
  this.initSlider();
  this.initEvents();
  this.changeSlide(this.current);
  const userId = sessionStorage.getItem('userId') || null;
  this.passwordForm = new FormGroup({
    userId: new FormControl(userId),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(6)])
  });
}

ngOnDestroy(): void {
  this.intervalSubscription.unsubscribe();
}

initSlider(): void {
  const container = this.sliderContainer.nativeElement as HTMLElement;
  this.Slides = Array.from(container.querySelectorAll('li'));
  this.Nav = Array.from(container.querySelectorAll('nav a'));
  this.setCurret();
}

setCurret(): void {
  this.Slides[this.current].classList.add('current');
  this.Nav[this.current].classList.add('current_dot');
}

initEvents(): void {
  this.Nav.forEach((dot, index) => {
    dot.addEventListener('click', (event) => {
      event.preventDefault();
      this.changeSlide(index);
    });
  });

  this.intervalSubscription = interval(this.timeTrans).subscribe(() => {
    if (this.autoPlay) {
      this.current = (this.current < this.Slides.length - 1) ? this.current + 1 : 0;
      this.changeSlide(this.current);
    }
  });
}

changeSlide(index: number): void {
  this.Nav.forEach(dot => dot.classList.remove('current_dot'));

  this.Slides.forEach(slide => {
    slide.classList.remove('prev', 'current');
    slide.style.display = 'none';
  });

  this.Slides.forEach((slide, i) => {
    if (i < index) {
      slide.classList.add('prev');
      slide.style.display = 'none';
    }
  });

  this.Slides[index].classList.add('current');
  this.Slides[index].style.display = 'block';
  this.Nav[index].classList.add('current_dot');
}


version: string = appVersion;


passwordMatchValidator(group: FormGroup) {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('passwordConfirm')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}

onKeyDown(event: KeyboardEvent) {
  if (event.key === 'Enter' && this.passwordForm.valid) {
    this.onSubmit();
  }
}

login(username: string, password: string) {
  this.showSpinner(SpinnerType.BallScaleMultiple);
  const data = new TokenReq();
  data.usernameOrEmail = username;
  data.password = password;
}

get frmChangeUserPasswordControls() {
  return this.frmChangeUserPassword?.controls;
}

  onSubmit() {
    if (this.passwordForm.invalid) {
      return;
    }

    const changePasswordRequest = new  ChangePassword();
    changePasswordRequest.userId = this.passwordForm.get('userId')?.value;
    changePasswordRequest.newPassword = this.passwordForm.get('password')?.value;
    changePasswordRequest.confirmPassword = this.passwordForm.get('passwordConfirm')?.value;
    (this.userAuthService.userChangePassword(changePasswordRequest))
      .subscribe(result => {
        const errorMessage: string = result?.message || '';
        this.alertService.success(errorMessage);
        this.router.navigate(['/login']);
        this.passwordForm.reset();
      },(errorResponse: HttpErrorResponse) => {
        const errorMessage: string = errorResponse?.error?.message;
        this.alertService.error(errorMessage);
       });

  }

}
