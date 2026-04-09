import { useEffect, useState } from "react"
import { apiRequest } from "../../api/request";

export default function DynamicLanding() {

  const [content,setContent] = useState<any>(null)

  useEffect(()=>{

    const params = new URLSearchParams(window.location.search)
    const campaign = params.get("utm_campaign")

    apiRequest("/api/v1/landing?campaign="+campaign)
      .then(setContent)
      .catch(()=>{})

  },[])

  if(!content) return null

  return (

    <div>

      <h1>{content.title}</h1>

      <p>{content.subtitle}</p>

    </div>

  )

}
