import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit, AfterViewChecked, model, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Parameter } from '../../../3Dtools/ParticleSystem/propertytypes/parameter';



@Component({
    selector: 'app-checkbox',
    standalone: true,
    imports: [
      MatFormFieldModule,
      MatCheckboxModule,
      CommonModule,
    ],
    templateUrl: './checkbox.component.html',
    styleUrl: './slider.component.css'
  })

  export class CheckboxComponent implements AfterViewInit {
    @Input() parameter?: Parameter;
    public param!: Parameter;
    public value = false;
  
    ngAfterViewInit(): void {
      this.param = this.parameter!;
    }
  
    public onInputChange(bool: boolean) {
      this.parameter?.setValue(bool);
        console.log(bool);
    }
    // public onInputChange(event: Event) {
    //   if((event.target as HTMLInputElement).value == "true"){this.value = true}else{this.value = false}
    //   //this.value = +((event.target as HTMLInputElement).value);// + = string to number
    //   this.param!.setValue(this.value);
    // }
  
  
  }