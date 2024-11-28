import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroComprasPage } from './registro-compras.page';

describe('RegistroComprasPage', () => {
  let component: RegistroComprasPage;
  let fixture: ComponentFixture<RegistroComprasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroComprasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
