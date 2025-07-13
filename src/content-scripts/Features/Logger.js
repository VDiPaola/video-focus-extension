
export class Logger{
    static log(message, display=false){
        console.log(message)
    }
    static error(message, error=null, display=false){
        console.error(`Extension: ${message} ${error ? "\n Additional information: " + error : ""}`)
    }
}