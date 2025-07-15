import { GlobalSetting } from "../../classes-shared/Settings";

export class VideoVolume{
    enabled = false;

    volBase = 0.5;
    volAmp = 0.2;
    volFreq = 0.002;

    initialValue

    videoElement

    constructor(){
        GlobalSetting.VOLUME_ENABLED.Get()
        .then(enabled => {
            this.enabled = enabled;
        })
        .catch(err => {console.error(err)})

        GlobalSetting.VOLUME_ENABLED.addChangeListener((event)=>{
            if(this.enabled !== event.newValue){
                this.enabled = event.newValue;
                this.reset();
            }
        })
    }

    process(videoElement){
        if (!videoElement || !this.enabled) return this.reset(videoElement);
        if(this.initialValue === undefined) this.initialValue = videoElement.volume ?? 0.2;

        this.videoElement = videoElement;
        videoElement.volume = Math.max(0, Math.min(1, this.volBase + this.volAmp * Math.sin(Date.now() * this.volFreq)));
    }

    reset(){
        if(!this.videoElement) return;
        this.videoElement.volume = this.initialValue;
    }
}