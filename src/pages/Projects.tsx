
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";

const Projects = () => {
  const projects = [
    {
      title: "E-commerce Platform",
      description: "A full-stack e-commerce solution built with React and Firebase",
      tags: ["React", "Firebase", "Tailwind CSS"],
      liveUrl: "#",
      githubUrl: "#",
      imageUrl: "/placeholder.svg",
    },
    {
      title: "Task Management App",
      description: "A collaborative task management tool for teams",
      tags: ["TypeScript", "React", "Firebase"],
      liveUrl: "#",
      githubUrl: "#",
      imageUrl: "/placeholder.svg",
    },
    {
      title: "Weather Dashboard",
      description: "Real-time weather information with interactive maps",
      tags: ["React", "APIs", "Charts"],
      liveUrl: "#",
      githubUrl: "#",
      imageUrl: "/placeholder.svg",
    },
    {
      title: "Social Media Dashboard",
      description: "Analytics dashboard for social media performance tracking",
      tags: ["Next.js", "TypeScript", "Analytics"],
      liveUrl: "#",
      githubUrl: "#",
      imageUrl: "/placeholder.svg",
    },
    {
      title: "AI Image Generator",
      description: "Generate custom images using state-of-the-art AI models",
      tags: ["AI/ML", "Python", "React"],
      liveUrl: "#",
      githubUrl: "#",
      imageUrl: "/placeholder.svg",
    },
    {
      title: "Portfolio Website",
      description: "Modern portfolio website with dark mode and responsive design",
      tags: ["React", "Tailwind CSS", "TypeScript"],
      liveUrl: "#",
      githubUrl: "#",
      imageUrl: "/placeholder.svg",
    },
  ];

  return (
    <div className="section-padding">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-display font-bold animate-fade-up">
          My Projects
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl animate-fade-up [animation-delay:200ms]">
          Here are some of my featured projects. Each one represents unique
          challenges and learning experiences.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-up [animation-delay:400ms]">
          {projects.map((project, index) => (
            <div
              key={index}
              className="glass-card rounded-lg overflow-hidden group"
            >
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
              <div className="p-6">
                <h3 className="text-xl font-display font-semibold">
                  {project.title}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {project.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex gap-4">
                  <Button size="sm" className="w-full sm:w-auto">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Live Demo
                  </Button>
                  <Button size="sm" variant="outline" className="w-full sm:w-auto">
                    <Github className="mr-2 h-4 w-4" />
                    Code
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
