import { TestBed } from '@angular/core/testing';

import { HttpEmployeeProviderService } from './http-employee-provider.service';

describe('HttpEmployeeProviderService', () => {
  let service: HttpEmployeeProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpEmployeeProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
