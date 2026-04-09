import { apiPost } from "../../api/request";

export function notifyAIConversion(type:string,value:number){

  void apiPost("/api/v1/ai-conversion", {
      type,
      value,
      timestamp:Date.now()
    }).catch(()=>{})

}
