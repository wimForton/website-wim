import { Component, OnInit } from '@angular/core';
//import { Application3DComponent } from './components/application3D/application-3D.component';
import { ParticlesPageComponent } from './components/application3D/particles-page/particles-page.component';
import { HomeComponent } from './components/homepage/home/home.component';
import { EarlyworkComponent } from './components/earlywork/earlywork.component';

import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { GitprojectsComponent } from './components/gitprojects/gitprojects.component';
import { TestbenchComponent } from './components/testbench/testbench.component';
//import { CurvesComponent } from './components/application3D/UI/curves/curves.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
imports: [ParticlesPageComponent, HomeComponent, EarlyworkComponent, GitprojectsComponent, TestbenchComponent, FormsModule, MatTabsModule]
})
export class AppComponent implements OnInit {
//public forecasts: WeatherForecast[] = [];
public currenttab = 0;
public changedetector = 0;
constructor() {}

ngOnInit() {
  //this.getForecasts();
  //this.testDocumentElements();
}

public TabChange($event: any){
  console.log("TabChange", $event.index);
  if($event.index == 4 || $event.index == 1){
    this.changedetector++;
  console.log("changedetector", this.changedetector);
  }
  this.currenttab = $event.index;
}

//testDocumentElements() {
//  let tabgroup = document.getElementById("tabgroup");
//  let child0 = tabgroup?.children[0];
//  let child1 = tabgroup?.children[1];

//  let secondtablabel = document.getElementById("secondtablabel");
//  let secondtabcontent = document.getElementById("secondtabcontent");
//  //let tabcontentb = document.getElementById("mat-tab-content-0-1");
//  console.log("tabgroup", tabgroup);
//  console.log("child 0:", child0);
//  console.log("child 1:", child1);
//  //console.log("childbyid", tabcontentb);
//  console.log("secondtablabel", secondtablabel);
//  console.log("secondtabcontent", secondtabcontent);
//}

//getForecasts() {
//  this.http.get<WeatherForecast[]>('/weatherforecast').subscribe(
//    (result) => {
//      this.forecasts = result;
//    },
//    (error) => {
//      console.error(error);
//    }
//  );
//}

title = 'angularwithasp.client';
}
