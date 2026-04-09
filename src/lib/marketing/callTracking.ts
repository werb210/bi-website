import { apiPost } from "../../api/request";

export function trackCallIntent(){
  void apiPost("/api/v1/call-intent", {}).catch(()=>{})
}
