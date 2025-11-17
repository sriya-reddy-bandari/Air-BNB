import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostPropertyDetailsComponent } from './host-property-details.component';

describe('HostPropertyDetailsComponent', () => {
  let component: HostPropertyDetailsComponent;
  let fixture: ComponentFixture<HostPropertyDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostPropertyDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostPropertyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
