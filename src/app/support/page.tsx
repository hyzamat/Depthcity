import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `Support — ${site.name}`,
  description: `Get help with ${site.name}: contact, common questions and supported devices.`,
  alternates: { canonical: "/support/" },
};

export default function SupportPage() {
  const mail = `mailto:${site.supportEmail}?subject=${encodeURIComponent(`${site.name} support`)}`;
  return (
    <LegalPage eyebrow="Help" title="Support">
      <div className="summary">
        <p>
          Found a bug, lost a city, or the game runs slowly? Email us at <a href={mail}>{site.supportEmail}</a>. We read every message
          and usually answer within 2 working days.
        </p>
      </div>

      <h2>Contact us</h2>
      <p>
        <strong>Email:</strong> <a href={mail}>{site.supportEmail}</a>
        <br />
        <strong>Developer:</strong> {site.company}
      </p>
      <p>To help us fix a problem quickly, please include:</p>
      <ul>
        <li>Your device (for example, Samsung Galaxy S21, iPhone 16 Pro or a Windows PC) and its Android, iOS or Windows version.</li>
        <li>The game version (shown in the corner of the title screen, for example v1.0.0).</li>
        <li>What you were doing when the problem happened, and a screenshot or screen recording if you can.</li>
        <li>
          For upload or data questions, your Player ID: Settings ▸ Interface ▸ Privacy &amp; Support ▸ <em>Copy</em>.
        </li>
      </ul>

      <h2>Common questions</h2>

      <h3>Where are my cities saved?</h3>
      <p>
        On your device, in the game&apos;s own app storage. On Android, iPhone and iPad, <strong>uninstalling the game or clearing
        its storage deletes your cities</strong>, so to update the game, install the new version over the old one instead of
        uninstalling first. On Windows, cities are kept in <code>{"%USERPROFILE%\\AppData\\LocalLow\\HIZARC\\DEPTHCITY"}</code> and stay there when you update or uninstall.
        Uploading a city (next question) gives you a copy you can download again with its City ID, but it is a public share, not
        an automatic backup.
      </p>

      <h3>Can I move my city to a new phone?</h3>
      <p>
        Yes. On the old phone, open Settings ▸ Saves ▸ <strong>Upload</strong>. The game gives the city a City ID (for example
        K7Q2M9-3) and copies it for you. On the new phone, open Settings ▸ Saves ▸ <strong>Download</strong>, enter the ID, and open
        the city from the Cities tab. Uploaded cities are public: anyone who has the City ID can download a copy, so share it only
        with people you want to have your city.
      </p>

      <h3>The game is slow or my phone gets warm.</h3>
      <ul>
        <li>
          On phones, <strong>Cool Play</strong> and <strong>Smart Frame Rate</strong> are on by default (Settings ▸ Quality ▸ Battery
          Saver). Check they are still on, and for the coolest play also turn on <strong>Limit to 30 FPS</strong>.
        </li>
        <li>Large cities with many buildings, troops and traffic need more power. Zooming out to the full-city view is the heaviest
          view.</li>
        <li>Close other apps, and avoid playing for long while the phone is charging. Phones slow down when they get hot.</li>
      </ul>

      <h3>Which devices are supported?</h3>
      <ul>
        <li>
          <strong>Android:</strong> Android 7.1 or newer with at least 4 GB RAM. Tested on a Samsung Galaxy S21 Ultra and an iQOO
          Neo 10. A recent mid-range phone or better is recommended for large cities.
        </li>
        <li>
          <strong>iPhone and iPad:</strong> iOS 15 or newer. Tested on an iPhone 16 Pro.
        </li>
        <li>
          <strong>Windows:</strong> 64-bit Windows 10 or newer. Tested on a laptop with an RTX 4070 graphics card.
        </li>
      </ul>

      <h3>Shared cities: rules and reporting</h3>
      <p>
        Uploaded cities are public. The first time you upload, the game shows the rules: no offensive names or pictures and no
        personal details, and cities that break them are removed. The game also refuses offensive city names. To report a city, open
        Settings ▸ Saves ▸ Download, enter its City ID and tap <strong>Report</strong>, or email us the City ID.
      </p>

      <h3>Does the game need internet?</h3>
      <p>
        No. The game works fully offline. Only uploading and downloading cities need a connection. When you are online the game
        signs in anonymously, so the cities you upload stay yours. See the <Link href="/privacy/">Privacy Policy</Link>.
      </p>

      <h3>Are there ads or in-app purchases?</h3>
      <p>No. There are no ads and no in-app purchases.</p>

      <h3>How do I delete my data?</h3>
      <p>
        See <Link href="/delete-data/">Delete my data</Link>.
      </p>
    </LegalPage>
  );
}
