import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalisisSentimientosComponent } from './analisis-sentimientos.component';

describe('AnalisisSentimientosComponent', () => {
  let component: AnalisisSentimientosComponent;
  let fixture: ComponentFixture<AnalisisSentimientosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalisisSentimientosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalisisSentimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
