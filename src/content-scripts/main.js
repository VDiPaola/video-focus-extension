import { LocalSetting } from "../classes-shared/Settings";
import { waitForElement } from "./classes/Helpers";
import { VideoGlow } from "./Features/VideoGlow";
import { VideoJitter } from "./Features/VideoJitter";
import { VideoMovement } from "./Features/VideoMovement";
import { VideoScale } from "./Features/VideoScale";
import { VideoSpeed } from "./Features/VideoSpeed";
import { VideoVolume } from "./Features/VideoVolume";

export class Extension{

    static intervalId;
    static interval = 100;

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
                if(event.newValue == false && this.intervalId){
                    //global enabled = false, clear interval, reset features
                    clearInterval(this.intervalId);
                    this.intervalId = null;

                    this.featureList.forEach((feature) => {
                        feature.reset();
                    })

                }
                if(event.newValue == true && !this.intervalId){
                    this._start();
                }
            })
        })
        .catch(err => {console.error(err)})
    }

    static async _start(){
        //wait for video element
        waitForElement(document.body, "video")
        .then(videoElement => {
            if(this.intervalId) return;
            this.videoElement = videoElement;

            this.intervalId = setInterval(() => {
                this.featureList.forEach((feature) => {
                    if(feature.enabled) feature.process(videoElement);
                })
            }, this.interval);

        })
        .catch(err => {console.error(err)})
    }
}

window.addEventListener("load", async () => {
    Extension.init();
})