import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const portfolioInfo = `
SAHNIK BISWAS
FullStack Webdev
Karimpur, West Bengal 741165
Ph: +91 7407902174 Mail: tb123983@gmail.com

PROFESSIONAL SUMMARY
Skilled in API integration, responsive design, and Firebase-powered backend solutions, with expertise in TypeScript, Firebase, and UI/UX principles. Optimized web performance to enhance user engagement and load times. A problem-solver with a collaborative approach, focused on building scalable, user-centric solutions that improve workflows and accessibility.

WEBSITES, PORTFOLIOS, PROFILES
● http://www.sahnik.tech

WORK HISTORY
02/2025 to 03/2025 Full-Stack Developer
TherapyU – Barasat, West Bengal
● Developed functional databases, applications and servers to support websites on back-end
● Integrated third-party APIs to enhance functionality and improve overall user experience on web platforms
● Reduced page load times by optimizing front-end assets such as TypeScript files, stylesheets, and images
● Reviewed code, debugged problems, and corrected issues
● Used Firebase to manage database
● Enhanced user experience by developing and implementing a responsive front-end interface for web applications

EDUCATION
03/2023 to Current B.Tech: Computer Science
Adamas University - Barasat
01/2021 to 01/2023 HS
Mahishbathan Manoj Mohan Vidyamandir - Mahishbathan, Nadia

ACCOMPLISHMENTS
● Google Developers Student's Club Certified
● RCIIT Smart Bengal Hackathon Finalist
● Innofusion - 1.0 Finalist
● Level SuperMind Finalist (Mumbai)
● 3rd Place - Upskill Mafia

PERSONAL DETAILS
Date of Birth: 18/12/2004 Nationality: Indian
Gender: Male Religion: Hindu

LANGUAGES
Bengali English
Hindi

SKILLS
● C++ ● Java
● Fullstack ● React
● Javascript ● Firebase
● API integration ● Typescript
● Prompt Engineering ● Team collaboration
● Project management

SOCIAL
Github : https://github.com/Sahnik0
LinkedIn: https://www.linkedin.com/in/sahnik-biswas

PROJECTS
Lexishift [lexishift.vercel.app]
A dyslexia friendly LexiShift helps individuals with dyslexia by making reading, learning, and communication easier. It provides tools like a PDF converter with dyslexia-friendly fonts, an AI therapist for constant support, a supportive community, a digital library, and an interactive learning platform. It also connects users with therapists through LexiCare, ensuring they get the right help when needed. The project aims to remove barriers and create a more inclusive digital space for dyslexic individuals.

Team-Up [team-up-fldl.vercel.app]
A hackathon teammate-finding platform that connects developers based on skills and project needs.
• Implemented AI-driven recommendations, matching users with the most relevant teammates based on expertise and project compatibility.
• Built a real-time group chat & collaboration system, enabling seamless communication before and during hackathons.

Stud-Bud [stud-bud-rust.vercel.app]
An AI-powered educational platform integrating the Gemini API for text-based note generation and AI tutoring. Implemented YouTube-based lecture recommendations and a social learning system, allowing users to connect, challenge friends, and compete in quizzes. Designed and optimized an interactive leaderboard system and credit-based reward mechanism, enhancing user engagement and retention. Built using TypeScript, Firebase, and modern UI/UX principles to ensure seamless performance and scalability

Bunkcall [bunk-cal.vercel.app]
Calculates attendance.
`;

