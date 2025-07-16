export class TransformManager {
    // Map from videoElement to a map of featureKey -> transform string
    static videoTransforms = new WeakMap();

    /**
     * Set or update a transform for a feature on a video element.
     * @param {HTMLElement} videoElement - The video element to modify
     * @param {string} featureKey - Unique key for the feature (e.g. 'scale', 'move')
     * @param {string|null} transform - The transform string for this feature, or null/undefined to remove
     */
    static setTransform(videoElement, featureKey, transform) {
        if (!videoElement) return;
        let featureMap = this.videoTransforms.get(videoElement);
        if (!featureMap) {
            featureMap = new Map();
            this.videoTransforms.set(videoElement, featureMap);
        }
        if (transform) {
            featureMap.set(featureKey, transform);
        } else {
            featureMap.delete(featureKey);
        }
        this.applyTransforms(videoElement);
    }

    /**
     * Remove a feature's transform from a video element.
     * @param {HTMLElement} videoElement
     * @param {string} featureKey
     */
    static removeTransform(videoElement, featureKey) {
        this.setTransform(videoElement, featureKey, null);
    }

    /**
     * Combine and apply all transforms for a video element.
     * @param {HTMLElement} videoElement
     */
    static applyTransforms(videoElement) {
        const featureMap = this.videoTransforms.get(videoElement);
        if (!featureMap || featureMap.size === 0) {
            videoElement.style.transform = "";
            return;
        }
        // Combine transforms in insertion order
        const transformString = Array.from(featureMap.values()).join(" ");
        videoElement.style.transform = transformString;
    }

    /**
     * Clear all transforms for a video element.
     * @param {HTMLElement} videoElement
     */
    static clearAll(videoElement) {
        this.videoTransforms.delete(videoElement);
        videoElement.style.transform = "";
    }
} 