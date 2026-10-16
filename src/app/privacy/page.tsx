import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { analytics, site } from "@/content/site";

export const metadata: Metadata = {
  title: `Privacy Policy — ${site.name}`,
  description: `How ${site.name} and this website handle your data.`,
  alternates: { canonical: "/privacy/" },
};

const UPDATED = "11 October 2026";

export default function PrivacyPage() {
  const mail = `mailto:${site.supportEmail}`;
  return (
    <LegalPage eyebrow="Legal" title="Privacy Policy" updated={`Effective date: ${UPDATED}`}>
      <div className="summary">
        <p>
          <strong>In short:</strong> the {site.name} game does not ask for your name, email address, phone number, location,
          photos, contacts, camera or microphone. It shows no ads and has no in-app purchases. Your city is saved on your device.
          When you are online, the game uses Unity Gaming Services to give you an anonymous player ID. If you choose to upload a city,
          it is stored online, and anyone who has its City ID can download a copy. Unity&apos;s engine sends crash and performance
          diagnostics so we can fix problems. On this website, we only receive what you type into our forms. We never sell your data.
        </p>
      </div>

      <h2>1. Who we are</h2>
      <p>
        {site.name} (for Android, iPhone, iPad and Windows; Android package and iOS bundle ID <code>{site.androidPackage}</code>)
        and this website are made by {site.company} (&quot;we&quot;, &quot;us&quot;). For any privacy question or request, email <a href={mail}>{site.supportEmail}</a>.
      </p>

      <h2>2. Data the game handles</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>When</th>
              <th>Why</th>
              <th>Where it is kept</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Your cities and settings (buildings, city name, progress, preferences)</td>
              <td>While you play</td>
              <td>So you can continue your game</td>
              <td>On your device only, unless you upload it (below)</td>
            </tr>
            <tr>
              <td>Anonymous player ID (a random code from Unity Authentication, not linked to your name or email)</td>
              <td>Automatically, a few seconds after the game starts, when the device is online</td>
              <td>To identify your game&apos;s online account so the cities you upload belong to you</td>
              <td>Unity Gaming Services (our service provider); a session token stays on your device</td>
            </tr>
            <tr>
              <td>
                Uploaded cities: the city&apos;s save data, its name, a picture of the city, and a share code linked to your player ID
              </td>
              <td>Only when you tap Upload (Settings ▸ Saves)</td>
              <td>So you can move your city to another device or share it with friends (an upload is a public share, not an automatic backup)</td>
              <td>
                Unity Cloud Save (our service provider). <strong>Uploaded cities are public:</strong> any player who has the City ID can
                download a copy.
              </td>
            </tr>
            <tr>
              <td>Crash logs, app diagnostics, performance data and device identifiers (device model, OS version, app version, error traces)</td>
              <td>Automatically, mostly when the game crashes, freezes or reports an error</td>
              <td>To find and fix crashes and performance problems</td>
              <td>Unity (engine diagnostics)</td>
            </tr>
            <tr>
              <td>IP address and basic connection data</td>
              <td>Whenever the game talks to online services</td>
              <td>Needed to deliver any online service; we do not use it to locate you</td>
              <td>Processed by Unity&apos;s servers to deliver the service</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        The game does <strong>not</strong> collect your name, email address, phone number, precise or approximate location, contacts,
        photos, videos, audio, files, messages, browsing history, the list of apps on your device, or payment information. On
        Android it asks for no permission you have to grant: its manifest declares only normal install-time permissions (internet
        access, network state, and the foreground-service permissions used by its built-in libraries).
      </p>

      <h2>3. Data this website handles</h2>
      <ul>
        <li>
          <strong>&quot;Notify me&quot; form:</strong> your email address, so we can tell you about the closed test, the store pages
          and the launch. Nothing else is sent to that address.
        </li>
        <li>
          <strong>Contact form:</strong> your name and message, and the email address and phone number if you choose to give them, so
          we can read and answer your message.
        </li>
        <li>
          Both forms are stored with <strong>Google Forms</strong> (Google acts as our service provider). The website has no
          analytics, advertising or tracking cookies of its own. It is hosted on GitHub Pages, which may log basic request data (such
          as IP addresses) for security.
        </li>
        {analytics.umamiWebsiteId && (
          <li>
            <strong>Visit statistics:</strong> we count visits with <strong>Umami</strong>, which uses no cookies and does not store
            your IP address. It records the page, the referring site, your browser, device type and approximate location (country,
            region and city), and we only see these as totals.
          </li>
        )}
      </ul>

      <h2>4. How we use data</h2>
      <ul>
        <li>To run the game&apos;s online features (the anonymous account, and uploading and downloading cities).</li>
        <li>To detect, investigate and fix crashes, freezes and performance problems.</li>
        <li>To answer your messages and to send the launch news you asked for.</li>
      </ul>
      <p>We do not use your data for advertising, we do not build advertising profiles, and we do not sell your data.</p>

      <h2>5. Who receives data</h2>
      <p>
        Our service providers process data on our behalf: <strong>Unity Technologies</strong> (Unity Gaming Services and the Unity
        engine) for the game, under the{" "}
        <a href="https://unity.com/legal/game-player-and-app-user-privacy-policy" target="_blank" rel="noreferrer">
          Unity Game Player and App User Privacy Policy
        </a>
        ; and <strong>Google</strong> (Google Forms) and <strong>GitHub</strong> (GitHub Pages) for this website. We may also disclose
        data if the law requires it, or to protect the rights and safety of our users or ourselves. We do not share data with
        advertisers or data brokers.
      </p>
      <p>
        <strong>Other players:</strong> when you upload a city, any player who has its City ID can download a copy of it, including its
        name and picture. Share a City ID only with people you want to have your city, and do not put personal information in a
        city&apos;s name.
      </p>

      <h2>6. Security</h2>
      <p>
        Everything the game and this website send over the internet is encrypted in transit (HTTPS/TLS). Game saves are kept in the
        game&apos;s private storage on your device.
      </p>

      <h2>7. How long data is kept</h2>
      <ul>
        <li>
          <strong>On your device:</strong> until you delete the city in the game, clear the app&apos;s data, or uninstall the game
          (on Windows, uninstalling keeps your cities; see section 8).
        </li>
        <li>
          <strong>Anonymous account and uploaded cities:</strong> until you delete them in the game (Delete Data, section 8) or ask
          us to delete them. Uploading the same city again
          replaces the earlier upload. Copies that other players have already downloaded stay on their devices, and we cannot delete
          those.
        </li>
        <li>
          <strong>Diagnostics:</strong> kept by Unity for the period described in Unity&apos;s privacy policy.
        </li>
        <li>
          <strong>Website form entries:</strong> until the game has launched and your message is answered, or until you ask us to
          delete them.
        </li>
      </ul>

      <h2 id="delete">8. Your choices and how to delete your data</h2>
      <ul>
        <li>
          <strong>Play offline:</strong> the game works fully without internet. Offline, nothing is sent, except that diagnostics may be
          sent the next time you are online.
        </li>
        <li>
          <strong>Don&apos;t upload:</strong> if you never tap Upload, your cities stay only on your device.
        </li>
        <li>
          <strong>Delete game data on your device:</strong> delete a city from the game&apos;s city list (this does not remove a copy
          you uploaded). To remove everything: on Android, clear the app&apos;s storage or uninstall the game; on iPhone and iPad,
          delete the app; on Windows, delete the folder <code>{"%USERPROFILE%\\AppData\\LocalLow\\HIZARC\\DEPTHCITY"}</code> (your cities) and the registry key{" "}
          <code>{"HKEY_CURRENT_USER\\Software\\HIZARC\\DEPTHCITY"}</code> (settings and the anonymous player ID). Uninstalling the game on Windows keeps both.
          Delete your online data first (next point): once the player ID is gone from the device, Delete Data in a fresh install
          cannot reach your earlier uploads.
        </li>
        <li>
          <strong>Delete your online data in the game:</strong> Settings ▸ Interface ▸ Privacy &amp; Support ▸ <em>Delete Data</em>
          (tap twice, with an internet connection) deletes the cities this install uploaded and its anonymous player ID.
        </li>
        <li>
          <strong>Or ask us</strong> (also for website form entries): follow the steps on{" "}
          <Link href="/delete-data/">Delete my data</Link>, or email <a href={mail}>{site.supportEmail}</a>. We delete it within 30 days
          and confirm by email.
        </li>
        <li>
          Depending on where you live (for example the GDPR in the EU and UK, or privacy laws in California and India), you may have
          the right to access, correct, delete or receive a copy of your data, and to object to or restrict its use. Email us to use
          these rights. You may also complain to your local data protection authority.
        </li>
      </ul>

      <h2>9. Children</h2>
      <p>
        {site.name} is not directed to children under 13 (it contains cartoon war and combat). We do not knowingly collect personal
        data from children under 13. If you believe a child has given us data, contact us and we will delete it.
      </p>

      <h2>10. International transfers</h2>
      <p>
        Our service providers&apos; servers may be outside your country. Where this happens, your data is protected by the safeguards
        in their privacy policies.
      </p>

      <h2>11. Changes to this policy</h2>
      <p>
        If the game starts handling data in a new way (for example, signing in with Google or Apple), we will update this page and the
        effective date above before the change goes live.
      </p>

      <h2>12. Contact</h2>
      <p>
        {site.company} · <a href={mail}>{site.supportEmail}</a> · <Link href="/support/">Support</Link>
      </p>
    </LegalPage>
  );
}
