import { GlobalSetting } from "../../../classes-shared/Settings";
import { SettingsTab } from "./UserSettings";
import { ChatFontSize } from "../../Features/ChatFontSize";

import {ChessCoach} from '../../main'


export class GeneralTab{
    static create(){
        const tab = new SettingsTab("General");
        //enter username for user chat box

        tab.addButton("Connect Websocket", ()=>{
            if (ChessCoach.streamerData?.chatroom?.id){
                chrome.runtime.sendMessage({ type: 'request_websocket_info' });
            }
        })

    }
}

export class AccessibilityTab{
    static create(){
        const tab = new SettingsTab("Accessibility");
        tab.addDropdown("Chat Font Size", ["default",0.6,0.8,1,1.2,1.4, 1.6], GlobalSetting.CHAT_FONT_SIZE, (fontMultiplier)=>{
            if(fontMultiplier == "default") {ChatFontSize.disable()}
            else ChatFontSize.set(fontMultiplier);
            
        })
    }
}