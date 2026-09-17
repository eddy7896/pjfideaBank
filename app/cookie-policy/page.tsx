import type { Metadata } from "next";
import { IdeabankHeader } from "@/components/ideabank/header";
import { IdeabankFooter } from "@/components/ideabank/footer";
import { LegalLayout } from "@/components/ideabank/legal-layout";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "What cookies Ideabank by PiJam sets, and why.",
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <IdeabankHeader />
      <main id="main-content">
        <LegalLayout title="Cookie Policy" effectiveDate="17 September 2026">
          <section>
            <p>
              Ideabank uses a single, strictly necessary cookie and nothing else. There is no
              advertising, analytics, or third-party tracking cookie anywhere on the site.
            </p>
          </section>

          <section>
            <h2>1. The cookie we set</h2>
            <table>
              <thead>
                <tr>
                  <th>Cookie</th>
                  <th>Purpose</th>
                  <th>Type</th>
                  <th>Expiry</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>authjs.session-token</code> (or equivalent NextAuth session cookie)</td>
                  <td>Keeps a signed-in School Admin, staff, or student-team session logged in between page loads</td>
                  <td>Strictly necessary</td>
                  <td>Session / short-lived, cleared on logout</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2>2. What we don&apos;t do</h2>
            <ul>
              <li>No advertising or retargeting cookies.</li>
              <li>No third-party analytics (Google Analytics, Meta Pixel, or similar) anywhere in the product.</li>
              <li>No cross-site tracking of any kind.</li>
            </ul>
          </section>

          <section>
            <h2>3. Because it&apos;s strictly necessary</h2>
            <p>
              Since the only cookie Ideabank sets is required for you to stay logged in — the
              product doesn&apos;t function without it — there is no separate cookie-consent banner.
              This is consistent with standard treatment of strictly-necessary cookies under Indian
              and international guidance; a cookie a site cannot function without is exempt from a
              consent-banner requirement, unlike optional tracking or advertising cookies.
            </p>
          </section>

          <section>
            <h2>4. Changes</h2>
            <p>
              If Ideabank ever adds an optional cookie (for example, product analytics to improve
              the classroom experience), this page will be updated first, and a consent mechanism
              will be added before that cookie is set.
            </p>
          </section>
        </LegalLayout>
      </main>
      <IdeabankFooter />
    </div>
  );
}
