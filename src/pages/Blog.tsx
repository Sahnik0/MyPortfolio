
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";

const Blog = () => {
  const blogPosts = [
  
  ];

  return (
    <div className="section-padding">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-display font-bold animate-fade-up">
          Blog
        </h1>
        <p className="mt-4 text-lg text-muted-foreground animate-fade-up [animation-delay:200ms]">
          Thoughts, stories, and ideas about web development and design.
        </p>

        <div className="mt-12 space-y-8 animate-fade-up [animation-delay:400ms]">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="glass-card rounded-lg overflow-hidden group"
            >
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="h-48 md:h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-6 md:w-2/3">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {post.author}
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-display font-semibold mb-2">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {post.category}
                    </span>
                    <Button variant="ghost" className="group" asChild>
                      <Link to={`/blog/${post.id}`}>
                        Read More
                        <BookOpen className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;