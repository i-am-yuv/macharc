import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetTreeNodeComponent } from './widget-tree-node.component';

describe('WidgetTreeNodeComponent', () => {
  let component: WidgetTreeNodeComponent;
  let fixture: ComponentFixture<WidgetTreeNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidgetTreeNodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidgetTreeNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
