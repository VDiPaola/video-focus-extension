import { GlobalSetting } from "../../classes-shared/Settings";
import { TransformManager } from "../classes/TransformManager";

export class VideoJitter{
    enabled = false;
    intensity = 1;

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

        GlobalSetting.JITTER_INTENSITY.Get()
        .then(intensity => {
            this.intensity = intensity;
        })
        .catch(err => {console.error(err)})

        GlobalSetting.JITTER_ENABLED.addChangeListener((event)=>{
            if(this.enabled !== event.newValue){
                this.enabled = event.newValue;
                this.reset();
            }
        })

        GlobalSetting.JITTER_INTENSITY.addChangeListener((event)=>{
            if(this.intensity !== event.newValue){
                this.intensity = event.newValue;
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
        const baseOffsetX = Math.sin(time * frequency) * this.maxOffset;
        const baseOffsetY = Math.cos(time * frequency * 0.8) * this.maxOffset;
        const adjustedOffsetX = baseOffsetX * this.intensity;
        const adjustedOffsetY = baseOffsetY * this.intensity;
        
        TransformManager.setTransform(videoElement, 'jitter', `translate(${this.baseX + adjustedOffsetX}px, ${this.baseY + adjustedOffsetY}px)`);
    }

    reset(){
        if(!this.videoElement) return;
        this.videoElement.style.position = this.initPos;
        TransformManager.removeTransform(this.videoElement, 'jitter');
    }
}