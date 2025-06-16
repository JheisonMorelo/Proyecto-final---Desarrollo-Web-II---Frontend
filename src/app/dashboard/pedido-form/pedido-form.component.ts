import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
// Importa las interfaces y servicios
import { Pedido, PedidoService, PedidoUpdateInput, ClientPedidoInput } from '../../services/Pedido/pedido-service.service';
import { ProductoService } from '../../services/Producto/producto-service.service'; // Asumo que tienes ProductoService
import { Producto } from '../../services/Cita/cita-service.service';
import { AuthService, UserData } from '../../services/auth/auth.service';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../../services/Cita/cita-service.service'; // Reutilizar ApiResponse

interface SelectedProduct {
  codigo: string;
  nombre: string;
  precio: number;
  cantidad: number;
}

@Component({
  selector: 'app-pedido-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './pedido-form.component.html',
  styleUrls: ['./pedido-form.component.css']
})
export class PedidoFormComponent implements OnInit {
  @Input() pedidoToEdit: Pedido | null = null;
  @Output() formSubmitted = new EventEmitter<void>();
  @Output() formCancelled = new EventEmitter<void>();

  pedidoForm: FormGroup;
  productosDisponibles: Producto[] = [];
  
  selectedProducts: SelectedProduct[] = []; 
  totalCostoProductos: number = 0; 
  
  authenticatedClientCedula: string | null = null;
  authenticatedClientName: string | null = null;

