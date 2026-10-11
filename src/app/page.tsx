import SmoothScroll from "@/components/SmoothScroll";
import SoundProvider from "@/components/sound/SoundProvider";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import CityBuildSection from "@/components/city/CityBuildSection";
import Pillars from "@/components/Pillars";
import GameplaySection from "@/components/GameplaySection";
import DayNight from "@/components/DayNight";
import SeasonsSection from "@/components/SeasonsSection";
import SkySection from "@/components/SkySection";
import MayorSection from "@/components/MayorSection";
import WildSection from "@/components/WildSection";
import ShowSection from "@/components/ShowSection";
import DisastersSection from "@/components/DisastersSection";
import WarSection from "@/components/WarSection";
import SpaceSection from "@/components/SpaceSection";
import SocietySection from "@/components/SocietySection";
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
      <GameplaySection />
      <DayNight />
      <SeasonsSection />
      <SkySection />
      <MayorSection />
      <WildSection />
      <ShowSection />
      <DisastersSection />
      <WarSection />
      <SpaceSection />
      <SocietySection />
      <Gallery />
      <Stats />
      <Creator />
      <ContactSection />
      <Footer />
    </main>
  );
}
