import { TestBed } from '@angular/core/testing';

import { HttpInvoiceProviderService } from './http-invoice-provider.service';

describe('HttpInvoiceProviderService', () => {
  let service: HttpInvoiceProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpInvoiceProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
