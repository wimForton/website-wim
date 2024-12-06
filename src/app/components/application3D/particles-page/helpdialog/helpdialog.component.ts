import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit, AfterViewChecked, model, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {MatDialog, MatDialogModule, MatDialogRef, } from '@angular/material/dialog';

@Component({
    selector: 'helpdialog',
    templateUrl: 'helpdialog.component.html',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class HelpDialog {
    constructor(public dialogRef: MatDialogRef<any>) { }

    ngOnInit() {
            this.dialogRef.updateSize('90%', '80%');
        }
  }