import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestPropertyDetailsComponent } from './guest-property-details.component';

describe('GuestPropertyDetailsComponent', () => {
  let component: GuestPropertyDetailsComponent;
  let fixture: ComponentFixture<GuestPropertyDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestPropertyDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestPropertyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
