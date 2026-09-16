"use client";

import { useState, useCallback } from "react";
import {
  HeroSection,
  RSVPSection,
  FooterSection,
} from "@/components/sections";
import {
  NavigationDots,
  InvitationIntro,
  BackgroundMusic,
} from "@/components/ui";

function SnapSection({
  children,
  id,
  scrollable,
}: {
  children: React.ReactNode;
  id?: string;
  scrollable?: boolean;
}) {
  return (
    <div className="snap-section w-full" id={id}>
      <div
        className={`flex-1 flex flex-col justify-center items-center w-full min-h-0 ${
          scrollable ? "overflow-y-auto" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default function Home() {
  const [musicReady, setMusicReady] = useState(false);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  const handleEnter = useCallback(() => {
    setMusicReady(true);
  }, []);

  return (
    <>
      <BackgroundMusic src={`${basePath}/AlexTurner.mp3`} play={musicReady} />

      <InvitationIntro onEnter={handleEnter}>
        <NavigationDots />
        <main>
          <SnapSection id="invitation" scrollable>
            <HeroSection />
          </SnapSection>

          <SnapSection id="rsvp" scrollable>
            <RSVPSection />
            <FooterSection />
          </SnapSection>
        </main>
      </InvitationIntro>
    </>
  );
}
