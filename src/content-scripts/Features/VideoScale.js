import { GlobalSetting } from "../../classes-shared/Settings";

export class VideoScale{
    scaleBase = 1;
    scaleAmp = 0.05;
    scaleFreq = 0.0015;

    enabled = false;

    initialValue

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
        if (!videoElement || !this.enabled) return this.reset();
        if(this.initialValue === undefined) this.initialValue = videoElement.style.transform ?? "";

        const scale = this.scaleBase + this.scaleAmp * Math.sin(Date.now() * this.scaleFreq);
        videoElement.style.transform = `scale(${scale})`;
    }

    reset(videoElement){
        if(!videoElement) return;
        videoElement.style.transform = this.initialValue;
    }
}