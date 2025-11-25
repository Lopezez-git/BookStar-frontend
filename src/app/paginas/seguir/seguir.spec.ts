import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguirComponent } from './seguir';

describe('Seguir', () => {
  let component: SeguirComponent;
  let fixture: ComponentFixture<SeguirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguirComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
