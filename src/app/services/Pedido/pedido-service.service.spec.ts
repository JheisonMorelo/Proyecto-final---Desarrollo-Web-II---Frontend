import { TestBed } from '@angular/core/testing';

import { PedidoServiceService } from '../../pedido-service.service';

describe('PedidoServiceService', () => {
  let service: PedidoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PedidoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
