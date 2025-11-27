import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { HttpAuthProviderService } from '../../service/http-auth-provider.service';
import { LoginRequest } from '../../interface/user.models';
import { ErrorComponent } from '../../shared/error/error.component';
import { AuthService } from '../../shared/auth/auth.service';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, LoadingComponent, ErrorComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private readonly formBuilder = inject(FormBuilder)
  httpProvider = inject(HttpAuthProviderService)
  router = inject(Router)
  service = inject(AuthService)

  isSubmitted: boolean = false;
  isLoading: boolean = false;
  showPassword: boolean = false;
  showErrorModal: boolean = false;
  errorTitle: string = "Error en ingreso"
  errorMessage: string = '';

  form = this.formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(6)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  })

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  showError(message: string): void {
    this.errorMessage = message;
    this.showErrorModal = true;
  }

  closeErrorModal(): void {
    this.showErrorModal = false;
    this.errorMessage = '';
  }

  logIn() {

    this.isSubmitted = true

    if (this.form.invalid)  return

    this.isLoading = true;

    let loginData = this.form.value as LoginRequest

    this.httpProvider.logUser(loginData).subscribe({
      next: () => {
        this.isLoading = false
        const role = this.service.getRole()

        if (role == "HUMAN_RESOURCE") {
          this.router.navigate(['Human_Resources'])
        }

        if (role == "ADMINISTRATIVE") {
          this.router.navigate(['Administrative'])
        }

        if (role == "NURSE" || role == "DOCTOR") {
          this.router.navigate(['Medical_Staff'])
        }
        
        this.showError("Token inválido")
      },
      error: err => {
        this.showError(err)
        this.isLoading = false
      }
    })
  }
}
