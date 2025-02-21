import { Button } from "@/components/ui/button";
import { FileText, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const TypeWriter = ({ text, delay = 50, onComplete }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, delay);

      return () => clearTimeout(timeout);
    } else if (onComplete) {
      setTimeout(() => {
        onComplete();
      }, 200); 
    }
  }, [currentIndex, delay, text, onComplete]);

  return (
    <span>{currentText}</span>
  );
};

const About = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [visibleParagraphs, setVisibleParagraphs] = useState([true, false, false]);
  const [completedParagraphs, setCompletedParagraphs] = useState([false, false, false]);

  const paragraphs = [
    "Hi! I'm a passionate software developer with expertise in building modern web applications. I specialize in React, TypeScript, and modern web technologies.",
    "With several years of experience in the industry, I've worked on various projects ranging from small business websites to large-scale enterprise applications.",
    "My approach to development focuses on creating clean, maintainable code while ensuring an excellent user experience across all devices."
  ];

  const handleDownloadResume = async () => {
    setIsDownloading(true);
    try {
      // TODO: Replace with actual resume file path
      const resumePath = '/path/to/your/resume.pdf';
      const response = await fetch(resumePath);
      const blob = await response.blob();

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

  const handleParagraphComplete = (index) => {
    setCompletedParagraphs(prev => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });

    if (index < paragraphs.length - 1) {
      setTimeout(() => {
        setVisibleParagraphs(prev => {
          const newState = [...prev];
          newState[index + 1] = true;
          return newState;
        });
      }, 200); 
    }
  };

  return (
    <div className="section-padding">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-display font-bold animate-fade-up">
          About Me
        </h1>
        <div className="mt-8 space-y-6 text-lg text-muted-foreground animate-fade-up [animation-delay:200ms]">
          {paragraphs.map((text, index) => (
            <p key={index} className={`transition-opacity duration-300 ${visibleParagraphs[index] ? 'opacity-100' : 'opacity-0'}`}>
              {visibleParagraphs[index] && (
                <TypeWriter 
                  text={text} 
                  delay={30} 
                  onComplete={() => handleParagraphComplete(index)}
                />
              )}
            </p>
          ))}
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