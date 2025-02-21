import React, { useState, useEffect } from 'react';
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const TypewriterText = ({ text, delay = 150, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(c => c + 1);
      }, delay);

      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, delay, onComplete]);

  return <span>{displayText}</span>;
};

const Index = () => {
  const [welcomeComplete, setWelcomeComplete] = useState(false);
  const [headingComplete, setHeadingComplete] = useState(false);
  const [descriptionComplete, setDescriptionComplete] = useState(false);
  
  const allComplete = welcomeComplete && headingComplete && descriptionComplete;

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center section-padding">
      <div className="max-w-4xl mx-auto">
        <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary animate-fade-down">
          <TypewriterText 
            text="Welcome to my portfolio" 
            delay={160}
            onComplete={() => setWelcomeComplete(true)} 
          />
        </span>

        <h1 className="mt-6 text-6xl font-display font-bold leading-tight animate-fade-up">
          <TypewriterText 
            text="Creating digital experiences with passion and purpose" 
            delay={80}
            onComplete={() => setHeadingComplete(true)}
          />
        </h1>

        <p className="mt-6 text-xl text-muted-foreground max-w-2xl animate-fade-up [animation-delay:200ms]">
          <TypewriterText 
            text="I'm a software developer focused on building beautiful, functional, and user-centered digital experiences."
            delay={40}
            onComplete={() => setDescriptionComplete(true)}
          />
        </p>

        <div className={`mt-8 flex gap-4 transition-all duration-1000 ${allComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
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