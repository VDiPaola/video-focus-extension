const API = window.location.origin + "/"

const BACKEND = "https://api.enzon1k.com/";

export class NetworkManager{

    static async buildOptions(body={}, method="POST", contentType="application/json"){
        const options = 
            {
                "headers": {
                    "Accept": "application/json, text/plain, */*",
                    "content-type":contentType,

                },
                "body": JSON.stringify(body),
                "method": method,
                "mode": "cors",
                "credentials": "include"
            };
       return options;
    }

    //basic get
    static REQUEST(endpoint, option={}){
        return new Promise((resolve,reject)=>{
            fetch(API + endpoint, option)
            .then(res => res.json())
            .then(res => resolve(res))
            .catch(err => reject(err));
        })
    }





}
