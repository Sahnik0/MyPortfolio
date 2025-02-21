
import { Button } from "@/components/ui/button";
import { FileText, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="section-padding">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-display font-bold animate-fade-up">
          About Me
        </h1>
        <div className="mt-8 space-y-6 text-lg text-muted-foreground animate-fade-up [animation-delay:200ms]">
          <p>
            Hi! I'm a passionate software developer with expertise in building
            modern web applications. I specialize in React, TypeScript, and modern
            web technologies.
          </p>
          <p>
            With several years of experience in the industry, I've worked on
            various projects ranging from small business websites to large-scale
            enterprise applications.
          </p>
          <p>
            My approach to development focuses on creating clean, maintainable code
            while ensuring an excellent user experience across all devices.
          </p>
        </div>
        
        <div className="mt-12 space-y-6 animate-fade-up [animation-delay:400ms]">
          <h2 className="text-2xl font-display font-semibold">Skills</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {["React", "TypeScript", "Node.js", "Next.js", "TailwindCSS", "Firebase"].map((skill) => (
              <div
                key={skill}
                className="glass-card px-4 py-3 rounded-lg text-center"
              >
                {skill}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 animate-fade-up [animation-delay:600ms]">
          <Link to="/contact">
            <Button className="w-full sm:w-auto">
              <Mail className="mr-2 h-4 w-4" />
              Contact Me
            </Button>
          </Link>
          <Button variant="outline" className="w-full sm:w-auto">
            <FileText className="mr-2 h-4 w-4" />
            Download Resume
          </Button>
        </div>
      </div>
    </div>
  );
};

export default About;
