chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
    if (data.type === "test"){

    }
    else{
        return true;
    }
    
});


