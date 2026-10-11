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
          {site.name} by {site.company}. You can delete the data on your device yourself at any time. To delete your online data
          (anonymous account and uploaded cities), use <em>Delete Data</em> in the game before you uninstall, or email us and we
          delete it within 30 days.
          You do not need an account or a password.
        </p>
      </div>

      <h2>1. Delete your online data first</h2>
      <p>
        Do this <strong>before</strong> you clear the game&apos;s storage, uninstall it or move to a new device. Your uploads are tied
        to the anonymous player ID stored on this device; once that is gone, the game can no longer find them (email us instead).
      </p>
      <h3>In the game (fastest)</h3>
      <p>
        Open Settings ▸ Interface ▸ Privacy &amp; Support and tap <strong>Delete Data</strong> twice. It needs an internet connection.
        The cities this install uploaded and its anonymous player ID are deleted at once. If it says it couldn&apos;t delete, try
        again online, or use email.
      </p>
      <h3>By email</h3>
      <ol>
        <li>
          Email <a href={mail}>{site.supportEmail}</a> with the subject <strong>&quot;{subject}&quot;</strong>.
        </li>
        <li>
          Paste your Player ID into the email (Settings ▸ Interface ▸ Privacy &amp; Support ▸ <em>Copy</em>). It tells us which
          account is yours. Without it, list the City IDs you uploaded.
        </li>
        <li>
          To remove your website entries too, tell us the email address (and the name or phone number) you typed into the Notify me
          or Contact form.
        </li>
        <li>We delete the data and reply to confirm within 30 days.</li>
      </ol>
      <p>
        <a href={mail} className="btn btn-primary">
          Email a deletion request
        </a>
      </p>

      <h2>2. Delete the data on your device</h2>
      <ul>
        <li>
          <strong>One city:</strong> open the game&apos;s city list and delete the city. This does not remove a copy you uploaded.
        </li>
        <li>
          <strong>Everything on Android:</strong> Settings → Apps → {site.name} → Storage → <em>Clear storage</em>, or uninstall the
          game.
        </li>
        <li>
          <strong>Everything on iPhone or iPad:</strong> delete the app.
        </li>
        <li>
          <strong>Everything on Windows:</strong> delete the folder <code>{"%USERPROFILE%\\AppData\\LocalLow\\HIZARC\\DEPTHCITY"}</code> (your cities) and the registry key{" "}
          <code>{"HKEY_CURRENT_USER\\Software\\HIZARC\\DEPTHCITY"}</code> (settings and the anonymous player ID). Uninstalling the game keeps both.
        </li>
      </ul>
      <p>This removes your cities and settings from the device. It cannot be undone.</p>

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
              <td>Cities you uploaded and your share code (Unity Cloud Save)</td>
              <td>
                Deleted, so their City IDs stop working. Copies that other players already downloaded stay on their devices; we cannot
                reach those.
              </td>
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
