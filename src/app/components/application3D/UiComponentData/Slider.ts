export class Slider {
  disabled = false;
  max = 100;
  min = -100;
  showTicks = false;
  step = 0.01;
  thumbLabel = true;
  value: number = 0;
  label: string = "unnamed";

  constructor(min: number = 0, max: number = 1, step: number = 0.01, value: number = 0, label: string = "unnamed", showticks: boolean = false, disabled: boolean = false) {

  }

  public onInputChange(event: Event) {
    this.value = +((event.target as HTMLInputElement).value);// + = string to number
  }
}
