import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { SplashScreen } from "@/components/SplashScreen";

import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Team } from "@/components/Team";
import { FacultyAdvisor } from "@/components/FacultyAdvisor";
import { PsychologyTests } from "@/components/PsychologyTests";
import { PsychologyGames } from "@/components/PsychologyGames";
import { BrainSnap } from "@/components/BrainSnap";
import { GreatMinds } from "@/components/GreatMinds";
import { FactCard } from "@/components/FactCard";
import { ScrollProgress } from "@/components/ScrollProgress";
import { EasterEgg } from "@/components/EasterEgg";
import { ThoughtStream } from "@/components/ThoughtStream";
import { OpticalIllusions } from "@/components/OpticalIllusions";
import { JoinUs } from "@/components/JoinUs";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Counselling } from "@/pages/counselling";
import { BackToTop } from "@/components/BackToTop";
import { CustomCursor } from "@/components/CustomCursor";

const queryClient = new QueryClient();

function Home() {
  return (
    <div className="min-h-[100dvh] w-full bg-background text-foreground flex flex-col">
      <ScrollProgress />
      <Navbar />
      <CustomCursor />
      <main className="flex-1">
        <Hero />
        <About />
        <GreatMinds />
        <Team />
        <FacultyAdvisor />
        <BrainSnap />
        <PsychologyTests />
        <PsychologyGames />
        <OpticalIllusions />
        <ThoughtStream />
        <JoinUs />
      </main>
      <Footer />
      <FactCard />
      <EasterEgg />
      <BackToTop />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/counselling" component={Counselling} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [splash, setSplash] = useState(() => window.location.pathname === "/");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {splash && <SplashScreen onComplete={() => setSplash(false)} />}
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
