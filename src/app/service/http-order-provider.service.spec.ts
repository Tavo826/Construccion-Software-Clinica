import { TestBed } from '@angular/core/testing';

import { HttpOrderProviderService } from './http-order-provider.service';

describe('HttpOrderProviderService', () => {
  let service: HttpOrderProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpOrderProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
