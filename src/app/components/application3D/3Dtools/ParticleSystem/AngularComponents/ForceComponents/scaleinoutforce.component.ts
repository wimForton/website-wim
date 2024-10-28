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
import { Slider } from '../../../../UiComponentData/Slider';
import { ScaleInOutForce } from '../../forces/ScaleInOut';

@Component({
  selector: 'app-scaleinout',
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
  templateUrl: './scaleinoutforce.component.html',
  styleUrl: './../propertystyle.css'
})
export class ScaleInOutComponent implements AfterViewInit {
  @Input() forceinstance?: IForceClass;
  public force?: ScaleInOutForce;

  public sl1 = { disabled: false, min: 0, max: 1, showTicks: false, step: 0.01, thumbLabel: true, label: "Ease In End" }
  public sl2 = { disabled: false, min: 0, max: 1, showTicks: false, step: 0.01, thumbLabel: true, label: "Ease Out Start" }
  public sl3 = { disabled: false, min: 0, max: 1, showTicks: false, step: 0.01, thumbLabel: true, label: "Startscale" }
  public sl4 = { disabled: false, min: 0, max: 1, showTicks: false, step: 0.01, thumbLabel: true, label: "Endscale" }


  public value1: number = 0.05;
  public value2: number = 0.8;
  public value3: number = 0.6;
  public value4: number = 0.1;

  ngAfterViewInit(): void {
    this.force = <ScaleInOutForce>this.forceinstance;
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
