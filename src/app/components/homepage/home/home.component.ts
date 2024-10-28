import { Component } from '@angular/core';
import { CurvesComponent } from '../../application3D/UI/curves/curves.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CurvesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
