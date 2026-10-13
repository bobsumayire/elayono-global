import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Use" };

export default function TermsPage() {
  return (
    <div className="container-elayono py-20 sm:py-28 max-w-3xl">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Terms of Use</h1>
      <p className="mt-6 text-base leading-relaxed text-slate">
        This is placeholder text for the Elayono Global terms of use. Replace this page with your
        full terms governing use of this website.
      </p>
    </div>
  );
}
