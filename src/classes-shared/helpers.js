function cleanYouTubeUrl(url) {
    const urlObj = new URL(url);
    let videoId = '';

    if (urlObj.hostname.includes('youtu.be')) {
        videoId = urlObj.pathname.slice(1);
    } else if (urlObj.hostname.includes('youtube.com')) {
        videoId = urlObj.searchParams.get('v');
    }

    if (!videoId) {
        return url;
    }

    return `https://www.youtube.com/watch?v=${videoId}`;
}


export function cleanURL(url){
    const cleanURL = cleanYouTubeUrl(url);
    return cleanURL;
}