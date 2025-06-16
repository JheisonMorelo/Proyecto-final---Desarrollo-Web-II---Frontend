import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// Asegúrate de que estas rutas sean correctas para tus servicios
import { Especialista, EspecialistaService } from '../../../services/Especialista/especialista-service.service';
import { RecepcionistaService } from '../../../services/Recepcionista/recepcionista-service.service';
import { AsistenteVentas, AsistenteService } from '../../../services/Asistente/asistente-service.service';
import { Recepcionista } from '../../../services/Cita/cita-service.service';

// Las interfaces Especialista, Recepcionista, AsistenteVentas deben seguir existiendo
// en sus respectivos archivos de servicio o en un archivo de modelos compartido.

@Component({
  selector: 'app-team-section',
  standalone: true, // Asegúrate de que sea standalone si no está en un módulo
  imports: [CommonModule],
  templateUrl: './team-section.component.html',
  styleUrls: ['./team-section.component.css']
})
export class TeamSectionComponent implements OnInit {

  // Definimos los tipos de las propiedades del componente utilizando tipos de intersección
  // Esto indica que el array contendrá objetos que son del tipo original del backend
  // MÁS las propiedades adicionales que les agregamos en el método map.
  especialistas: (Especialista & { borderColor: string })[] = [];
  recepcionistas: (Recepcionista & { borderColor: string; rolDisplay: string; })[] = [];
  asistentesVentas: (AsistenteVentas & { borderColor: string; rolDisplay: string; })[] = [];

  constructor(
    private especialistaService: EspecialistaService,
    private recepcionistaService: RecepcionistaService,
    private asistenteVentasService: AsistenteService
  ) { }

  ngOnInit(): void {
    this.loadTeamMembers();
  }

  private loadTeamMembers(): void {
    // Cargar Especialistas
    this.especialistaService.getAllEspecialistas().subscribe({
      next: (response: { message: string, data: Especialista[] }) => {
        this.especialistas = response.data.map(e => ({
          ...e, // Copia todas las propiedades del Especialista del backend
          borderColor: 'border-primary' // Asigna el color del borde específico para especialistas
        }));
      },
      error: (error) => {
        console.error('Error al cargar especialistas:', error);
      }
    });

    // Cargar Recepcionistas
    this.recepcionistaService.getAllRecepcionistas().subscribe({
      next: (response: { message: string, data: Recepcionista[] }) => {
        this.recepcionistas = response.data.map(r => ({
          ...r, // Copia todas las propiedades del Recepcionista del backend
          borderColor: 'border-pink', // Asigna el color del borde específico para recepcionistas
          rolDisplay: 'Recepcionista' // Asigna un rol de visualización fijo
        }));
      },
      error: (error) => {
        console.error('Error al cargar recepcionistas:', error);
      }
    });

    // Cargar Asistentes de Ventas
    this.asistenteVentasService.getAllAsistentesVentas().subscribe({
      next: (response: { message: string, data: AsistenteVentas[] }) => {
        this.asistentesVentas = response.data.map(a => ({
          ...a, // Copia todas las propiedades del AsistenteVentas del backend
          borderColor: 'border-success', // Asigna el color del borde específico para asistentes de ventas
          rolDisplay: 'Asistente de Ventas' // Asigna un rol de visualización fijo
        }));
      },
      error: (error) => {
        console.error('Error al cargar asistentes de ventas:', error);
      }
    });
  }
}
