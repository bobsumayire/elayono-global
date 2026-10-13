import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="container-elayono py-20 sm:py-28 max-w-3xl">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Privacy Policy</h1>
      <p className="mt-6 text-base leading-relaxed text-slate">
        This is placeholder text for the Elayono Global privacy policy. Replace this page with
        your full policy, covering what information is collected (e.g. through the newsletter,
        prayer request and contact forms), how it is used and stored, and how visitors can
        request access to or deletion of their data.
      </p>
    </div>
  );
}
