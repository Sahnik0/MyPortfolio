
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center section-padding">
      <div className="max-w-4xl mx-auto px-4">
        <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary animate-fade-down">
          Welcome to my portfolio
        </span>
        <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-display font-bold leading-tight animate-fade-up">
          Creating digital experiences with passion and purpose
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl animate-fade-up [animation-delay:200ms]">
          I'm a software developer focused on building beautiful, functional, and
          user-centered digital experiences.
        </p>
        <div className="mt-8 flex gap-4 animate-fade-up [animation-delay:400ms]">
          <Link to="/projects">
            <Button className="group">
              View Projects
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline">Contact Me</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;