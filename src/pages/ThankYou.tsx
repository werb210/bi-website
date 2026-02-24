import { subscribeToPush } from "../hooks/usePush";

export default function ThankYou() {
  return (
    <div className="container">
      <h1>Application Submitted</h1>
      <p>Our underwriting team will contact you shortly.</p>
      <button
        onClick={subscribeToPush}
        className="bg-brand-accent hover:bg-brand-accentHover text-white rounded-full h-11 px-6 font-medium mt-6"
      >
        Enable Status Notifications
      </button>
    </div>
  );
}
