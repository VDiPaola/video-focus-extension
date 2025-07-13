import { GlobalSetting } from "../../classes-shared/Settings";

export class VideoJitter{
    enabled = false;

    baseX = 0;
    baseY = 0;

    // Wiggle config
    maxOffset = 10; // px - how far it moves from center
    interval = 100; // ms - update rate

    initPos

    constructor(){
        GlobalSetting.JITTER_ENABLED.Get()
        .then(enabled => {
            this.enabled = enabled;
        })
        .catch(err => {console.error(err)})

        GlobalSetting.JITTER_ENABLED.addChangeListener((event)=>{
            this.enabled = event.newValue;
        })
    }

    process(videoElement){
        if (!videoElement || !this.enabled) {
            if(this.initPos && videoElement) {
                videoElement.style.position = this.initPos;
                videoElement.style.transform = "";
            }
            return;
        }
        if (!this.initPos) this.initPos = videoElement.style.position;
        videoElement.style.position = 'relative';
        const offsetX = (Math.random() - 0.5) * 2 * this.maxOffset;
        const offsetY = (Math.random() - 0.5) * 2 * this.maxOffset;
        videoElement.style.transform = `translate(${this.baseX + offsetX}px, ${this.baseY + offsetY}px)`;
    }
}