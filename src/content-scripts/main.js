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

    static featureList = new Set();

    static async init (){
        //wait for video element
        waitForElement(document.body, "video")
        .then(videoElement => {

            this.featureList.add(new VideoScale());
            this.featureList.add(new VideoSpeed());
            this.featureList.add(new VideoVolume());
            this.featureList.add(new VideoGlow());
            this.featureList.add(new VideoJitter());
            this.featureList.add(new VideoMovement());

            this.intervalId = setInterval(() => {
                this.featureList.forEach((feature) => {
                    feature.process(videoElement);
                })
            }, this.interval);

        })
        .catch(err => {console.error(err)})
    }
}

window.addEventListener("load", async () => {
    Extension.init();
})