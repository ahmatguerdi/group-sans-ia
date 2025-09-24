import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-inscription',
  imports: [RouterLink, ReactiveFormsModule, ReactiveFormsModule, HttpClientModule, NgIf],
  templateUrl: './inscription.html',
  styleUrl: './inscription.css',
})
export class Inscription implements OnInit {
  registerForm!: FormGroup;
  verifyForm!: FormGroup;

  // Etats du composant
  currentView: 'register' | 'verify' = 'register';
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  otpToken = '';
  userEmail = '';
  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.verifyForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    });
  }

  register(): void {
    if (this.registerForm.invalid) {
      console.log('formulaire valide , donnée envoyée:', this.registerForm.value);

      this.http.post('http://localhost:3000/auth/register', this.registerForm.value).subscribe({
        next: (res: any) => {
          console.log('Inscription réussie', res);
          this.otpToken = res.otpToken;
          this.userEmail = res.email;
          this.currentView = 'verify';
          this.successMessage = `Un code de vérification a été envoyé à ${res.email}`;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erreur', err.error || err);
          this.errorMessage = err.error?.message || "Une erreur est survenue lors de l'inscription";
          this.isLoading = false;
        },
      });
    }
  }

  verifyEmail(): void {
    if (this.verifyForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';

    const verificationData = {
      otp: this.verifyForm.value.otp,
      otpToken: this.otpToken,
    };
    this.http.patch('http://localhost:3000/auth/verify-email', verificationData).subscribe({
      next: (res: any) => {
        console.log('Email vérifié avec succès', res);
        this.successMessage =
          'Votre email a été vérifié avec succès! Vous pouvez maintenant vous connecter.';
        // Rediriger vers la page de connexion après un délai
        setTimeout(() => {
          // Ici vous pouvez rediriger vers la page de login
          this.router.navigate(['/login']);
        }, 3000);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur de vérification', err.error || err);
        this.errorMessage = err.error?.message || 'Code de vérification invalide';
        this.isLoading = false;
      },
    });
  }
  switchToLogin(): void {
    this.router.navigate(['/login']);
  }
  }



