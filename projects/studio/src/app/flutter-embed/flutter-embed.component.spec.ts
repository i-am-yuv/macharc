import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlutterEmbedComponent } from './flutter-embed.component';

describe('FlutterEmbedComponent', () => {
  let component: FlutterEmbedComponent;
  let fixture: ComponentFixture<FlutterEmbedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlutterEmbedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlutterEmbedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
