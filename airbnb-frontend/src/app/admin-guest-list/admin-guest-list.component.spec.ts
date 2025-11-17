import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGuestListComponent } from './admin-guest-list.component';

describe('AdminGuestListComponent', () => {
  let component: AdminGuestListComponent;
  let fixture: ComponentFixture<AdminGuestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminGuestListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminGuestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