export function AiChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Add welcome message when chat is opened
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        { 
          role: "assistant", 
          content: "Hi there! I'm Sahnik's AI assistant. I can answer questions about his skills, experience, and projects based on his portfolio data. How can I help you today?" 
        }
      ]);
    }
  }, [open, messages.length]);

  const generateLocalResponse = (question: string): string => {
    // Convert question to lowercase for easier matching
    question = question.toLowerCase();
    
    // Create sections from portfolio info for "database-like" search
    const portfolioSections = {
      skills: "C++, Java, Fullstack, React, Javascript, Firebase, API integration, Typescript, Prompt Engineering, Team collaboration, Project management",
      education: "B.Tech in Computer Science at Adamas University, Barasat (since 2023). High school at Mahishbathan Manoj Mohan Vidyamandir, Nadia (2021-2023).",
      projects: "LexiShift (dyslexia-friendly tools), Team-Up (hackathon teammate platform), Stud-Bud (AI-powered educational platform), and Bunkcall (attendance calculator)",
      experience: "Full-Stack Developer at TherapyU (Feb-Mar 2025). Developed functional databases and servers, integrated third-party APIs, optimized front-end assets, enhanced user experience through responsive design.",
      contact: "Email: tb123983@gmail.com, Website: www.sahnik.tech, Github: Sahnik0, LinkedIn: sahnik-biswas",
      achievements: "Google Developers Student's Club certification, RCIIT Smart Bengal Hackathon Finalist, Innofusion - 1.0 Finalist, Level SuperMind Finalist (Mumbai), 3rd Place at Upskill Mafia",
      personal: "Date of Birth: 18/12/2004, Nationality: Indian, Gender: Male, Religion: Hindu, Languages: Bengali, English, Hindi"
    };
    
    // Define specific keywords for skills and technologies
    const skillKeywords = [
      "c++", "java", "fullstack", "react", "javascript", "firebase", 
      "api", "typescript", "prompt engineering", "team collaboration", 
      "project management", "programming", "coding", "development"
    ];
    
    // Check for specific skill queries first
    const skillsFound = skillKeywords.filter(skill => question.includes(skill));
    
    if (skillsFound.length > 0) {
      if (skillsFound.includes("java")) {
        return "Yes, based on his portfolio data, Sahnik is skilled in Java programming language, along with other technologies such as C++, React, JavaScript, Firebase, API integration, and TypeScript.";
      }
      if (skillsFound.includes("c++")) {
        return "Yes, according to his portfolio, Sahnik is proficient in C++ programming. He also has skills in Java, React, JavaScript, Firebase, and other technologies.";
      }
      if (skillsFound.includes("react")) {
        return "Yes, his portfolio indicates that he's skilled in React development. He uses it along with TypeScript and JavaScript to create responsive web applications.";
      }
      if (skillsFound.includes("firebase")) {
        return "Yes, Sahnik has experience with Firebase. According to his portfolio, he's used it for database management in various projects.";
      }
      
      // For other skills, return a general skill response
      return `Based on his portfolio database, Sahnik is skilled in the technologies you mentioned (${skillsFound.join(", ")}). His complete skill set includes: ${portfolioSections.skills}.`;
    }
    
    // Process general category queries
    if (question.includes("skills") || question.includes("technologies") || question.includes("what can") || question.includes("know") || question.includes("good at")) {
      return `Based on his portfolio database, Sahnik is skilled in: ${portfolioSections.skills}. He focuses on building responsive and user-friendly web applications.`;
    } 
    else if (question.includes("education") || question.includes("study") || question.includes("university") || question.includes("college")) {
      return `According to his records, Sahnik is currently pursuing ${portfolioSections.education}`;
    }
    else if (question.includes("project") || question.includes("application") || question.includes("website") || question.includes("app")) {
      if (question.includes("lexishift")) {
        return "LexiShift is a dyslexia-friendly platform that Sahnik developed. It helps individuals with dyslexia by making reading, learning, and communication easier with tools like PDF converters with dyslexia-friendly fonts, AI therapy support, and interactive learning platforms.";
      } else if (question.includes("team-up")) {
        return "Team-Up is a hackathon teammate-finding platform that Sahnik created. It connects developers based on skills and project needs. He implemented AI-driven recommendations and built a real-time group chat & collaboration system.";
      } else if (question.includes("stud-bud")) {
        return "Stud-Bud is an AI-powered educational platform Sahnik built integrating the Gemini API for text-based note generation and AI tutoring. It includes YouTube-based lecture recommendations and a social learning system.";
      } else if (question.includes("bunkcall")) {
        return "Bunkcall is an attendance calculator application he developed.";
      } else {
        return `Fetching project data... His portfolio shows he's worked on: ${portfolioSections.projects}. Which one would you like to know more about?`;
      }
    }
    else if (question.includes("experience") || question.includes("work") || question.includes("job") || question.includes("career") || question.includes("background")) {
      return `Accessing work history... ${portfolioSections.experience}`;
    }
    else if (question.includes("contact") || question.includes("reach") || question.includes("email") || question.includes("github") || question.includes("linkedin")) {
      return `Contact details found: ${portfolioSections.contact}`;
    }
    else if (question.includes("achievement") || question.includes("award") || question.includes("accomplishment") || question.includes("certification")) {
      return `Retrieving achievements... His portfolio shows: ${portfolioSections.achievements}`;
    }
    else if (question.includes("personal") || question.includes("about") || question.includes("himself") || question.includes("age") || question.includes("birthday") || question.includes("language")) {
      return `Personal information: ${portfolioSections.personal}`;
    }
    else if (question.includes("hello") || question.includes("hi") || question.includes("hey") || question.includes("greetings")) {
      return "Hello! I'm Sahnik's AI assistant with access to his portfolio database. How can I help you today?";
    }
    else {
      // Check if the question contains any words that might be skills but weren't caught above
      const words = question.split(/\s+/);
      const portfolioText = portfolioInfo.toLowerCase();
      
      for (const word of words) {
        // Skip very short words and common words
        if (word.length <= 2 || ["the", "and", "for", "you", "are", "can", "has", "did", "does", "know"].includes(word)) {
          continue;
        }
        
        if (portfolioText.includes(word)) {
          if (portfolioSections.skills.toLowerCase().includes(word)) {
            return `Yes, according to his portfolio database, Sahnik is skilled in ${word}. His complete skill set includes: ${portfolioSections.skills}`;
          }
          
          if (portfolioSections.projects.toLowerCase().includes(word)) {
            return `Yes, his portfolio shows he's worked on projects related to ${word}. His projects include: ${portfolioSections.projects}`;
          }
          
          return `I found "${word}" in his portfolio. Would you like to know more about Sahnik's skills, projects, education, or experience related to this?`;
        }
      }
      
      return "I've searched his portfolio database but couldn't find specific information about that. I can tell you about Sahnik's skills, education, projects, work experience, achievements, or contact details. What would you like to know?";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // Simulate database access delay
      setTimeout(() => {
        // Generate response based on the user's question
        const response = generateLocalResponse(userMessage);
        
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: response },
        ]);
        setIsLoading(false);
      }, 1000); // Add a delay to simulate database fetching
    } catch (error) {
      console.error("Error generating response:", error);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch data from portfolio database. Please try again.",
      });
      
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error while accessing Sahnik's portfolio database. Please try again in a moment." },
      ]);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full glass-card"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chat with Sahnik's AI Assistant</DialogTitle>
          </DialogHeader>
          <div className="h-[400px] flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-4 p-4">
              {messages.map((message, i) => (
                <div
                  key={i}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg px-4 py-2 bg-muted">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <form onSubmit={handleSubmit} className="p-4 flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Sahnik's portfolio..."
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
