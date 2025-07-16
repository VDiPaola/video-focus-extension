import { GlobalSetting } from "../../classes-shared/Settings";
import { TransformManager } from "../classes/TransformManager";

export class VideoMovement{
    enabled = false;

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

        GlobalSetting.MOVEMENT_ENABLED.addChangeListener((event)=>{
            if(this.enabled !== event.newValue){
                this.enabled = event.newValue;
                this.reset();
            }
        })
    }

    process(videoElement){
        if (!videoElement || !this.enabled) return this.reset(videoElement);

        this.videoElement = videoElement;

        const t = Date.now() - this.start;
        const x = this.amp * Math.sin(t * this.freq);
        const y = this.amp * Math.cos(t * this.freq * 0.8);
        TransformManager.setTransform(videoElement, 'move', `translate(${x}px, ${y}px)`);
    }

    reset(){
        if(!this.videoElement) return;
        TransformManager.removeTransform(this.videoElement, 'move');
    }
}