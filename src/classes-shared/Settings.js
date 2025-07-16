import Browser from "webextension-polyfill";

class SettingChangedEvent{
    constructor(oldValue, newValue){
        this.oldValue = oldValue;
        this.newValue = newValue;
    }
}

class Setting{
    constructor(key, defaultValue, local=false){
        this.key = key;
        this.defaultValue = defaultValue;
        this.local = local;
        this._listeners = new Set()

        Browser.storage.onChanged.addListener((changes, _) => {
            for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
              if(key == this.key && oldValue != newValue){
                // Call all registered listeners with the old and new values
                this._listeners.forEach(listener => {
                    listener(new SettingChangedEvent(oldValue, newValue));
                });
                break;
              }
            }
        });
    }

    addChangeListener(listener){
        this._listeners.add(listener);
    }

    removeChangeListener(listener){
        this._listeners.delete(listener);
    }

    Get(){
        return new Promise((resolve, reject)=>{
            if(this.local){
                LocalSetting.Get(this.key).then(value=>{
                    let res = value[this.key] ?? this.defaultValue;
                    resolve(res);
                })
                .catch(err => reject(err));
            }else{
                GlobalSetting.Get(this.key).then(value=>{
                    let res = value[this.key] ?? this.defaultValue;
                    resolve(res);
                })
                .catch(err => reject(err));
            }
        })
    }

    Set(value){
        return new Promise((resolve, reject)=>{
            if(this.local){
                LocalSetting.Set(this.key, value).then(result=>{
                    resolve(result);
                })
                .catch(err => reject(err));
            }else{
                GlobalSetting.Set(this.key, value).then(result=>{
                    resolve(result);
                })
                .catch(err => reject(err));
            }
        })
    }
}


export class GlobalSetting {
    static SCALE_ENABLED = new Setting('SCALE_ENABLED', false, false);
    static VOLUME_ENABLED = new Setting('VOLUME_ENABLED', false, false);
    static SPEED_ENABLED = new Setting('SPEED_ENABLED', false, false);
    static GLOW_ENABLED = new Setting('GLOW_ENABLED', false, false);
    static MOVEMENT_ENABLED = new Setting('MOVEMENT_ENABLED', false, false);
    static JITTER_ENABLED = new Setting('JITTER_ENABLED', false, false);

    // Intensity settings for each feature
    static SCALE_INTENSITY = new Setting('SCALE_INTENSITY', 1, false);
    static VOLUME_INTENSITY = new Setting('VOLUME_INTENSITY', 1, false);
    static SPEED_INTENSITY = new Setting('SPEED_INTENSITY', 1, false);
    static GLOW_INTENSITY = new Setting('GLOW_INTENSITY', 1, false);
    static MOVEMENT_INTENSITY = new Setting('MOVEMENT_INTENSITY', 1, false);
    static JITTER_INTENSITY = new Setting('JITTER_INTENSITY', 1, false);

    static Get(keys){
        return new Promise((resolve, reject) => {
            Browser.storage.sync.get(keys)
            .then((result)=>{
                resolve(result);
            })
            .catch(err => reject(err));
        });
    }

    static Set(key, value){
        return new Promise((resolve, reject) => {
            Browser.storage.sync.set({[key]: value})
            .then((result) => {
                resolve(result);
            })
            .catch(err => reject(err));
        });
    }
    
}

export class LocalSetting {
    static GLOBAL_ENABLED = new Setting('GLOBAL_ENABLED', true, true);
    static PAGE_BLACKLIST = new Setting('PAGE_BLACKLIST', {}, true);

    static Get(keys){
        return new Promise((resolve, reject) => {
            Browser.storage.local.get(keys)
            .then((result) => {
                resolve(result);
            })
            .catch(err => reject(err));
        });
    }

    static Set(key, value){
        return new Promise((resolve, reject) => {
            Browser.storage.local.set({[key]: value})
            .then((result) => {
                resolve(result);
            })
            .catch(err => reject(err));
        });
    }
}