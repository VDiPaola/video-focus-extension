
class SettingChangeEvent {
    constructor(key, oldValue, newValue, isLocal) {
        this.key = key;
        this.oldValue = oldValue;
        this.newValue = newValue;
        this.isLocal = isLocal;
        this.timestamp = Date.now();
    }
}

class Setting{
    constructor(key, defaultValue, local=false){
        this.key = key;
        this.defaultValue = defaultValue;
        this.local = local;
        this._listeners = new Set();
    }

    // Add a listener for this specific setting
    addChangeListener(callback) {
        this._listeners.add(callback);
        return () => this.removeChangeListener(callback); // Return unsubscribe function
    }

    // Remove a listener for this specific setting
    removeChangeListener(callback) {
        this._listeners.delete(callback);
    }

    // Notify all listeners of a change
    _notifyListeners(oldValue, newValue) {
        const event = new SettingChangeEvent(this.key, oldValue, newValue, this.local);
        this._listeners.forEach(callback => {
            try {
                callback(event);
            } catch (error) {
                console.error('Error in setting change listener:', error);
            }
        });
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
            // Get current value before setting new one
            this.Get().then(oldValue => {
                if(this.local){
                    LocalSetting.Set(this.key, value).then(result=>{
                        this._notifyListeners(oldValue, value);
                        resolve(result);
                    })
                    .catch(err => reject(err));
                }else{
                    GlobalSetting.Set(this.key, value).then(result=>{
                        this._notifyListeners(oldValue, value);
                        resolve(result);
                    })
                    .catch(err => reject(err));
                }
            }).catch(err => reject(err));
        })
    }
}


export class GlobalSetting {
    static SCALE_ENABLED = new Setting('SCALE_ENABLED', true, false);
    static VOLUME_ENABLED = new Setting('VOLUME_ENABLED', true, false);
    static SPEED_ENABLED = new Setting('SPEED_ENABLED', true, false);
    static GLOW_ENABLED = new Setting('GLOW_ENABLED', true, false);
    static MOVEMENT_ENABLED = new Setting('MOVEMENT_ENABLED', true, false);
    static JITTER_ENABLED = new Setting('JITTER_ENABLED', true, false);

    static Get(keys){
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(keys)
            .then((result)=>{
                resolve(result);
            })
            .catch(err => reject(err));
        });
    }

    static Set(key, value){
        return new Promise((resolve, reject) => {
            chrome.storage.sync.set({[key]: value})
            .then((result) => {
                resolve(result);
            })
            .catch(err => reject(err));
        });
    }
    
}

export class LocalSetting {
    static A = new Setting('A', false, true);

    static Get(keys){
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(keys)
            .then((result) => {
                resolve(result);
            })
            .catch(err => reject(err));
        });
    }

    static Set(key, value){
        return new Promise((resolve, reject) => {
            chrome.storage.local.set({[key]: value})
            .then((result) => {
                resolve(result);
            })
            .catch(err => reject(err));
        });
    }
}