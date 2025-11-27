import { TestBed } from '@angular/core/testing';

import { HttpPatientProviderService } from './http-patient-provider.service';

describe('HttpPatientProviderService', () => {
  let service: HttpPatientProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpPatientProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
