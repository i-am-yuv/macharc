import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NestedPreviewComponent } from './nested-preview.component';

describe('NestedPreviewComponent', () => {
  let component: NestedPreviewComponent;
  let fixture: ComponentFixture<NestedPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NestedPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NestedPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
