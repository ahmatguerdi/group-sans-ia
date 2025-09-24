import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import   { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
  login(): void {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.http.post('http://localhost:3000/auth/login', this.loginForm.value).subscribe({
      next: (res: any) => {
        this.successMessage = 'Connexion réussie !';
        console.log('Token:', res.token);

        // Enregistre le token pour l'utiliser dans addProduct
        localStorage.setItem('token', res.token);

        // Redirection vers le workspace
        this.router.navigate(['/']);

        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erreur serveur';
        this.loading = false;
      },
    });
  }
} 