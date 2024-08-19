import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from '@splenta/vezo';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm!: FormGroup;

  submitted = false;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private message: MessageService
  ) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    this.submitted = true;
    // this.router.navigate(['/dashboard']);
    // alert(JSON.stringify(this.loginForm.value));
    this.loginService
      .doLogin(this.loginForm.value)
      .then((res) => {
        if (res) {
          sessionStorage.setItem('token', res.jwt);
          sessionStorage.setItem('refreshToken', res.refreshToken);
          this.router.navigate(['/']);
        } else {
          this.message.add({
            severity: 'error',
            summary: 'Login Error',
            detail: 'Invalid Login, please check credentials',
            life: 3000,
          });
          this.submitted = false;
        }
      })
      .catch((err) => {
        if (err.status === 0) {
          this.message.add({
            severity: 'error',
            summary: 'Login Error',
            detail: 'Check Server Connection',
            life: 3000,
          });
        } else if (err.code === 404) {
          this.message.add({
            severity: 'error',
            summary: 'Login Error',
            detail: 'Check Server Connection',
            life: 3000,
          });
        } else {
          this.message.add({
            severity: 'error',
            summary: 'Login Error',
            detail: err.error.message,
            life: 3000,
          });
        }
        this.submitted = false;
      });
  }
}
