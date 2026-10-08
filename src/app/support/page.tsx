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
        <li>Your phone model (for example, Samsung Galaxy S21) and Android or iOS version.</li>
        <li>The game version (shown in the corner of the title screen, for example v0.1.3).</li>
        <li>What you were doing when the problem happened, and a screenshot or screen recording if you can.</li>
        <li>
          For upload or data questions, your Player ID: Settings ▸ Interface ▸ Privacy &amp; Support ▸ <em>Copy</em>.
        </li>
      </ul>

      <h2>Common questions</h2>

      <h3>Where are my cities saved?</h3>
      <p>
        On your phone, in the game&apos;s private storage. <strong>Uninstalling the game or clearing its storage deletes your
        cities</strong>, so to update the game, install the new version over the old one instead of uninstalling first. To keep an
        online copy, upload the city (next question).
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
        <li>Turn on <strong>Smart Frame Rate</strong> in the game&apos;s settings. It keeps a steady 30 fps and uses less battery.</li>
        <li>Large cities with many buildings, troops and traffic need more power. Zooming out to the full-city view is the heaviest
          view.</li>
        <li>Close other apps, and avoid playing for long while the phone is charging. Phones slow down when they get hot.</li>
      </ul>

      <h3>Which devices are supported?</h3>
      <ul>
        <li>
          <strong>Android:</strong> Android 7.1 or newer with 4 GB RAM. A mid-range phone or better (Snapdragon 720G class) is the
          minimum; Snapdragon 865 class or newer with 6–8 GB RAM is recommended for large cities.
        </li>
        <li>
          <strong>iOS:</strong> iPhone 11 or newer; iPhone 13 or newer recommended.
        </li>
      </ul>

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
