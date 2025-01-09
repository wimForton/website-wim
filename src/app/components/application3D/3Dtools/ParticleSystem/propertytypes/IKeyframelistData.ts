import { ISliderSettings, KeyFrame } from "./keyframelist";

export interface IKeyframelistData{
    //let param = { name: this.name, keyframes: this.keyframes, slidersettings: this.slidersettings};
    name: string;
    keyframes: KeyFrame[];
    slidersettings: ISliderSettings;
}