import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ProductItem {
  category: string; // Para agrupar los productos
  name: string;
  description: string;
  price: string;
  image: string; // Ruta a la imagen del producto
}

@Component({
  selector: 'app-productos-list-section',
  imports: [CommonModule],
  templateUrl: './productos-list-section.component.html',
  styleUrls: ['./productos-list-section.component.css']
})
export class ProductosListSectionComponent implements OnInit {

  products: ProductItem[] = [
    {
      category: 'Cuidado Facial',
      name: 'Kit Facial Hidratante Diario',
      description: 'Set completo de productos para una rutina facial hidratante en casa.',
      price: '$150.000',
      image: '/images/product-facial-kit.jpg' // Asegúrate de tener esta imagen
    },
    {
      category: 'Cuidado Facial',
      name: 'Serum Anti-Manchas Nocturno',
      description: 'Fórmula concentrada para reducir manchas y unificar el tono de la piel.',
      price: '$95.000',
      image: '/images/product-serum-antimanchas.jpg' // Asegúrate de tener esta imagen
    },
    {
      category: 'Cuidado Corporal',
      name: 'Gel Reductor Corporal Intensivo',
      description: 'Ayuda a quemar grasa localizada y reducir medidas con uso constante en casa.',
      price: '$80.000',
      image: '/images/product-gel-reductor.jpg' // Asegúrate de tener esta imagen
    },
    {
      category: 'Cuidado Corporal',
      name: 'Crema Anti-Celulítica Efecto Frío',
      description: 'Mejora la apariencia de la piel de naranja y reafirma la silueta.',
      price: '$75.000',
      image: '/images/product-crema-anticelulitica.jpg' // Asegúrate de tener esta imagen
    },
    {
      category: 'Cuidado Capilar',
      name: 'Shampoo Personalizado',
      description: 'Fórmula única adaptada a las necesidades específicas de tu cabello.',
      price: '$60.000',
      image: '/images/product-shampoo-personalizado.jpg' // Asegúrate de tener esta imagen
    },
    {
      category: 'Cuidado Capilar',
      name: 'Acondicionador Reparador',
      description: 'Repara y nutre el cabello desde la raíz hasta las puntas, aportando brillo.',
      price: '$55.000',
      image: '/images/product-acondicionador-reparador.jpg' // Asegúrate de tener esta imagen
    },
    {
      category: 'Accesorios',
      name: 'Set de Brochas de Maquillaje',
      description: 'Kit esencial de brochas suaves y de alta calidad para un maquillaje perfecto.',
      price: '$120.000',
      image: '/images/product-brochas.jpg' // Asegúrate de tener esta imagen
    },
    {
      category: 'Accesorios',
      name: 'Esponja Aplicadora de Maquillaje',
      description: 'Ideal para una aplicación uniforme y sin esfuerzo de bases y correctores.',
      price: '$25.000',
      image: '/images/product-esponja.jpg' // Asegúrate de tener esta imagen
    },
    {
      category: 'Bolsos',
      name: 'Neceser de Viaje Elegante',
      description: 'Bolso compacto y estiloso para llevar todos tus productos de belleza.',
      price: '$90.000',
      image: '/images/product-neceser.jpg' // Asegúrate de tener esta imagen
    },
    {
      category: 'Maquillaje',
      name: 'Paleta de Sombras Neutras',
      description: 'Variedad de tonos neutros para crear looks de día o de noche.',
      price: '$110.000',
      image: '/images/product-sombras.jpg' // Asegúrate de tener esta imagen
    },
    {
      category: 'Maquillaje',
      name: 'Labial Mate de Larga Duración',
      description: 'Color intenso y acabado mate que permanece intacto por horas.',
      price: '$45.000',
      image: '/images/product-labial-mate.jpg' // Asegúrate de tener esta imagen
    }
    // Agrega más productos aquí según sea necesario
  ];

  constructor() { }

  ngOnInit(): void {
  }
}