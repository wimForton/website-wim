import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyframeList } from '../application3D/3Dtools/ParticleSystem/propertytypes/keyframelist';
import { KeyframeEditorComponent } from '../application3D/UI/KeyframeEditor/keyframeeditor.component';
import { CurveeditorComponent } from '../application3D/UI/curveeditor/curveeditor.component';


@Component({
  selector: 'app-testbench',
  standalone: true,
  imports: [CommonModule, KeyframeEditorComponent, CurveeditorComponent],
  templateUrl: './testbench.component.html',
  styleUrl: './testbench.component.css'
})
export class TestbenchComponent {
  public keyframelist: KeyframeList = new KeyframeList();

}