  constructor(
    private fb: FormBuilder,
    private pedidoService: PedidoService,
    private productoService: ProductoService,
    private authService: AuthService
  ) {
    this.pedidoForm = this.fb.group({
      // Eliminamos 'codigo', 'idCliente', 'idAsistenteVentas', 'estado' del formulario para el cliente
      direccion: ['', [Validators.required, Validators.maxLength(255)]],
      fechaRegistro: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    // Solo necesitamos cargar los productos disponibles
    this.productoService.getAllProductos().pipe(map((res: ApiResponse<Producto[]>) => res.data))
    .subscribe({
      next: (productosData) => {
        this.productosDisponibles = productosData;

        // Obtener datos del cliente autenticado para mostrar en el encabezado si es necesario
        this.authService.currentUser$.subscribe((user: UserData | null) => { 
          this.authService.userRole$.subscribe(role => {
            if (user && role === 'cliente') { 
              this.authenticatedClientCedula = user.cedula;
              this.authenticatedClientName = user.nombre;
            }
          });
        });

        if (this.pedidoToEdit) {
          this.patchFormForEdit();
        } else {
          // Si es un nuevo pedido, aseguramos que la fecha mínima sea hoy
          const today = new Date();
          const year = today.getFullYear();
          const month = (today.getMonth() + 1).toString().padStart(2, '0');
          const day = today.getDate().toString().padStart(2, '0');
          const hours = today.getHours().toString().padStart(2, '0');
          const minutes = today.getMinutes().toString().padStart(2, '0');
          const minDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
          
          this.pedidoForm.patchValue({
            fechaRegistro: minDateTime
          });
        }
      },
      error: (err) => {
        console.error('Error al cargar datos para el formulario de pedido:', err);
        Swal.fire('Error', 'No se pudieron cargar los datos necesarios para el formulario de pedido.', 'error');
      }
    });
  }

  patchFormForEdit(): void {
    if (this.pedidoToEdit) {
      this.pedidoForm.patchValue({
        direccion: this.pedidoToEdit.direccion,
        fechaRegistro: this.pedidoToEdit.fechaRegistro ? new Date(this.pedidoToEdit.fechaRegistro).toISOString().slice(0, 16) : '',
      });
      
      // Pre-seleccionar los productos existentes en el pedido
      if (this.pedidoToEdit.productos && this.pedidoToEdit.productos.length > 0) {
        this.selectedProducts = this.pedidoToEdit.productos.map(p => ({
          codigo: p.codigo,
          nombre: p.nombre,
          precio: p.precio || 0, // Asegurar que precio no sea undefined
          cantidad: p.pivot.numProductos // La cantidad viene del pivote
        }));
        this.calculateTotalCost();
      }
    }
  }

  onProductSelected(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedCodigo = selectElement.value;
    const selectedProducto = this.productosDisponibles.find(p => p.codigo === selectedCodigo);

    // Añadir producto si existe y no está ya seleccionado, o si está, actualizar cantidad
    if (selectedProducto) {
      const existingProduct = this.selectedProducts.find(sp => sp.codigo === selectedCodigo);
      if (existingProduct) {
        existingProduct.cantidad++; // Incrementar cantidad si ya está
      } else {
        this.selectedProducts.push({
          codigo: selectedProducto.codigo,
          nombre: selectedProducto.nombre,
          precio: selectedProducto.precio || 0,
          cantidad: 1 // Cantidad inicial de 1
        });
      }
      this.calculateTotalCost();
    }
    selectElement.value = ''; // Resetear la selección del dropdown
  }

  updateProductQuantity(index: number, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let newQuantity = parseInt(inputElement.value, 10);
    if (isNaN(newQuantity) || newQuantity < 1) {
      newQuantity = 1; // Asegurar que la cantidad mínima sea 1
    }
    this.selectedProducts[index].cantidad = newQuantity;
    this.calculateTotalCost();
  }

  removeProduct(index: number): void {
    this.selectedProducts.splice(index, 1);
    this.calculateTotalCost();
  }

  calculateTotalCost(): void {
    this.totalCostoProductos = this.selectedProducts.reduce((sum, item) => sum + (item.precio * item.cantidad || 0), 0);
  }

  get f() { return this.pedidoForm.controls; }

  shouldShowProductSelectionError(): boolean {
    return this.selectedProducts.length === 0 && (this.pedidoForm.touched || this.pedidoForm.dirty);
  }

  onSubmit(): void {
    if (this.pedidoForm.invalid || this.selectedProducts.length === 0) {
      this.pedidoForm.markAllAsTouched();
      if (this.selectedProducts.length === 0) {
        this.pedidoForm.markAsDirty();
        this.pedidoForm.markAsTouched();
      }
      Swal.fire('Error de Validación', 'Por favor, completa la dirección, la fecha y selecciona al menos un producto.', 'error');
      return;
    }

    const formValues = this.pedidoForm.getRawValue();
    const productsToSend = this.selectedProducts.map(p => ({
      codigo: p.codigo,
      cantidad: p.cantidad
    }));

    let request$: Observable<any>;
    if (this.pedidoToEdit) {
      const fullUpdateData: PedidoUpdateInput = {
          codigo: this.pedidoToEdit.codigo,
          idCliente: this.pedidoToEdit.idCliente,
          idAsistenteVentas: this.pedidoToEdit.idAsistenteVentas, // Mantenemos el valor existente
          direccion: formValues.direccion,
          fechaRegistro: formValues.fechaRegistro,
          estado: this.pedidoToEdit.estado, // Estado no editable por el cliente aquí
          costoTotal: this.totalCostoProductos, // Recalcular el costo total
          productos_con_cantidades: productsToSend // Pasar los productos con cantidades
      };
      request$ = this.pedidoService.updatePedido(fullUpdateData);

    } else {
      const clientPedidoData: ClientPedidoInput = {
        direccion: formValues.direccion,
        fechaRegistro: formValues.fechaRegistro,
        productos_con_cantidades: productsToSend
      };
      request$ = this.pedidoService.createClientPedido(clientPedidoData);
    }

    request$.subscribe({
      next: (response) => {
        Swal.fire('Éxito', response.message, 'success');
        this.formSubmitted.emit();
        this.resetForm();
      },
      error: (error) => {
        console.error('Error al guardar pedido:', error);
        let errorMessage = 'Ocurrió un error al guardar el pedido.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
            errorMessage = error.message;
        }
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }

  onCancel(): void {
    this.formCancelled.emit();
    this.resetForm();
  }

  private resetForm(): void {
    this.pedidoForm.reset();
    this.selectedProducts = []; 
    this.totalCostoProductos = 0;
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const hours = today.getHours().toString().padStart(2, '0');
    const minutes = today.getMinutes().toString().padStart(2, '0');
    const minDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

    this.pedidoForm.patchValue({
      fechaRegistro: minDateTime,
      estado: 'Pendiente' // Aseguramos que el estado por defecto se restablezca si se estaba editando
    });

    this.authService.currentUser$.subscribe((user: UserData | null) => { 
        this.authService.userRole$.subscribe(role => {
            if (user && role === 'cliente') {
                this.authenticatedClientCedula = user.cedula;
                this.authenticatedClientName = user.nombre;
            }
        });
    });
  }

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
