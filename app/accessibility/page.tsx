import type { Metadata } from "next";
import { IdeabankHeader } from "@/components/ideabank/header";
import { IdeabankFooter } from "@/components/ideabank/footer";
import { LegalLayout } from "@/components/ideabank/legal-layout";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description: "Ideabank by PiJam's commitment to accessible design.",
};

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-white">
      <IdeabankHeader />
      <main id="main-content">
        <LegalLayout title="Accessibility Statement" effectiveDate="17 September 2026">
          <section>
            <p>
              Ideabank is used by students, teachers, and State Education Department reviewers
              across a wide range of devices, connection speeds, and abilities — including older
              or shared classroom hardware and low-resolution projectors. Accessibility is a
              product requirement, not an afterthought.
            </p>
          </section>

          <section>
            <h2>1. Standard we aim for</h2>
            <p>
              We design and build Ideabank to meet <strong>WCAG 2.1 Level AA</strong>, consistent
              with the Rights of Persons with Disabilities Act, 2016 (RPWD Act) and the Guidelines
              for Indian Government Websites accessibility expectations that apply to platforms
              used in a government-facing education programme.
            </p>
          </section>

          <section>
            <h2>2. What this looks like in the product</h2>
            <ul>
              <li>Colour is never the only way information is conveyed (Design Thinking stage, status, pass/fail are labelled, not colour-only).</li>
              <li>Interactive elements are keyboard-reachable, with a visible focus state.</li>
              <li>A &quot;Skip to content&quot; link is available on every page for keyboard and screen-reader users.</li>
              <li>Both light and dark themes are designed to meet AA contrast, not a naive colour inversion.</li>
              <li>Motion respects your operating system&apos;s reduced-motion preference; nothing depends on animation to be understood.</li>
              <li>Layouts remain usable at narrow viewport widths and on lower-resolution displays common on shared classroom devices.</li>
            </ul>
          </section>

          <section>
            <h2>3. Known limitations</h2>
            <p>
              Accessibility is an ongoing effort. If you encounter a page, component, or flow that
              doesn&apos;t meet this standard, we want to know — see §4.
            </p>
          </section>

          <section>
            <h2>4. Feedback</h2>
            <p>
              Report an accessibility issue to{" "}
              <a href="mailto:hello@thepijam.org">hello@thepijam.org</a>. Please include the page,
              what assistive technology or browser you were using, and what you expected to
              happen — we will investigate and respond.
            </p>
          </section>
        </LegalLayout>
      </main>
      <IdeabankFooter />
    </div>
  );
}
