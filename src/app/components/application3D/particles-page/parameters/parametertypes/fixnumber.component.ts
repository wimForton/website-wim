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
import { Parameter } from '../../../3Dtools/ParticleSystem/propertytypes/parameter';
import { KeyframeList } from '../../../3Dtools/ParticleSystem/propertytypes/keyframelist';



@Component({
    selector: 'app-fixnumber',
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
    templateUrl: './fixnumber.component.html',
    styleUrl: './slider.component.css'
  })

  export class FixnumberComponent implements AfterViewInit {
    @Input() parameter?: Parameter;

    public value: number = 0;
  
  
  
    ngAfterViewInit(): void {
    }
  
    public onInputChange(event: Event) {
      this.value = +((event.target as HTMLInputElement).value);// + = string to number
      this.parameter!.setValue(this.value);
    }
  
  
  }