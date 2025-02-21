import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { Github, Linkedin, Twitter, Instagram } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Message sent!",
      description: "Thank you for your message. I'll get back to you soon.",
    });

    setFormData({ name: "", email: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const socialLinks = [
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://linkedin.com/in/sahnik-biswas-8514012a7",
    },
    {
      name: "GitHub",
      icon: Github,
      url: "https://github.com/Sahnik0",
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: "https://x.com/sahnik_biswas",
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://instagram.com/sahnik_biswas",
    },
  ];

  return (
    <div className="section-padding min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <h1 className="text-4xl md:text-5xl font-display font-bold animate-fade-up">
          Get in Touch
        </h1>
        <p className="mt-4 text-lg text-muted-foreground animate-fade-up [animation-delay:200ms]">
          Have a question or want to work together? Feel free to reach out!
        </p>

        <div className="mt-6 flex justify-center space-x-8 animate-fade-up [animation-delay:1s]">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors hover:scale-110 transform duration-200"
              aria-label={social.name}
            >
              <social.icon className="h-8 w-8" />
            </a>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 animate-fade-up [animation-delay:400ms]"
        >
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your email"
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your message"
              rows={6}
              required
              className="w-full"
            />
          </div>

          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={isSubmitting}
          >
            <Send className="mr-2 h-4 w-4" />
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>

        <div className="mt-16 text-center text-muted-foreground animate-fade-up [animation-delay:600ms]">
          <p>Prefer email?</p>
          <a
            href="mailto:tb123983@gmail.com"
            className="text-primary hover:underline"
          >
            tb123983@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;