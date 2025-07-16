import { GlobalSetting } from "../../classes-shared/Settings";
import { TransformManager } from "../classes/TransformManager";

export class VideoJitter{
    enabled = false;

    baseX = 0;
    baseY = 0;

    // Wiggle config
    maxOffset = 10; // px - how far it moves from center
    interval = 100; // ms - update rate

    initPos
    videoElement

    constructor(){
        GlobalSetting.JITTER_ENABLED.Get()
        .then(enabled => {
            this.enabled = enabled;
        })
        .catch(err => {console.error(err)})

        GlobalSetting.JITTER_ENABLED.addChangeListener((event)=>{
            if(this.enabled !== event.newValue){
                this.enabled = event.newValue;
                this.reset();
            }
        })
    }

    process(videoElement){
        if (!videoElement || !this.enabled) return this.reset(videoElement);
        if (this.initPos === undefined) this.initPos = videoElement.style.position ?? "";

        this.videoElement = videoElement;

        videoElement.style.position = 'relative';
        const offsetX = (Math.random() - 0.5) * 2 * this.maxOffset;
        const offsetY = (Math.random() - 0.5) * 2 * this.maxOffset;
        TransformManager.setTransform(videoElement, 'jitter', `translate(${this.baseX + offsetX}px, ${this.baseY + offsetY}px)`);
    }

    reset(){
        if(!this.videoElement) return;
        this.videoElement.style.position = this.initPos;
        TransformManager.removeTransform(this.videoElement, 'jitter');
    }
}