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
import { TurbulenceForce } from '../../forces/TurbulenceForce';

@Component({
  selector: 'app-turbulenceforce',
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
  templateUrl: './turbulenceforce.component.html',
  styleUrl: './../propertystyle.css'
})
export class TurbulenceForceComponent implements AfterViewInit {
  @Input() forceinstance?: IForceClass;
  public force?: TurbulenceForce;

  public sl1 = { disabled: false, min: 0, max: 1, showTicks: false, step: 0.01, thumbLabel: true, label: "Force X" };
  public sl2 = { disabled: false, min: 0, max: 1, showTicks: false, step: 0.01, thumbLabel: true, label: "Force Y" };
  public sl3 = { disabled: false, min: 0, max: 1, showTicks: false, step: 0.01, thumbLabel: true, label: "Force Z" };
  public sl4 = { disabled: false, min: 0, max: 1, showTicks: false, step: 0.01, thumbLabel: true, label: "Strength Scale" };
  public sl5 = { disabled: false, min: 0.01, max: 1, showTicks: false, step: 0.01, thumbLabel: true, label: "Detail" };

  public value1: number = 0.5;
  public value2: number = 0.5;
  public value3: number = 0.5;
  public value4: number = 0.1;
  public value5: number = 0.1;

  ngAfterViewInit(): void {
    this.force = <TurbulenceForce>this.forceinstance;
    this.value1 = this.force.value1;
    this.value2 = this.force.value2;
    this.value3 = this.force.value3;
    this.value4 = this.force.value4;
    this.value5 = this.force.value5;
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
  public onInputChange5(event: Event) {
    this.value5 = +((event.target as HTMLInputElement).value);// + = string to number
    this.force!.value5 = this.value5;
  }
}
