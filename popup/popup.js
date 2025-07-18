// Import the Settings class
import { cleanURL } from '../src/classes-shared/helpers.js';
import { GlobalSetting, LocalSetting } from '../src/classes-shared/Settings.js';
import Browser from 'webextension-polyfill';

// Gets current tab
async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await Browser.tabs.query(queryOptions);
    return tab;
}

// Gets current tab url
async function getCurrentURL() {
    const tab = await getCurrentTab();
    return cleanURL(tab.url ?? "");
}

// Mapping of toggle IDs to their corresponding settings
const toggleMapping = {
    'scale-toggle': GlobalSetting.SCALE_ENABLED,
    'volume-toggle': GlobalSetting.VOLUME_ENABLED,
    'speed-toggle': GlobalSetting.SPEED_ENABLED,
    'glow-toggle': GlobalSetting.GLOW_ENABLED,
    'movement-toggle': GlobalSetting.MOVEMENT_ENABLED,
    'jitter-toggle': GlobalSetting.JITTER_ENABLED
};

// Mapping of intensity slider IDs to their corresponding settings
const intensityMapping = {
    'scale-intensity-slider': GlobalSetting.SCALE_INTENSITY,
    'volume-intensity-slider': GlobalSetting.VOLUME_INTENSITY,
    'speed-intensity-slider': GlobalSetting.SPEED_INTENSITY,
    'glow-intensity-slider': GlobalSetting.GLOW_INTENSITY,
    'movement-intensity-slider': GlobalSetting.MOVEMENT_INTENSITY,
    'jitter-intensity-slider': GlobalSetting.JITTER_INTENSITY
};

// Load current settings and update UI
async function loadSettings() {
    try {
        // Load toggle settings
        for (const [toggleId, setting] of Object.entries(toggleMapping)) {
            const toggle = document.getElementById(toggleId);
            if (toggle) {
                const value = await setting.Get();
                toggle.checked = value;
            }
        }
        
        // Load intensity settings
        for (const [sliderId, setting] of Object.entries(intensityMapping)) {
            const slider = document.getElementById(sliderId);
            const valueDisplay = slider?.parentElement?.querySelector('.intensity-value');
            if (slider) {
                const value = await setting.Get();
                slider.value = value;
                if (valueDisplay) {
                    valueDisplay.textContent = value.toFixed(1);
                }
            }
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

// Save setting when toggle changes
async function saveSetting(toggleId, checked) {
    try {
        const setting = toggleMapping[toggleId];
        if (setting) {
            setting.Set(checked);
        }
    } catch (error) {
        console.error('Error saving setting:', error);
    }
}

// Save intensity setting when slider changes
async function saveIntensitySetting(sliderId, value) {
    try {
        const setting = intensityMapping[sliderId];
        if (setting) {
            setting.Set(parseFloat(value));
        }
    } catch (error) {
        console.error('Error saving intensity setting:', error);
    }
}

// Initialize popup
async function initializePopup() {
    // Load current settings
    await loadSettings();
    
    // Add event listeners to all toggles
    for (const toggleId of Object.keys(toggleMapping)) {
        const toggle = document.getElementById(toggleId);
        if (toggle) {
            toggle.addEventListener('change', (event) => {
                saveSetting(toggleId, event.target.checked);
            });
        }
    }

    // Add event listeners to intensity sliders
    for (const sliderId of Object.keys(intensityMapping)) {
        const slider = document.getElementById(sliderId);
        if (slider) {
            slider.addEventListener('input', (event) => {
                const value = parseFloat(event.target.value);
                saveIntensitySetting(sliderId, value);
                
                // Update the displayed value
                const valueDisplay = slider.parentElement.querySelector('.intensity-value');
                if (valueDisplay) {
                    valueDisplay.textContent = value.toFixed(1);
                }
            });
        }
    }
    
    // Add event listeners to dropdown arrows
    const dropdownArrows = document.querySelectorAll('.dropdown-arrow');
    dropdownArrows.forEach(arrow => {
        arrow.addEventListener('click', () => {
            const targetId = arrow.getAttribute('data-target');
            const targetContainer = document.getElementById(targetId);
            
            if (targetContainer) {
                const isHidden = targetContainer.classList.contains('hidden');
                
                // Close all other dropdowns first
                dropdownArrows.forEach(otherArrow => {
                    if (otherArrow !== arrow) {
                        const otherTargetId = otherArrow.getAttribute('data-target');
                        const otherTargetContainer = document.getElementById(otherTargetId);
                        if (otherTargetContainer) {
                            otherTargetContainer.classList.add('hidden');
                            otherArrow.classList.remove('expanded');
                        }
                    }
                });
                
                // Toggle the clicked dropdown
                if (isHidden) {
                    targetContainer.classList.remove('hidden');
                    arrow.classList.add('expanded');
                } else {
                    targetContainer.classList.add('hidden');
                    arrow.classList.remove('expanded');
                }
            }
        });
    });
    
    // Add event listeners to power buttons
    const powerGlobal = document.getElementById('power-global');
    const powerCurrentPage = document.getElementById('power-current-page');

    const globalEnabled = await LocalSetting.GLOBAL_ENABLED.Get();
    if(globalEnabled){
        powerGlobal.classList.add("enabled")
    }

    const pageBlacklist = await LocalSetting.PAGE_BLACKLIST.Get();
    const url = await getCurrentURL();
    if(!pageBlacklist?.[url]){
        powerCurrentPage.classList.add("enabled");
    }
    
    if (powerGlobal) {
        powerGlobal.addEventListener('click', () => {
            const isEnabled = !powerGlobal.classList.contains("enabled");
            if(isEnabled){
                powerGlobal.classList.add("enabled");
            }else{
                powerGlobal.classList.remove("enabled");
            }
            LocalSetting.GLOBAL_ENABLED.Set(isEnabled);
        });
    }
    
    if (powerCurrentPage) {
        powerCurrentPage.addEventListener('click', () => {
            const isEnabled = !powerCurrentPage.classList.contains("enabled");
            if(isEnabled){
                powerCurrentPage.classList.add("enabled");
            }else{
                powerCurrentPage.classList.remove("enabled");
            }
            LocalSetting.PAGE_BLACKLIST.Get()
            .then(async (pageBlacklist) => {
                const url = await getCurrentURL();
                if(isEnabled){
                    delete pageBlacklist[url];
                }else{
                    pageBlacklist[url] = true;
                }
                LocalSetting.PAGE_BLACKLIST.Set(pageBlacklist);
            })
        });
    }
    
    // Add keyboard navigation support
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            window.close();
        }
    });
}

// Also run initialization immediately in case DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePopup);
} else {
    initializePopup();
}