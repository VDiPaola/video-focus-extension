import { GlobalSetting } from "../../classes-shared/Settings";

export class VideoSpeed{
    speedBase = 1.5;
    speedAmp = 0.25;
    speedFreq = 0.002;

    enabled = false;

    constructor(){
        GlobalSetting.SPEED_ENABLED.Get()
        .then(speedEnabled => {
            this.enabled = speedEnabled;
        })
        .catch(err => {console.error(err)})

        GlobalSetting.SPEED_ENABLED.addChangeListener((event)=>{
            this.enabled = event.newValue;
        })
    }

    process(videoElement){
        if (!videoElement || !this.enabled) return this.reset();
        videoElement.playbackRate = this.speedBase + this.speedAmp * Math.sin(Date.now() * this.speedFreq);
    }

    reset(videoElement){
        if(!videoElement) return;
        videoElement.playbackRate = 1;
    }
}