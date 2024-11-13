import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurveeditorComponent } from './curveeditor.component';

describe('CurveeditorComponent', () => {
  let component: CurveeditorComponent;
  let fixture: ComponentFixture<CurveeditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurveeditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurveeditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
