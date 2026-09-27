import SmoothScroll from "@/components/SmoothScroll";
import SoundProvider from "@/components/sound/SoundProvider";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import CityBuildSection from "@/components/city/CityBuildSection";
import Pillars from "@/components/Pillars";
import DayNight from "@/components/DayNight";
import StreetView from "@/components/StreetView";
import SkySection from "@/components/SkySection";
import WildSection from "@/components/WildSection";
import WarSection from "@/components/WarSection";
import SpaceSection from "@/components/SpaceSection";
import SocietySection from "@/components/SocietySection";
import ShowSection from "@/components/ShowSection";
import Gallery from "@/components/Gallery";
import Stats from "@/components/Stats";
import Creator from "@/components/Creator";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative">
      <SmoothScroll />
      <SoundProvider />
      <Nav />
      <Hero />
      <CityBuildSection />
      <Pillars />
      <DayNight />
      <StreetView />
      <SkySection />
      <WildSection />
      <WarSection />
      <SpaceSection />
      <SocietySection />
      <ShowSection />
      <Gallery />
      <Stats />
      <Creator />
      <ContactSection />
      <Footer />
    </main>
  );
}
