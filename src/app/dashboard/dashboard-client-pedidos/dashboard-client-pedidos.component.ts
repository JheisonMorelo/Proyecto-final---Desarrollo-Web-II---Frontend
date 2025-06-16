import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // Importar DatePipe
import { Pedido, PedidoService } from '../../services/Pedido/pedido-service.service'; // Importar PedidoService y Pedido
import { AuthService } from '../../services/auth/auth.service'; // Para obtener el rol del cliente
import Swal from 'sweetalert2'; // Para notificaciones
import { PedidoFormComponent } from '../pedido-form/pedido-form.component'; // <-- NUEVO: Importar el formulario

@Component({
  selector: 'app-dashboard-client-pedidos',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe, // Importar DatePipe
    PedidoFormComponent // Importar el componente del formulario
  ],
  templateUrl: './dashboard-client-pedidos.component.html',
  styleUrls: ['./dashboard-client-pedidos.component.css']
})
export class DashboardClientPedidosComponent implements OnInit {

  pedidos: Pedido[] = []; 
  loading: boolean = true;    
  error: string | null = null; 
  userRole: string | null = null; 

  showPedidoForm: boolean = false;
  pedidoToEdit: Pedido | null = null;

  constructor(
    private pedidoService: PedidoService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.userRole$.subscribe(role => {
      this.userRole = role;
      if (this.userRole === 'cliente') {
        this.loadClientPedidos();
      } else {
        this.loading = false;
        this.error = 'No tienes permiso para ver esta sección o no eres un cliente.';
        Swal.fire('Acceso Denegado', this.error, 'warning');
      }
    });
  }

  private loadClientPedidos(): void {
    this.loading = true;
    this.error = null;

    this.pedidoService.getClientPedidos().subscribe({
      next: (response) => {
        this.pedidos = response.data || []; 
        this.loading = false; 
        console.log('Pedidos del cliente cargados:', this.pedidos);
        if (this.pedidos.length === 0 && response.message === 'No se encontraron pedidos para este cliente') {
            console.log('Cliente sin pedidos, mostrando mensaje informativo.');
        }
      },
      error: (err) => {
        console.error('Error real al cargar los pedidos del cliente:', err);
        this.error = 'Ocurrió un problema al cargar tus pedidos. Por favor, inténtalo de nuevo más tarde.';
        this.loading = false;
        Swal.fire('Error de Carga', 'No se pudieron cargar tus pedidos.', 'error');
      }
    });
  }

  addNewPedido(): void {
    this.pedidoToEdit = null;
    this.showPedidoForm = true;
  }

  editPedido(pedido: Pedido): void {
    this.pedidoToEdit = pedido;
    this.showPedidoForm = true;
  }

  onFormSubmitted(): void {
    this.showPedidoForm = false;
    this.loadClientPedidos();
  }

  onFormCancelled(): void {
    this.showPedidoForm = false;
    this.pedidoToEdit = null;
  }

  /**
   * Método para eliminar un pedido.
   * Utiliza SweetAlert2 para la confirmación y para mostrar mensajes de éxito/error.
   * Llama al servicio PedidoService para realizar la eliminación en el backend.
   * @param codigo El código del pedido a eliminar.
   */
  deletePedido(codigo: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Estás a punto de eliminar el pedido con código ${codigo}. Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.pedidoService.deletePedido(codigo).subscribe({
          next: (response) => {
            Swal.fire('Eliminado', response.message, 'success');
            this.loadClientPedidos(); // Recargar la lista después de eliminar
          },
          error: (err) => {
            console.error('Error al eliminar pedido:', err);
            let errorMessage = 'No se pudo eliminar el pedido.';
            if (err.error && err.error.message) {
              errorMessage = err.error.message;
            }
            Swal.fire('Error', errorMessage, 'error');
          }
        });
      }
    });
  }

  // Función para formatear el costo total
  formatCost(cost: number): string {
    if (cost === undefined || cost === null) {
      return 'N/A';
    }
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(cost);
  }
}
