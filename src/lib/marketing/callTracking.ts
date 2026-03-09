export function trackCallIntent(){

  fetch("/api/bi/call-intent",{
    method:"POST"
  }).catch(()=>{})

}
