import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuPanelCreateComponent } from './menu-panel-create.component';

describe('MenuPanelCreateComponent', () => {
  let component: MenuPanelCreateComponent;
  let fixture: ComponentFixture<MenuPanelCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuPanelCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuPanelCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
