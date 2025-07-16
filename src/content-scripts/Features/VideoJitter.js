import { GlobalSetting } from "../../classes-shared/Settings";
import { TransformManager } from "../classes/TransformManager";

export class VideoJitter{
    enabled = false;

    baseX = 0;
    baseY = 0;

    // Wiggle config
    maxOffset = 10; // px - how far it moves from center
    speed = 2; // controls how fast the jitter occurs
    startTime = Date.now();

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
        
        // Use time-based jitter instead of random
        const time = Date.now() - this.startTime;
        const frequency = this.speed * 0.01; // Convert speed to frequency
        const offsetX = Math.sin(time * frequency) * this.maxOffset;
        const offsetY = Math.cos(time * frequency * 0.8) * this.maxOffset;
        
        TransformManager.setTransform(videoElement, 'jitter', `translate(${this.baseX + offsetX}px, ${this.baseY + offsetY}px)`);
    }

    reset(){
        if(!this.videoElement) return;
        this.videoElement.style.position = this.initPos;
        TransformManager.removeTransform(this.videoElement, 'jitter');
    }
}