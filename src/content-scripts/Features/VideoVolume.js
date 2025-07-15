import { GlobalSetting } from "../../classes-shared/Settings";

export class VideoVolume{
    enabled = false;

    volBase = 0.5;
    volAmp = 0.2;
    volFreq = 0.002;

    initialValue

    constructor(){
        GlobalSetting.VOLUME_ENABLED.Get()
        .then(enabled => {
            this.enabled = enabled;
        })
        .catch(err => {console.error(err)})

        GlobalSetting.VOLUME_ENABLED.addChangeListener((event)=>{
            this.enabled = event.newValue;
        })
    }

    process(videoElement){
        if (!videoElement || !this.enabled) return this.reset(videoElement);
        if(this.initialValue === undefined) this.initialValue = videoElement.volume ?? 0.2;

        videoElement.volume = Math.max(0, Math.min(1, this.volBase + this.volAmp * Math.sin(Date.now() * this.volFreq)));
    }

    reset(videoElement){
        if(!videoElement) return;
        videoElement.volume = this.initialValue;
    }
}