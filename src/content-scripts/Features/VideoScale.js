import { GlobalSetting } from "../../classes-shared/Settings";
import { TransformManager } from "../classes/TransformManager";

export class VideoScale{
    scaleBase = 1;
    scaleAmp = 0.05;
    scaleFreq = 0.0015;

    enabled = false;

    videoElement

    constructor(){
        GlobalSetting.SCALE_ENABLED.Get()
        .then(scaleEnabled => {
            this.enabled = scaleEnabled;
        })
        .catch(err => {console.error(err)})

        GlobalSetting.SCALE_ENABLED.addChangeListener((event)=>{
            if(this.enabled !== event.newValue){
                this.enabled = event.newValue;
                this.reset();
            }
        })
    }

    process(videoElement){
        if (!videoElement || !this.enabled) return this.reset(videoElement);

        this.videoElement = videoElement;

        const scale = this.scaleBase + this.scaleAmp * Math.sin(Date.now() * this.scaleFreq);
        TransformManager.setTransform(videoElement, 'scale', `scale(${scale})`);
    }

    reset(){
        if(!this.videoElement) return;
        TransformManager.removeTransform(this.videoElement, 'scale');
    }
}