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
import { IForceClass } from '../../forces/IForceClass';
import { DragForce } from '../../forces/DragForce';
import { Slider } from '../../../../UiComponentData/Slider';
import { BounceForce } from '../../forces/BounceForce';

@Component({
  selector: 'app-bounceforce',
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
  ],
  templateUrl: './bounceforce.component.html',
  styleUrl: './../propertystyle.css'
})
export class BounceForceComponent implements AfterViewInit {
  @Input() forceinstance?: IForceClass;
  public force?: BounceForce;

  public sl1 = { disabled: false, min: -10, max: 10, showTicks: false, step: 0.01, thumbLabel: true, label: "Floor level" };
  public sl2 = { disabled: false, min: 0, max: 1, showTicks: false, step: 0.01, thumbLabel: true, label: "Roughness X" };
  public sl3 = { disabled: false, min: 0, max: 1, showTicks: false, step: 0.01, thumbLabel: true, label: "Roughness Z" };
  public sl4 = { disabled: false, min: 0, max: 1, showTicks: false, step: 0.01, thumbLabel: true, label: "Damping" };

  public value1: number = 0.0;
  public value2: number = 0.0;
  public value3: number = 0.0;
  public value4: number = 0.0;



  ngAfterViewInit(): void {
    this.force = <BounceForce>this.forceinstance!;
    this.value1 = this.force.value1;
    this.value2 = this.force.value2;
    this.value3 = this.force.value3;
    this.value4 = this.force.value4;
  }

  public onInputChange1(event: Event) {
    this.value1 = +((event.target as HTMLInputElement).value);// + = string to number
    this.force!.value1 = this.value1;
  }
  public onInputChange2(event: Event) {
    this.value2 = +((event.target as HTMLInputElement).value);// + = string to number
    this.force!.value2 = this.value2;
  }
  public onInputChange3(event: Event) {
    this.value3 = +((event.target as HTMLInputElement).value);// + = string to number
    this.force!.value3 = this.value3;
  }
  public onInputChange4(event: Event) {
    this.value4 = +((event.target as HTMLInputElement).value);// + = string to number
    this.force!.value4 = this.value4;
  }
}
