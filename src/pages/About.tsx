import { Button } from "@/components/ui/button";
import { FileText, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const About = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadResume = async () => {
    setIsDownloading(true);
    try {
      // TODO: Replace with actual resume file path
      const resumePath = '/path/to/your/resume.pdf';
      const response = await fetch(resumePath);
      const blob = await response.blob();
      
      // Create a temporary link to download the file
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading resume:', error);
    } finally {
      setIsDownloading(false);
    }
  };

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
            {["React", "TypeScript", "C++", "Java", "TailwindCSS", "Firebase"].map((skill) => (
              <div
                key={skill}
                className="glass-card px-4 py-3 rounded-lg text-center 
                  transition-all duration-300 hover:scale-105 hover:shadow-lg 
                  cursor-pointer active:scale-95 hover:bg-accent/50"
                onClick={() => console.log(`${skill} clicked`)}
              >
                {skill}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 animate-fade-up [animation-delay:600ms]">
          <Link to="/contact">
            <Button 
              className="w-full sm:w-auto transform transition-all duration-300 
                hover:scale-105 active:scale-95 hover:shadow-lg"
            >
              <Mail className="mr-2 h-4 w-4" />
              Contact Me
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="w-full sm:w-auto transform transition-all duration-300 
              hover:scale-105 active:scale-95 hover:shadow-lg hover:bg-accent/10"
            onClick={handleDownloadResume}
            disabled={isDownloading}
          >
            <FileText className="mr-2 h-4 w-4" />
            {isDownloading ? 'Downloading...' : 'Download Resume'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default About;
