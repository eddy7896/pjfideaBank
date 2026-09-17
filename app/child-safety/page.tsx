import type { Metadata } from "next";
import { IdeabankHeader } from "@/components/ideabank/header";
import { IdeabankFooter } from "@/components/ideabank/footer";
import { LegalLayout } from "@/components/ideabank/legal-layout";

export const metadata: Metadata = {
  title: "Child Safety Policy",
  description: "How Ideabank by PiJam protects students who use the platform.",
};

export default function ChildSafetyPage() {
  return (
    <div className="min-h-screen bg-white">
      <IdeabankHeader />
      <main id="main-content">
        <LegalLayout title="Child Safety Policy" effectiveDate="17 September 2026">
          <section>
            <p>
              Most Ideabank users are school students, many of them minors. This policy explains
              the specific safeguards built into the Platform, in addition to the protections
              described in our <a href="/privacy">Privacy Policy</a>, and sets out our zero-tolerance
              position on child exploitation and abuse.
            </p>
          </section>

          <section>
            <h2>1. Zero tolerance</h2>
            <p>
              Pi Jam Foundation has zero tolerance for child sexual abuse material, grooming, or
              any form of exploitation of a minor, on or in connection with Ideabank. Any account
              found engaging in such conduct will be terminated immediately, and reported to the
              appropriate authorities, including under the Protection of Children from Sexual
              Offences (POCSO) Act, 2012, where applicable.
            </p>
          </section>

          <section>
            <h2>2. How the product is designed to reduce risk</h2>
            <ul>
              <li>
                <strong>No student-to-student or student-to-stranger contact features.</strong>{" "}
                Ideabank has no chat, messaging, comments, or public profile system. A student
                team&apos;s work is visible only to that team, their school, and Pi Jam staff scoped
                to that school&apos;s geography — there is no mechanism for a student to be contacted
                by anyone outside their own school through the Platform.
              </li>
              <li>
                <strong>No individual student accounts.</strong> Students authenticate with a
                shared team ID and PIN issued and controlled by the school, not with a personal
                e-mail, password, or other individually identifying login a stranger could target.
              </li>
              <li>
                <strong>Adult supervision by design.</strong> Every student team is created and
                supervised by a School Admin (a school staff member), who reviews stage
                submissions and approves progression through the Design Thinking pipeline.
              </li>
              <li>
                <strong>Minimal data collection.</strong> A student&apos;s contact number field is
                intended for a parent/guardian, not the student directly, and is optional (see{" "}
                <a href="/privacy">Privacy Policy</a> §1 and §7). No photos, location data, or
                biometric data are collected by the Platform.
              </li>
              <li>
                <strong>No advertising or behavioural tracking.</strong> Ideabank runs no
                third-party analytics, advertising, or profiling scripts against student use.
              </li>
            </ul>
          </section>

          <section>
            <h2>3. School and staff responsibility</h2>
            <p>
              A School Admin creating a student team is responsible for:
            </p>
            <ul>
              <li>Obtaining parent/guardian consent before entering a student&apos;s data, consistent with the school&apos;s own enrolment process — Ideabank requires an explicit consent acknowledgment at team-creation time before student members can be added.</li>
              <li>Controlling distribution of the team PIN so it reaches only that team&apos;s own students.</li>
              <li>Supervising how students use the Platform in the classroom.</li>
            </ul>
          </section>

          <section>
            <h2>4. Reporting a concern</h2>
            <p>
              If you become aware of any content, conduct, or account activity on Ideabank that
              may endanger a child, report it immediately to{" "}
              <a href="mailto:safety@thepijam.org">safety@thepijam.org</a>. We will act promptly,
              which may include immediate account suspension pending investigation, and will
              cooperate with law enforcement and child protection authorities as required by law.
            </p>
          </section>

          <section>
            <h2>5. Staff and volunteer screening</h2>
            <p>
              Pi Jam field staff (Teacher Trainers, Geography Leads, Programme Leads) who interact
              with schools and, indirectly, students, are onboarded through an internal
              verification process before being granted an Ideabank account with access to
              student-team data.
            </p>
          </section>
        </LegalLayout>
      </main>
      <IdeabankFooter />
    </div>
  );
}
