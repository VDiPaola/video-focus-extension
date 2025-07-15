import { GlobalSetting } from "../../classes-shared/Settings";

export class VideoSpeed{
    speedBase = 1.5;
    speedAmp = 0.25;
    speedFreq = 0.002;

    enabled = false;

    videoElement

    constructor(){
        GlobalSetting.SPEED_ENABLED.Get()
        .then(speedEnabled => {
            this.enabled = speedEnabled;
        })
        .catch(err => {console.error(err)})

        GlobalSetting.SPEED_ENABLED.addChangeListener((event)=>{
            if(this.enabled !== event.newValue){
                this.enabled = event.newValue;
                this.reset();
            }
        })
    }

    process(videoElement){
        if (!videoElement || !this.enabled) return this.reset(videoElement);
        this.videoElement = videoElement;
        videoElement.playbackRate = this.speedBase + this.speedAmp * Math.sin(Date.now() * this.speedFreq);
    }

    reset(){
        if(!this.videoElement) return;
        this.videoElement.playbackRate = 1;
    }
}