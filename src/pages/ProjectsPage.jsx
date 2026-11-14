// src/pages/ProjectsPage.jsx
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
// import { ParticlesBackground, GlowOrbs } from "../componenets/portfolio/ParticlesBackground";
// import { Navbar } from "../componenets/portfolio/Navbar";
// import { Footer } from "../componenets/portfolio/Footer";
// import { ProjectCard } from "../componenets/portfolio/ProjectCard";
import { projects } from "../lib/admin-data";

export default function ProjectsPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <GlowOrbs />
      <ParticlesBackground />
      <div className="relative z-10">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 pt-32 pb-24">
          <Link
            to="/"
            className="glass inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-foreground transition hover:scale-105 hover:text-[color:var(--neon-cyan)] hover:glow-border"
          >
            <FiArrowLeft /> Back to Home
          </Link>
          <div className="mt-8 max-w-2xl">
            <h1 className="text-5xl font-bold sm:text-6xl">
              All <span className="text-gradient">Projects</span>
            </h1>
            <p className="mt-4 text-muted-foreground">
              A complete look at what I've been building — from client work to weekend experiments.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => (
              <ProjectCard key={p.title} p={p} index={i} />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}