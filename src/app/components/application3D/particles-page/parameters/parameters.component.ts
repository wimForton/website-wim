import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit, AfterViewChecked, model, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { IForceClass } from '../../3Dtools/ParticleSystem/forces/IForceClass';
import { IEmitClass } from '../../3Dtools/ParticleSystem/operators/IEmitClass';
import { Parameter } from '../../3Dtools/ParticleSystem/propertytypes/parameter';
import { SliderComponent } from './parametertypes/slider.component';
import { CheckboxComponent } from "./parametertypes/checkbox.component";
import { FixnumberComponent } from "./parametertypes/fixnumber.component";


@Component({
  selector: 'app-parameters',
  standalone: true,
  imports: [
    MatSliderModule,
    MatFormFieldModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatMenuModule,
    MatButtonModule,
    MatTabsModule,
    CommonModule,
    SliderComponent,
    CheckboxComponent,
    FixnumberComponent
],
  templateUrl: './parameters.component.html',
  styleUrl: './parameters.component.css'
})
export class ParametersComponent implements AfterViewInit {
  @Input() parameters?: Parameter[];
  public param!: Parameter[];
  @Input() time = 0;



  ngAfterViewInit(): void {
    this.param = this.parameters!;
  }

//   public onInputChange(event: Event, parameter: Parameter) {
//     this.value = +((event.target as HTMLInputElement).value);// + = string to number
//     this.force!.value1 = this.value1;
//   }


}
