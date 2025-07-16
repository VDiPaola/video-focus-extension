import { GlobalSetting } from "../../classes-shared/Settings";

export class VideoGlow{
    enabled = false;
    intensity = 1;

    glowFreq = 0.002;

    videoElement

    constructor(){
        GlobalSetting.GLOW_ENABLED.Get()
        .then(enabled => {
            this.enabled = enabled;
        })
        .catch(err => {console.error(err)})

        GlobalSetting.GLOW_INTENSITY.Get()
        .then(intensity => {
            this.intensity = intensity;
        })
        .catch(err => {console.error(err)})

        GlobalSetting.GLOW_ENABLED.addChangeListener((event)=>{
            if(this.enabled !== event.newValue){
                this.enabled = event.newValue;
                this.reset();
            }
        })

        GlobalSetting.GLOW_INTENSITY.addChangeListener((event)=>{
            if(this.intensity !== event.newValue){
                this.intensity = event.newValue;
            }
        })
    }

    process(videoElement){
        if (!videoElement || !this.enabled) return;
        this.videoElement = videoElement;
        const baseGlow = 10 + 10 * Math.sin(Date.now() * this.glowFreq);
        const adjustedGlow = baseGlow * this.intensity;
        videoElement.style.boxShadow = `0 0 ${adjustedGlow}px rgba(255, 255, 255, 0.5)`;
    }

    reset(){
        if(!this.videoElement) return;
        this.videoElement.style.boxShadow = "";
    }
}