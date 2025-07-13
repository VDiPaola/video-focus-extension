import { GlobalSetting } from "../../classes-shared/Settings";

export class VideoScale{
    scaleBase = 1;
    scaleAmp = 0.05;
    scaleFreq = 0.0015;

    enabled = false;

    constructor(){
        GlobalSetting.SCALE_ENABLED.Get()
        .then(scaleEnabled => {
            this.enabled = scaleEnabled;
        })
        .catch(err => {console.error(err)})

        GlobalSetting.SCALE_ENABLED.addChangeListener((event)=>{
            this.enabled = event.newValue;
        })
    }

    process(videoElement){
        if (!videoElement || !this.enabled) return;
        const scale = this.scaleBase + this.scaleAmp * Math.sin(Date.now() * this.scaleFreq);
        videoElement.style.transform = `scale(${scale})`;
    }
}