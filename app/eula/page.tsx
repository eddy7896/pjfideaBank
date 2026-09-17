import type { Metadata } from "next";
import { IdeabankHeader } from "@/components/ideabank/header";
import { IdeabankFooter } from "@/components/ideabank/footer";
import { LegalLayout } from "@/components/ideabank/legal-layout";

export const metadata: Metadata = {
  title: "End User License Agreement",
  description: "The license under which schools and staff use the Ideabank software.",
};

export default function EulaPage() {
  return (
    <div className="min-h-screen bg-white">
      <IdeabankHeader />
      <main id="main-content">
        <LegalLayout title="End User License Agreement" effectiveDate="17 September 2026">
          <section>
            <p>
              This End User License Agreement (&quot;EULA&quot;) is a supplement to the{" "}
              <a href="/terms">Terms of Service</a> and governs the license granted to a school,
              its staff, and its student teams (together, &quot;you&quot;) to use the Ideabank software
              (&quot;the Software&quot;), owned and operated by <strong>Pi Jam Foundation</strong>. Where this
              EULA and the Terms of Service conflict on a licensing question, this EULA controls.
            </p>
          </section>

          <section>
            <h2>1. License grant</h2>
            <p>
              Pi Jam Foundation grants your school a limited, non-exclusive, non-transferable,
              revocable license to access and use Ideabank for the duration of your school&apos;s
              participation in the Pi Jam programme, solely for the purpose of running Design
              Thinking education activities with your students and staff.
            </p>
          </section>

          <section>
            <h2>2. Restrictions</h2>
            <p>You may not, and may not permit anyone else to:</p>
            <ul>
              <li>Copy, modify, reverse engineer, decompile, or create derivative works of the Software.</li>
              <li>Sell, rent, lease, sublicense, or otherwise transfer access to the Software to a third party outside your school.</li>
              <li>Remove or obscure any proprietary notices in the Software.</li>
              <li>Use the Software to build a competing product or service.</li>
            </ul>
          </section>

          <section>
            <h2>3. Ownership</h2>
            <p>
              The Software, including its source code, design, and underlying technology, is and
              remains the exclusive property of Pi Jam Foundation. This EULA does not transfer any
              ownership rights to you. Your ownership of your own idea and project content is
              addressed separately in the Terms of Service (§5).
            </p>
          </section>

          <section>
            <h2>4. No warranty</h2>
            <p>
              The Software is licensed &quot;as is,&quot; without warranty of any kind, express or implied,
              including but not limited to warranties of merchantability, fitness for a particular
              purpose, and non-infringement, to the extent permitted by applicable law.
            </p>
          </section>

          <section>
            <h2>5. Limitation of liability</h2>
            <p>
              To the maximum extent permitted by law, Pi Jam Foundation is not liable for any
              indirect, incidental, or consequential damages arising from use of, or inability to
              use, the Software.
            </p>
          </section>

          <section>
            <h2>6. Termination</h2>
            <p>
              This license terminates automatically if your school&apos;s participation in the Pi Jam
              programme ends, or if you breach this EULA or the Terms of Service. On termination,
              you must stop using the Software; data retention and deletion follow the{" "}
              <a href="/privacy">Privacy Policy</a>.
            </p>
          </section>

          <section>
            <h2>7. Governing law</h2>
            <p>This EULA is governed by the laws of India, consistent with the Terms of Service (§9).</p>
          </section>
        </LegalLayout>
      </main>
      <IdeabankFooter />
    </div>
  );
}
