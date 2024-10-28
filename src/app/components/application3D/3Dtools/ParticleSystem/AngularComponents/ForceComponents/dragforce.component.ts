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

@Component({
  selector: 'app-dragforce',
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
  templateUrl: './dragforce.component.html',
  styleUrl: './../propertystyle.css'
})
export class DragForceComponent implements AfterViewInit {
  @Input() forceinstance?: IForceClass;
  public force?: DragForce;

  public sl1 = { disabled: false, min: 0, max: 1, showTicks: false, step: 0.01, thumbLabel: true, label: "strength" }
  public sl2 = { disabled: false, min: 0, max: 1, showTicks: false, step: 0.01, thumbLabel: true, label: "strength scale" }

  public v1 = { disabled: false, min: 0, max: 1, showTicks: false, step: 0.01, thumbLabel: true, label: "strength" }

  public value1: number = 0;
  public value2: number = 0;

  ngAfterViewInit(): void {
    this.force = <DragForce>this.forceinstance;
    this.value1 = this.force.value1;
    this.value2 = this.force.value2;
  }

  public onInputChange1(event: Event) {
    this.value1 = +((event.target as HTMLInputElement).value);// + = string to number
    this.force!.value1 = this.value1;
  }
  public onInputChange2(event: Event) {
    this.value2 = +((event.target as HTMLInputElement).value);// + = string to number
    this.force!.value2 = this.value2;
  }


}
