import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHostListComponent } from './admin-host-list.component';

describe('AdminHostListComponent', () => {
  let component: AdminHostListComponent;
  let fixture: ComponentFixture<AdminHostListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminHostListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminHostListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
