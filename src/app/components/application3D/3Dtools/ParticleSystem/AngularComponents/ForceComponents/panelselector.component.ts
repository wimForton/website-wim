import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragForceComponent } from './dragforce.component';
import { BounceForceComponent } from './bounceforce.component';
import { IForceClass } from '../../forces/IForceClass';
import { ScaleInOutComponent } from './scaleinoutforce.component';
import { VectorForceComponent } from './vectorforce.component';
import { TurbulenceForceComponent } from './turbulenceforce.component';


@Component({
  selector: 'app-panelselector',
  standalone: true,
  imports: [DragForceComponent, BounceForceComponent, ScaleInOutComponent, VectorForceComponent, TurbulenceForceComponent, CommonModule],
  templateUrl: './panelselector.component.html',
  styleUrl: './../propertystyle.css'
})
export class PanelSelectorComponent {
  @Input() component?: String;
  @Input() forceinstance?: IForceClass;

}
