    import { Component, OnInit } from '@angular/core';
    import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
    import { CommonModule } from '@angular/common';
    import { Router, ActivatedRoute } from '@angular/router'; // Importar ActivatedRoute
    import Swal from 'sweetalert2';

    @Component({
      selector: 'app-admin-panel-acces',
      standalone: true,
      imports: [CommonModule, ReactiveFormsModule],
      templateUrl: './admin-panel-access.component.html',
      styleUrls: ['./admin-panel-access.component.css']
    })
    export class AdminAccessPanelComponent implements OnInit {
      adminAccessForm: FormGroup;
      errorMessage: string | null = null;
      redirectUrl: string = ''; // URL a la que se redirigirá después del acceso
      
      // Credenciales de administrador HARCODED (¡VER NOTA DE SEGURIDAD ABAJO!)
      private ADMIN_EMAIL = 'admin@miestetica.com'; 
      private ADMIN_PASSWORD = 'adminpassword'; 

      constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute // Para obtener parámetros de la URL
      ) {
        this.adminAccessForm = this.fb.group({
          email: ['', [Validators.required, Validators.email]],
          password: ['', Validators.required]
        });
      }

      ngOnInit(): void {
        // Al inicializar, obtenemos la URL a la que el usuario quería ir
        this.route.queryParams.subscribe(params => {
          this.redirectUrl = params['redirectTo'] || '/admin-registration'; // Por defecto al home del dashboard
        });

        // Verificar si ya tiene acceso temporal concedido en esta sesión
        if (sessionStorage.getItem('adminRegistrationAccess') === 'true') {
          this.router.navigateByUrl(this.redirectUrl); // Si ya tiene acceso, redirigir directamente
        }
      }

      onSubmit(): void {
        this.errorMessage = null;

        if (this.adminAccessForm.valid) {
          const { email, password } = this.adminAccessForm.value;

          if (email === this.ADMIN_EMAIL && password === this.ADMIN_PASSWORD) {
            // Credenciales correctas: Conceder acceso temporal
            sessionStorage.setItem('adminRegistrationAccess', 'true');
            Swal.fire({
              title: "Acceso Concedido",
              text: "Ahora puedes registrar personal. Serás redirigido.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false
            }).then(() => {
              this.router.navigateByUrl(this.redirectUrl); // Redirigir a la URL original
            });
          } else {
            // Credenciales incorrectas
            this.errorMessage = 'Credenciales de administrador incorrectas.';
            Swal.fire({
              title: "Acceso Denegado",
              text: "Correo o contraseña de administrador incorrectos.",
              icon: "error"
            });
          }
        } else {
          this.errorMessage = 'Por favor, ingresa el correo y la contraseña de administrador.';
          this.adminAccessForm.markAllAsTouched();
        }
      }
    }
    