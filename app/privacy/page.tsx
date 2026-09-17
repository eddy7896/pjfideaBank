import type { Metadata } from "next";
import { IdeabankHeader } from "@/components/ideabank/header";
import { IdeabankFooter } from "@/components/ideabank/footer";
import { LegalLayout } from "@/components/ideabank/legal-layout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Ideabank by PiJam collects, uses, and protects personal data, including student data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <IdeabankHeader />
      <main id="main-content">
        <LegalLayout title="Privacy Policy" effectiveDate="17 September 2026">
          <section>
            <p>
              This Privacy Policy explains how <strong>Pi Jam Foundation</strong> (&quot;Pi Jam&quot;, &quot;we&quot;,
              &quot;us&quot;), as the Data Fiduciary, collects and processes personal data through
              Ideabank. It is written to align with the Digital Personal Data Protection Act, 2023
              (DPDP Act) and its rules. It applies to School Admins and staff, Pi Jam programme
              staff, and, distinctly, to student teams whose data is entered into the Platform by a
              school on students&apos; behalf.
            </p>
          </section>

          <section>
            <h2>1. Data we collect</h2>
            <table>
              <thead>
                <tr>
                  <th>Who</th>
                  <th>What we collect</th>
                  <th>Why</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>School (institution)</td>
                  <td>School name, address, phone, UDISE code, principal name, website</td>
                  <td>Verify and onboard a genuine school; scope data by geography</td>
                </tr>
                <tr>
                  <td>School Admin / staff account</td>
                  <td>Name, e-mail address, hashed password, role, assigned geography/school(s)</td>
                  <td>Account login and role-based access control</td>
                </tr>
                <tr>
                  <td>Student team member (minor, typically)</td>
                  <td>First/last name, grade, gender, a contact number, entered by the school</td>
                  <td>Identify team members within a school&apos;s roster; enable school–parent
                  coordination for the activity</td>
                </tr>
                <tr>
                  <td>Student team (account)</td>
                  <td>Team name, a school-issued team ID and PIN (no student e-mail or password)</td>
                  <td>Classroom-friendly shared login that avoids collecting individual student
                  credentials</td>
                </tr>
                <tr>
                  <td>Idea / project content</td>
                  <td>Problem statement, target audience, stage documentation (text, structured
                  answers), timeline of stage changes</td>
                  <td>The core purpose of the Platform: tracking an idea through Design Thinking</td>
                </tr>
                <tr>
                  <td>System / security logs</td>
                  <td>Actor e-mail/role, action taken, IP address, timestamp (audit log)</td>
                  <td>Security, abuse prevention, and accountability for who changed what</td>
                </tr>
                <tr>
                  <td>Session cookie</td>
                  <td>A single authentication session cookie (NextAuth)</td>
                  <td>Keep a signed-in user logged in; no advertising or tracking cookies are set</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2>2. Children&apos;s data</h2>
            <p>
              Many Ideabank users are students under 18. Under the DPDP Act, processing a child&apos;s
              personal data requires verifiable consent from a parent or lawful guardian, and
              prohibits behavioural tracking or targeted advertising directed at children.
              Ideabank is built around this constraint:
            </p>
            <ul>
              <li>
                Students do not create individual accounts or provide their own e-mail/password —
                a school issues a shared team ID and PIN, under the school&apos;s supervision.
              </li>
              <li>
                Ideabank does not run advertising, behavioural tracking, or profiling of any kind
                on student use.
              </li>
              <li>
                A school onboarding a class of students is the point of collection for parental or
                institutional consent, consistent with the school&apos;s own enrolment and consent
                processes; Pi Jam relies on the school, as the entity with the direct relationship
                to parents, to obtain and record that consent before entering student data into
                Ideabank.
              </li>
              <li>
                We recommend, and are working with schools towards, limiting the student contact
                number field to a guardian&apos;s number rather than a student&apos;s personal number where
                possible (see §7, data minimisation).
              </li>
            </ul>
          </section>

          <section>
            <h2>3. Legal basis for processing</h2>
            <p>
              We process personal data on the basis of: (a) <strong>consent</strong>, obtained by
              the school at the point of enrolling a class or captured directly from staff at
              account creation; and (b) <strong>legitimate use</strong> under Section 7 of the DPDP
              Act, for security logging, fraud/abuse prevention, and maintaining the integrity of
              the Platform.
            </p>
          </section>

          <section>
            <h2>4. How data is used</h2>
            <ul>
              <li>Operating login, role-based dashboards, and the Design Thinking stage pipeline.</li>
              <li>Geography-scoped reporting for Pi Jam field staff and State Education Department review.</li>
              <li>Security auditing (who did what, when) and abuse prevention.</li>
              <li>Aggregate, de-identified programme reporting (for example, &quot;120 schools progressed an idea to Prototype this term&quot;) that does not identify an individual student.</li>
            </ul>
            <p>We do not sell personal data, and we do not use student data for advertising.</p>
          </section>

          <section>
            <h2>5. Where data is stored and cross-border transfer</h2>
            <p>
              Ideabank&apos;s database is currently hosted on Supabase infrastructure. As part of our
              own operational review we identified that the database region does not currently
              match our primary user base in India, and cross-border hosting of personal data
              (including student data) is a compliance point we are actively addressing — see the
              accompanying <code>DPDP_COMPLIANCE_REPORT.md</code> for the concrete migration plan
              to an India-region database, which resolves this alongside the separate performance
              reasons already driving that move. Until that migration is complete, data in transit
              is encrypted (HTTPS/TLS), and access to the underlying database is restricted to
              authorised infrastructure credentials only.
            </p>
          </section>

          <section>
            <h2>6. Retention</h2>
            <p>
              We retain school, staff, and idea/project data for as long as a school is active in
              the Pi Jam programme, and for a reasonable period afterward for programme reporting
              and audit purposes. A school may request deletion of its data, and of the data of its
              student teams, at any time; we will action deletion requests within a reasonable
              period unless we are required to retain specific records (for example, audit logs
              tied to an active security investigation) for a longer period under law.
            </p>
          </section>

          <section>
            <h2>7. Data minimisation and security</h2>
            <ul>
              <li>Passwords are stored as salted hashes, never in plain text.</li>
              <li>Student accounts use a team PIN rather than individually identifying credentials.</li>
              <li>Access to a school&apos;s data is scoped by role and geography; staff cannot see data outside their assigned scope.</li>
              <li>All traffic to the Platform is served over HTTPS.</li>
            </ul>
          </section>

          <section>
            <h2>8. Your rights under the DPDP Act</h2>
            <p>As a Data Principal (or, for a student, through the school/guardian acting on their behalf), you have the right to:</p>
            <ul>
              <li>Request a summary of the personal data we hold and how it has been processed.</li>
              <li>Request correction or completion of inaccurate or incomplete personal data.</li>
              <li>Request erasure of personal data that is no longer necessary for the purpose it was collected for.</li>
              <li>Withdraw consent at any time, where processing is based on consent, without affecting processing already carried out.</li>
              <li>Nominate another individual to exercise these rights on your behalf in the event of death or incapacity.</li>
              <li>Register a complaint with us, and if unresolved, with the Data Protection Board of India.</li>
            </ul>
            <p>
              To exercise any of these rights, contact our Grievance Officer at{" "}
              <a href="mailto:privacy@thepijam.org">privacy@thepijam.org</a>. We will acknowledge
              and respond within the timelines required under the DPDP Act.
            </p>
          </section>

          <section>
            <h2>9. Grievance Officer</h2>
            <p>
              Pi Jam Foundation<br />
              Grievance Officer: <em>[name to be designated]</em><br />
              E-mail: <a href="mailto:privacy@thepijam.org">privacy@thepijam.org</a>
            </p>
          </section>

          <section>
            <h2>10. Changes to this policy</h2>
            <p>
              We will update this policy as Ideabank evolves and as DPDP Act rules are finalised
              and phased in. Material changes will be communicated to School Admins in advance.
            </p>
          </section>
        </LegalLayout>
      </main>
      <IdeabankFooter />
    </div>
  );
}
