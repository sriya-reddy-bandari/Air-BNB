import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDeleteRequestPropertyComponent } from './admin-delete-request-property.component';

describe('AdminDeleteRequestPropertyComponent', () => {
  let component: AdminDeleteRequestPropertyComponent;
  let fixture: ComponentFixture<AdminDeleteRequestPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDeleteRequestPropertyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDeleteRequestPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
