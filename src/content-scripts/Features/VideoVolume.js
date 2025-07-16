import { GlobalSetting } from "../../classes-shared/Settings";

export class VideoVolume{
    enabled = false;
    intensity = 1;

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

        GlobalSetting.VOLUME_INTENSITY.Get()
        .then(intensity => {
            this.intensity = intensity;
        })
        .catch(err => {console.error(err)})

        GlobalSetting.VOLUME_ENABLED.addChangeListener((event)=>{
            if(this.enabled !== event.newValue){
                this.enabled = event.newValue;
                this.reset();
            }
        })

        GlobalSetting.VOLUME_INTENSITY.addChangeListener((event)=>{
            if(this.intensity !== event.newValue){
                this.intensity = event.newValue;
            }
        })
    }

    process(videoElement){
        if (!videoElement || !this.enabled) return this.reset(videoElement);
        if(this.initialValue === undefined) this.initialValue = videoElement.volume ?? 0.2;

        this.videoElement = videoElement;
        const baseVolume = this.volBase + this.volAmp * Math.sin(Date.now() * this.volFreq);
        const adjustedVolume = this.volBase + (baseVolume - this.volBase) * this.intensity;
        videoElement.volume = Math.max(0, Math.min(1, adjustedVolume));
    }

    reset(){
        if(!this.videoElement) return;
        this.videoElement.volume = this.initialValue;
    }
}