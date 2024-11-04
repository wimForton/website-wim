import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyframeList } from '../application3D/3Dtools/ParticleSystem/propertytypes/keyframelist';

@Component({
  selector: 'app-testbench',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testbench.component.html',
  styleUrl: './testbench.component.css'
})
export class TestbenchComponent {
  public keyframelist: KeyframeList = new KeyframeList();

}
