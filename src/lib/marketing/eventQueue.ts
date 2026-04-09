import { apiPost } from "../../api/request";

interface MarketingEvent {
  event: string
  timestamp: number
  campaign?: Record<string, unknown>
  referrer?: string | null
  data?: Record<string, unknown>
}

const QUEUE_KEY = "bi_event_queue"

export function queueEvent(e: MarketingEvent) {

  const queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]")

  queue.push(e)

  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
}

export function flushEvents() {

  const queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]")

  if(queue.length === 0) return

  void apiPost("/api/v1/marketing-events/batch", queue).catch(()=>{})

  localStorage.removeItem(QUEUE_KEY)
}
