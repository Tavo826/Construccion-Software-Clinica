import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminitrativeComponent } from './adminitrative.component';

describe('AdminitrativeComponent', () => {
  let component: AdminitrativeComponent;
  let fixture: ComponentFixture<AdminitrativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminitrativeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminitrativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
