import { GlobalSetting } from "../../classes-shared/Settings";
import { TransformManager } from "../classes/TransformManager";

export class VideoScale{
    scaleBase = 1;
    scaleAmp = 0.05;
    scaleFreq = 0.0015;

    enabled = false;
    intensity = 1;

    videoElement

    constructor(){
        GlobalSetting.SCALE_ENABLED.Get()
        .then(scaleEnabled => {
            this.enabled = scaleEnabled;
        })
        .catch(err => {console.error(err)})

        GlobalSetting.SCALE_INTENSITY.Get()
        .then(intensity => {
            this.intensity = intensity;
        })
        .catch(err => {console.error(err)})

        GlobalSetting.SCALE_ENABLED.addChangeListener((event)=>{
            if(this.enabled !== event.newValue){
                this.enabled = event.newValue;
                this.reset();
            }
        })

        GlobalSetting.SCALE_INTENSITY.addChangeListener((event)=>{
            if(this.intensity !== event.newValue){
                this.intensity = event.newValue;
            }
        })
    }

    process(videoElement){
        if (!videoElement || !this.enabled) return this.reset(videoElement);

        this.videoElement = videoElement;

        const baseScale = this.scaleBase + this.scaleAmp * Math.sin(Date.now() * this.scaleFreq);
        const adjustedScale = this.scaleBase + (baseScale - this.scaleBase) * this.intensity;
        TransformManager.setTransform(videoElement, 'scale', `scale(${adjustedScale})`);
    }

    reset(){
        if(!this.videoElement) return;
        TransformManager.removeTransform(this.videoElement, 'scale');
    }
}