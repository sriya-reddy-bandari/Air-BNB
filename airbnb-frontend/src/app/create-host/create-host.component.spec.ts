import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateHostComponent } from './create-host.component';

describe('CreateHostComponent', () => {
  let component: CreateHostComponent;
  let fixture: ComponentFixture<CreateHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateHostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
