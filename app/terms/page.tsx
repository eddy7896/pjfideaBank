import type { Metadata } from "next";
import { IdeabankHeader } from "@/components/ideabank/header";
import { IdeabankFooter } from "@/components/ideabank/footer";
import { LegalLayout } from "@/components/ideabank/legal-layout";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern use of Ideabank by PiJam.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <IdeabankHeader />
      <main id="main-content">
        <LegalLayout title="Terms of Service" effectiveDate="17 September 2026">
          <section>
            <p>
              These Terms of Service (&quot;Terms&quot;) govern access to and use of Ideabank
              (&quot;Ideabank&quot;, &quot;the Platform&quot;), operated by <strong>Pi Jam Foundation</strong> (&quot;Pi
              Jam&quot;, &quot;we&quot;, &quot;us&quot;), a not-for-profit organisation working with schools across
              India on Design Thinking and Computational Thinking education. By creating an
              account, registering a school, or using Ideabank in any capacity, you agree to these
              Terms on behalf of yourself and, where applicable, the school or organisation you
              represent.
            </p>
          </section>

          <section>
            <h2>1. Who can use Ideabank</h2>
            <p>Ideabank is provided for use by:</p>
            <ul>
              <li>
                <strong>Schools</strong> that have been onboarded by Pi Jam or a Pi Jam field team
                member (Geography Lead or Teacher Trainer), represented by a School Admin account.
              </li>
              <li>
                <strong>Student teams</strong>, created and supervised by a School Admin, who
                access the Platform through a team ID and PIN issued by their school — not
                through an individually registered account.
              </li>
              <li>
                <strong>Pi Jam field and programme staff</strong> (Teacher Trainers, Geography
                Leads, Programme Leads) and <strong>State Education Department observers</strong>,
                each scoped to the geography, sub-geography, or school they are assigned to.
              </li>
            </ul>
            <p>
              Student accounts are managed accounts created and supervised by a school. A school
              using Ideabank with a class of students is responsible for obtaining any consent
              required from parents or guardians for those students to use the Platform under the
              school&apos;s supervision, consistent with the school&apos;s own policies and applicable law
              (see also our <a href="/privacy">Privacy Policy</a> for how student data specifically
              is handled).
            </p>
          </section>

          <section>
            <h2>2. What Ideabank is for</h2>
            <p>
              Ideabank is a workspace for a student team to document and progress <strong>its own
              idea</strong> through the stages of the Design Thinking process — Empathize, Define,
              Ideate, Prototype, and Test — starting from a real-world problem, including problems
              drawn from the Problem Bank. It is not a public forum, social network, or a catalogue
              for browsing other schools&apos; or students&apos; private project data; access to a team&apos;s
              in-progress work is restricted to that team, their school, and the Pi Jam staff
              scoped to that school&apos;s geography.
            </p>
          </section>

          <section>
            <h2>3. Accounts and credentials</h2>
            <ul>
              <li>
                School Admins and staff accounts are responsible for keeping their login
                credentials confidential and for all activity under their account.
              </li>
              <li>
                Student team PINs are issued to and held by the school. The school is responsible
                for how those PINs are distributed and used by students in the classroom.
              </li>
              <li>
                Report any suspected unauthorised access immediately to your Geography Lead,
                Teacher Trainer, or to Pi Jam directly.
              </li>
            </ul>
          </section>

          <section>
            <h2>4. Acceptable use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Submit content that is unlawful, harassing, hateful, or infringes another person&apos;s rights.</li>
              <li>Attempt to access data, schools, or accounts outside your assigned scope.</li>
              <li>Attempt to disrupt, reverse engineer, or probe the Platform&apos;s security.</li>
              <li>Use automated tools to scrape or bulk-extract data from the Platform without written permission.</li>
              <li>Upload malicious code or attempt to gain unauthorised administrative access.</li>
            </ul>
          </section>

          <section>
            <h2>5. Content ownership</h2>
            <p>
              A student team&apos;s problem statements, sketches, prototypes, and stage documentation
              remain the intellectual property of that student team and their school. By
              submitting content to Ideabank, the school grants Pi Jam a limited, non-exclusive
              licence to host, store, and display that content within the Platform for the purpose
              of operating the service, and — only with separate, explicit permission from the
              school — to use anonymised or attributed excerpts for programme reporting or
              educational showcase purposes.
            </p>
          </section>

          <section>
            <h2>6. Availability</h2>
            <p>
              Ideabank is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We work to keep the
              Platform reliable and reasonably fast, but do not guarantee uninterrupted or
              error-free operation, and are not liable for classroom disruption caused by
              third-party infrastructure outages, school internet connectivity, or scheduled
              maintenance.
            </p>
          </section>

          <section>
            <h2>7. Suspension and termination</h2>
            <p>
              We may suspend or terminate access for a school, staff, or student-team account that
              violates these Terms, poses a security risk, or where a school&apos;s participation in
              the Pi Jam programme has ended. A school may request export or deletion of its data
              at any time, subject to the retention terms in our <a href="/privacy">Privacy Policy</a>.
            </p>
          </section>

          <section>
            <h2>8. Changes to these Terms</h2>
            <p>
              We may update these Terms as the Platform evolves. Material changes will be
              communicated to School Admins by e-mail or an in-product notice before they take
              effect. Continued use of Ideabank after a change takes effect constitutes acceptance
              of the updated Terms.
            </p>
          </section>

          <section>
            <h2>9. Governing law</h2>
            <p>
              These Terms are governed by the laws of India. Any dispute arising from these Terms
              or use of Ideabank is subject to the exclusive jurisdiction of the courts having
              competent jurisdiction in India.
            </p>
          </section>

          <section>
            <h2>10. Contact</h2>
            <p>
              Questions about these Terms can be sent to{" "}
              <a href="mailto:hello@thepijam.org">hello@thepijam.org</a> or via{" "}
              <a href="https://thepijam.org" target="_blank" rel="noopener noreferrer">
                thepijam.org
              </a>
              .
            </p>
          </section>
        </LegalLayout>
      </main>
      <IdeabankFooter />
    </div>
  );
}
