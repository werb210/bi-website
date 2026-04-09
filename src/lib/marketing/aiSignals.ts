import { apiPost } from "../../api/request";

export async function sendAISignal(signal:string,data:Record<string, unknown>){

  try{
    await apiPost("/api/v1/ai-signal", {
      signal,
      data,
      timestamp:Date.now()
    });

  }catch(e){
    void e
  }
}
