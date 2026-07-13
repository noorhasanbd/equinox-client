import CategoriesSection from "@/components/shared/homepage/CategoriesSection";
import DestinationsSection from "@/components/shared/homepage/Destination";
import HeroSection from "@/components/shared/homepage/HeroSection";
import StatsSection from "@/components/shared/homepage/StatsSection";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans ">

      <HeroSection/>
      <StatsSection/>
      <CategoriesSection/>
      <DestinationsSection/>
      
    </div>
  );
}
