import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPendingPropertiesComponent } from './admin-pending-properties.component';

describe('AdminPendingPropertiesComponent', () => {
  let component: AdminPendingPropertiesComponent;
  let fixture: ComponentFixture<AdminPendingPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPendingPropertiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPendingPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
