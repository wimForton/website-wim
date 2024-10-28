import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticlesPageComponent } from './particles-page.component';

describe('ParticlesPageComponent', () => {
  let component: ParticlesPageComponent;
  let fixture: ComponentFixture<ParticlesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticlesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticlesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
