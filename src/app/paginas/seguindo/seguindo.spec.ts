import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguindoComponent } from './seguindo';

describe('Seguindo', () => {
  let component: SeguindoComponent;
  let fixture: ComponentFixture<SeguindoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguindoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguindoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
