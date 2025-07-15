import { GlobalSetting } from "../../classes-shared/Settings";

export class VideoGlow{
    enabled = false;

    glowFreq = 0.002;

    constructor(){
        GlobalSetting.GLOW_ENABLED.Get()
        .then(enabled => {
            this.enabled = enabled;
        })
        .catch(err => {console.error(err)})

        GlobalSetting.GLOW_ENABLED.addChangeListener((event)=>{
            this.enabled = event.newValue;
        })
    }

    process(videoElement){
        if (!videoElement || !this.enabled) return this.reset();
        const glow = 10 + 10 * Math.sin(Date.now() * this.glowFreq);
        videoElement.style.boxShadow = `0 0 ${glow}px rgba(255, 255, 255, 0.5)`;
    }

    reset(videoElement){
        if(!videoElement) return;
        videoElement.style.boxShadow = "";
    }
}