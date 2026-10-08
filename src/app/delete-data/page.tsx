import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `Delete my data — ${site.name}`,
  description: `How to delete your ${site.name} game data and your online account data.`,
  alternates: { canonical: "/delete-data/" },
};

export default function DeleteDataPage() {
  const subject = `Delete my ${site.name.toUpperCase()} data`;
  const mail = `mailto:${site.supportEmail}?subject=${encodeURIComponent(subject)}`;
  return (
    <LegalPage eyebrow="Your data" title="Delete my data">
      <div className="summary">
        <p>
          {site.name} by {site.company}. You can delete the data on your phone yourself at any time. To delete your online data
          (anonymous account and cloud backups), email us and we delete it within 30 days. You do not need an account or a password.
        </p>
      </div>

      <h2>1. Delete the data on your phone</h2>
      <ul>
        <li>
          <strong>One city:</strong> open the game&apos;s city list and delete the city.
        </li>
        <li>
          <strong>Everything on the phone:</strong> Android Settings → Apps → {site.name} → Storage → <em>Clear storage</em>, or
          uninstall the game.
        </li>
      </ul>
      <p>This removes your cities and settings from the phone. It cannot be undone.</p>

      <h2>2. Delete your online data</h2>
      <ol>
        <li>
          Email <a href={mail}>{site.supportEmail}</a> with the subject <strong>&quot;{subject}&quot;</strong>.
        </li>
        <li>If the game&apos;s settings show a Player ID, copy it into the email. It helps us find the right account.</li>
        <li>We delete the data and reply to confirm within 30 days.</li>
      </ol>
      <p>
        <a href={mail} className="btn btn-primary">
          Email a deletion request
        </a>
      </p>

      <h2>3. What is deleted</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>What happens</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Anonymous player account (Unity Authentication player ID)</td>
              <td>Deleted</td>
            </tr>
            <tr>
              <td>Cloud backups of your cities (Unity Cloud Save)</td>
              <td>Deleted</td>
            </tr>
            <tr>
              <td>Your website &quot;Notify me&quot; email and contact-form messages</td>
              <td>Deleted, if you ask for them in the same email</td>
            </tr>
            <tr>
              <td>Crash and performance diagnostics</td>
              <td>
                Not linked to your name or email. Unity keeps them for a limited period and then deletes them, as described in
                Unity&apos;s privacy policy.
              </td>
            </tr>
            <tr>
              <td>Our emails with you about the request</td>
              <td>Kept only as long as needed to show that we completed the request</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        More details are in our <Link href="/privacy/">Privacy Policy</Link>. Questions: <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>.
      </p>
    </LegalPage>
  );
}
