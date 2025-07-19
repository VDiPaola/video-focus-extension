import { cleanURL } from "../classes-shared/helpers";
import { LocalSetting } from "../classes-shared/Settings";
import { waitForElement } from "./classes/Helpers";
import { VideoGlow } from "./Features/VideoGlow";
import { VideoJitter } from "./Features/VideoJitter";
import { VideoMovement } from "./Features/VideoMovement";
import { VideoScale } from "./Features/VideoScale";
import { VideoSpeed } from "./Features/VideoSpeed";
import { VideoVolume } from "./Features/VideoVolume";

export class Extension{

    static animationFrameId;
    static lastFrameTime = 0;
    static targetFrameTime = 50; //ms - equivalent to the previous interval
    static useTargetFrameTime = true;

    static featureList = new Set([
        new VideoScale(),
        new VideoSpeed(),
        new VideoVolume(),
        new VideoGlow(),
        new VideoJitter(),
        new VideoMovement()
    ]);

    static videoElement

    static async init (){
        LocalSetting.GLOBAL_ENABLED.Get()
        .then(globalEnabled => {
            if(globalEnabled){
                this._start();
            }

            LocalSetting.GLOBAL_ENABLED.addChangeListener((event) => {
                if(event.newValue == false && this.animationFrameId){
                    this.disable();
                }
                if(event.newValue == true && !this.animationFrameId){
                    this._start();  
                }
            })

            LocalSetting.PAGE_BLACKLIST.addChangeListener(async (event) => {
                if(!this.animationFrameId){
                    LocalSetting.GLOBAL_ENABLED.Get()
                    .then(globalEnabled => {
                        if(globalEnabled) this._start();
                    })
                }else{
                    const url = cleanURL(window.location.href);
                    const pages = event.newValue;
                    if(pages?.[url]) {
                        this.disable();
                    }
                }
            })

        })
        .catch(err => {console.error(err)})
    }

    static async disable(){
        //global enabled = false, cancel animation frame, reset features
        if(this.animationFrameId){
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        this.featureList.forEach((feature) => {
            feature.reset();
        })
    }

    static async _start(){
        //make sure not in blacklist
        const url = cleanURL(window.location.href);
        const pages = await LocalSetting.PAGE_BLACKLIST.Get();
        if(pages?.[url]) return;
        //wait for video element
        waitForElement(document.body, "video")
        .then(videoElement => {
            if(this.animationFrameId) return;
            this.videoElement = videoElement;
            this.lastFrameTime = performance.now();

            this._animate();
        })
        .catch(err => {console.error(err)})
    }

    static _animate(currentTime = performance.now()) {
        // Check if enough time has passed since last frame (equivalent to interval)
        if (this.useTargetFrameTime || currentTime - this.lastFrameTime >= this.targetFrameTime) {
            this.featureList.forEach((feature) => {
                if(feature.enabled) feature.process(this.videoElement);
            });
            this.lastFrameTime = currentTime;
        }

        // Continue the animation loop
        this.animationFrameId = requestAnimationFrame((time) => this._animate(time));
    }
}

window.addEventListener("load", async () => {
    Extension.init();
})