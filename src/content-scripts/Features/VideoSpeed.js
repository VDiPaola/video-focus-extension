import { GlobalSetting } from "../../classes-shared/Settings";

export class VideoSpeed{
    speedBase = 1.5;
    speedAmp = 0.25;
    speedFreq = 0.002;

    enabled = false;
    intensity = 1;

    videoElement

    constructor(){
        GlobalSetting.SPEED_ENABLED.Get()
        .then(speedEnabled => {
            this.enabled = speedEnabled;
        })
        .catch(err => {console.error(err)})

        GlobalSetting.SPEED_INTENSITY.Get()
        .then(intensity => {
            this.intensity = intensity;
        })
        .catch(err => {console.error(err)})

        GlobalSetting.SPEED_ENABLED.addChangeListener((event)=>{
            if(this.enabled !== event.newValue){
                this.enabled = event.newValue;
                this.reset();
            }
        })

        GlobalSetting.SPEED_INTENSITY.addChangeListener((event)=>{
            if(this.intensity !== event.newValue){
                this.intensity = event.newValue;
            }
        })
    }

    process(videoElement){
        if (!videoElement || !this.enabled) return this.reset(videoElement);
        this.videoElement = videoElement;
        const baseSpeed = this.speedBase + this.speedAmp * Math.sin(Date.now() * this.speedFreq);
        const adjustedSpeed = this.speedBase + (baseSpeed - this.speedBase) * this.intensity;
        videoElement.playbackRate = adjustedSpeed;
    }

    reset(){
        if(!this.videoElement) return;
        this.videoElement.playbackRate = 1;
    }
}