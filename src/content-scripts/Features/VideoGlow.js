import { GlobalSetting } from "../../classes-shared/Settings";

export class VideoGlow{
    enabled = false;

    glowFreq = 0.002;

    videoElement

    constructor(){
        GlobalSetting.GLOW_ENABLED.Get()
        .then(enabled => {
            this.enabled = enabled;
        })
        .catch(err => {console.error(err)})

        GlobalSetting.GLOW_ENABLED.addChangeListener((event)=>{
            if(this.enabled !== event.newValue){
                this.enabled = event.newValue;
                this.reset();
            }
        })
    }

    process(videoElement){
        if (!videoElement || !this.enabled) return;
        this.videoElement = videoElement;
        const glow = 10 + 10 * Math.sin(Date.now() * this.glowFreq);
        videoElement.style.boxShadow = `0 0 ${glow}px rgba(255, 255, 255, 0.5)`;
    }

    reset(){
        if(!this.videoElement) return;
        this.videoElement.style.boxShadow = "";
    }
}