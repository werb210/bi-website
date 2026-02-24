export default function FloatingChat() {
  function openChat() {
    window.dispatchEvent(new Event("open-maya-chat"));
  }

  return (
    <button
      onClick={openChat}
      style={{
        position: "fixed",
        bottom: 25,
        right: 25,
        background: "linear-gradient(135deg,#2BB3C0,#1D7E89)",
        color: "white",
        border: "none",
        padding: "14px 20px",
        borderRadius: 50,
        fontWeight: 600,
        cursor: "pointer",
        boxShadow: "0 0 15px rgba(43,179,192,0.6)",
        zIndex: 999
      }}
    >
      💬 Speak to a PGI Specialist
    </button>
  );
}
