export function track(event: string, data?: Record<string, any>) {
  if ((window as any).gtag) {
    (window as any).gtag("event", event, data || {});
  }

  if ((window as any).lintrk) {
    (window as any).lintrk("track", { conversion_id: event });
  }

  console.log("Track:", event, data);
}
