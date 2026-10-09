import { useLocation, useRouteContext } from "@tanstack/react-router";
import { useState } from "react";
import type { PublicLayoutProps } from "@/features/theme/contract/layouts";
import { BackToTop } from "../components/control/back-to-top";
import { Footer } from "./footer";
import { MobileMenu } from "./mobile-menu";
import { Navbar } from "./navbar";

const BANNER_HEIGHT_HOME = 45;
const BANNER_HEIGHT_PAGE = 30;
const MAIN_OVERLAP_REM = 3.5;
const NAVBAR_HEIGHT_REM = 4.5;

export function PublicLayout({
  children,
  navOptions,
  user,
  isSessionLoading,
  logout,
}: PublicLayoutProps) {
  const { siteConfig } = useRouteContext({ from: "__root__" });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const bannerHeightVh = isHomePage ? BANNER_HEIGHT_HOME : BANNER_HEIGHT_PAGE;

  return (
    <div className="relative min-h-screen bg-(--fuwari-page-bg) transition-colors">
      <MobileMenu
        navOptions={navOptions}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        user={user}
        logout={logout}
      />

      {/* Top row: Navbar - sticky */}
      <div className="sticky top-0 z-50 pointer-events-none">
        <div className="pointer-events-auto max-w-3xl mx-auto px-0 md:px-4">
          <Navbar
            navOptions={navOptions}
            onMenuClick={() => setIsMenuOpen(true)}
            user={user}
            isLoading={isSessionLoading}
            bannerHeightVh={bannerHeightVh}
          />
        </div>
      </div>

      {/* Banner - full width background */}
      <div
        className="absolute left-0 right-0 top-0 z-10 overflow-hidden transition-[height] duration-300 ease-in-out"
        style={{ height: `${bannerHeightVh}vh` }}
      >
        <img
          src={siteConfig.theme.fuwari.homeBg}
          alt="banner"
          fetchPriority="high"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Main content - single column centered */}
      <div
        className="relative z-30 transition-[margin-top] duration-300 ease-in-out"
        style={{
          marginTop: `calc(${bannerHeightVh}vh - ${MAIN_OVERLAP_REM}rem - ${NAVBAR_HEIGHT_REM}rem)`,
        }}
      >
        <div className="relative mx-auto px-0 md:px-4 pb-8 flex flex-col gap-4 max-w-3xl">
          <main className="flex flex-col gap-4 min-w-0">
            {children}
          </main>

          <div className="fuwari-onload-animation mt-auto" style={{ animationDelay: "250ms" }}>
            <Footer navOptions={navOptions} />
          </div>

          <BackToTop />
        </div>
      </div>
    </div>
  );
}