import { GlobalSetting } from "../../classes-shared/Settings";

export class VideoMovement{
    enabled = false;

    start = Date.now();
    amp = 10;
    freq = 0.0015;

    constructor(){
        GlobalSetting.MOVEMENT_ENABLED.Get()
        .then(enabled => {
            this.enabled = enabled;
        })
        .catch(err => {console.error(err)})

        GlobalSetting.MOVEMENT_ENABLED.addChangeListener((event)=>{
            this.enabled = event.newValue;
        })
    }

    process(videoElement){
        if (!videoElement || !this.enabled) return;
        const t = Date.now() - this.start;
        const x = this.amp * Math.sin(t * this.freq);
        const y = this.amp * Math.cos(t * this.freq * 0.8);
        videoElement.style.transform = `translate(${x}px, ${y}px)`;
    }
}