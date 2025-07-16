import { GlobalSetting } from "../../classes-shared/Settings";
import { TransformManager } from "../classes/TransformManager";

export class VideoMovement{
    enabled = false;
    intensity = 1;

    start = Date.now();
    amp = 10;
    freq = 0.0015;

    videoElement

    constructor(){
        GlobalSetting.MOVEMENT_ENABLED.Get()
        .then(enabled => {
            this.enabled = enabled;
        })
        .catch(err => {console.error(err)})

        GlobalSetting.MOVEMENT_INTENSITY.Get()
        .then(intensity => {
            this.intensity = intensity;
        })
        .catch(err => {console.error(err)})

        GlobalSetting.MOVEMENT_ENABLED.addChangeListener((event)=>{
            if(this.enabled !== event.newValue){
                this.enabled = event.newValue;
                this.reset();
            }
        })

        GlobalSetting.MOVEMENT_INTENSITY.addChangeListener((event)=>{
            if(this.intensity !== event.newValue){
                this.intensity = event.newValue;
            }
        })
    }

    process(videoElement){
        if (!videoElement || !this.enabled) return this.reset(videoElement);

        this.videoElement = videoElement;

        const t = Date.now() - this.start;
        const baseX = this.amp * Math.sin(t * this.freq);
        const baseY = this.amp * Math.cos(t * this.freq * 0.8);
        const adjustedX = baseX * this.intensity;
        const adjustedY = baseY * this.intensity;
        TransformManager.setTransform(videoElement, 'move', `translate(${adjustedX}px, ${adjustedY}px)`);
    }

    reset(){
        if(!this.videoElement) return;
        TransformManager.removeTransform(this.videoElement, 'move');
    }
}