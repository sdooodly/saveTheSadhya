"use client";

import {
  HeroSection,
  RSVPSection,
  FooterSection,
} from "@/components/sections";
import {
  NavigationDots,
  InvitationIntro,
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
  return (
    <InvitationIntro>
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
  );
}
