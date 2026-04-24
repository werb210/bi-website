import { useEffect, useMemo, useState } from "react";
import BIAuthGate from "../components/BIAuthGate";
import LoadingButton from "../components/LoadingButton";
import { apiGet, apiPost } from "../lib/api";
import { getAuthUser, AuthUser } from "../lib/auth";
import { emailValid, phoneValid, required } from "../lib/validation";
import { PGI_STAGES, PGI_STAGE_LABEL } from "../lib/pgiStages";

type Referral = {
  id: string;
  full_name: string;
  company_name: string | null;
  email: string | null;
  phone_e164: string;
  application_id: string | null;
  application_stage: string | null;
  created_at: string;
};

type ProfileRow = {
  full_name: string;
  company_name: string;
  email: string;
  phone_e164: string;
} | null;

export default function ReferrerPortal() {
  const [user, setUser] = useState<AuthUser | null>(getAuthUser());
  const [profile, setProfile] = useState<ProfileRow>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const [profileForm, setProfileForm] = useState({
    full_name: "",
    company_name: "",
    email: "",
    phone: ""
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    full_name: "",
    company_name: "",
    email: "",
    phone: ""
  });
  const [savingContact, setSavingContact] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    void loadProfile();
  }, [user]);

  async function loadProfile() {
    try {
      const res = await apiGet<{ profile: ProfileRow }>("/api/v1/bi/referrers/referrer/me");
      setProfile(res.profile);
      if (res.profile) {
        await loadPipeline();
      } else {
        setProfileForm({
          full_name: user?.name ?? "",
          company_name: "",
          email: user?.email ?? "",
          phone: user?.phone ?? ""
        });
      }
    } catch {
      setProfile(null);
    } finally {
      setProfileLoaded(true);
    }
  }

  async function loadPipeline() {
    try {
      const res = await apiGet<{ referrals: Referral[] }>(
        "/api/v1/bi/referrers/referrer/pipeline"
      );
      setReferrals(res.referrals || []);
    } catch {
      setReferrals([]);
    }
  }

  const grouped = useMemo(() => {
    const g: Record<string, Referral[]> = { new: [] };
    PGI_STAGES.forEach((s) => (g[s] = []));
    referrals.forEach((r) => {
      const key = r.application_stage || "new";
      (g[key] ||= []).push(r);
    });
    return g;
  }, [referrals]);

  async function saveProfile() {
    const { full_name, company_name, email, phone } = profileForm;
    if (!required(full_name) || !required(company_name) || !emailValid(email) || !phoneValid(phone)) {
      setProfileError("Complete all fields with valid email and phone.");
      return;
    }
    setSavingProfile(true);
    setProfileError(null);
    try {
      await apiPost("/api/v1/bi/referrers/referrer/profile", {
        full_name,
        company_name,
        email,
        phone
      });
      await loadProfile();
    } catch (e) {
      setProfileError(e instanceof Error ? e.message : "Failed to save profile");
    } finally {
      setSavingProfile(false);
    }
  }

  async function addContact() {
    const { full_name, company_name, email, phone } = contactForm;
    if (!required(full_name) || !phoneValid(phone)) {
      setContactError("Name and phone are required.");
      return;
    }
    setSavingContact(true);
    setContactError(null);
    try {
      await apiPost("/api/v1/bi/referrers/referrer/add-referral", {
        full_name,
        company_name,
        email,
        phone
      });
      setContactForm({ full_name: "", company_name: "", email: "", phone: "" });
      setShowModal(false);
      await loadPipeline();
    } catch (e) {
      setContactError(e instanceof Error ? e.message : "Failed to add contact");
    } finally {
      setSavingContact(false);
    }
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#07182E] p-10 text-white">
        <BIAuthGate userType="referrer" onVerified={setUser} />
      </main>
    );
  }

  if (!profileLoaded) {
    return <main className="min-h-screen bg-[#07182E] p-10 text-white">Loading…</main>;
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-[#07182E] p-10 text-white">
        <div className="mx-auto max-w-lg rounded-xl border border-white/10 bg-white/5 p-6">
          <h1 className="mb-4 text-2xl font-semibold">Complete your profile</h1>
          <input className="input mb-3 w-full" placeholder="Full Name"
            value={profileForm.full_name}
            onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })} />
          <input className="input mb-3 w-full" placeholder="Company Name"
            value={profileForm.company_name}
            onChange={(e) => setProfileForm({ ...profileForm, company_name: e.target.value })} />
          <input className="input mb-3 w-full" type="email" placeholder="Email"
            value={profileForm.email}
            onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} />
          <input className="input mb-4 w-full" type="tel" placeholder="Mobile phone"
            value={profileForm.phone}
            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} />
          {profileError && <p className="mb-3 text-sm text-red-300">{profileError}</p>}
          <LoadingButton loading={savingProfile} onClick={saveProfile}>Continue</LoadingButton>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07182E] p-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">My Referrals</h1>
          <button
            type="button"
            className="rounded bg-blue-600 px-4 py-2 font-semibold hover:bg-blue-700"
            onClick={() => setShowModal(true)}
          >
            Add Contact
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-7">
          <section className="rounded border border-white/10 bg-white/5 p-3">
            <div className="mb-2 text-sm font-semibold uppercase text-white/70">No Application Yet</div>
            <div className="space-y-2">
              {grouped.new.map((r) => (
                <article key={r.id} className="rounded border border-white/10 p-2">
                  <div className="font-medium">{r.full_name}</div>
                  <div className="text-sm text-white/70">{r.company_name || ""}</div>
                  <div className="text-xs text-white/50">{r.phone_e164}</div>
                </article>
              ))}
            </div>
          </section>
          {PGI_STAGES.map((s) => (
            <section key={s} className="rounded border border-white/10 bg-white/5 p-3">
              <div className="mb-2 text-sm font-semibold uppercase text-white/70">
                {PGI_STAGE_LABEL[s] || s}
              </div>
              <div className="space-y-2">
                {(grouped[s] || []).map((r) => (
                  <article key={r.id} className="rounded border border-white/10 p-2">
                    <div className="font-medium">{r.full_name}</div>
                    <div className="text-sm text-white/70">{r.company_name || ""}</div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-md rounded-xl bg-[#112A4D] p-6">
              <h2 className="mb-4 text-lg font-semibold">Add Contact</h2>
              <input className="input mb-3 w-full" placeholder="Full Name"
                value={contactForm.full_name}
                onChange={(e) => setContactForm({ ...contactForm, full_name: e.target.value })} />
              <input className="input mb-3 w-full" placeholder="Company"
                value={contactForm.company_name}
                onChange={(e) => setContactForm({ ...contactForm, company_name: e.target.value })} />
              <input className="input mb-3 w-full" type="email" placeholder="Email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} />
              <input className="input mb-4 w-full" type="tel" placeholder="Phone"
                value={contactForm.phone}
                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })} />
              {contactError && <p className="mb-3 text-sm text-red-300">{contactError}</p>}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="rounded border border-white/20 px-4 py-2"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <LoadingButton loading={savingContact} onClick={addContact}>Save</LoadingButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
