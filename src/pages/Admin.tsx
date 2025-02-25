import { useEffect, useState } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc, serverTimestamp, increment, getDoc, setDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { LogOut, Trash2, Edit, Plus, Users, Clock, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: any;
}

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  liveUrl: string;
  githubUrl: string;
  imageUrl: string;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
}

interface VisitStats {
  id: string;
  count: number;
  date: string;
}

const Admin = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState<string>("");
  const [visitStats, setVisitStats] = useState<VisitStats[]>([]);
  const [totalVisits, setTotalVisits] = useState(0);
  const [averageVisits, setAverageVisits] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    tags: "",
    liveUrl: "",
    githubUrl: "",
    imageUrl: "",
  });
  const [blogForm, setBlogForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    category: "",
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user?.email === "tb123983@gmail.com") {
        fetchContacts();
        fetchProjects();
        fetchBlogPosts();
        fetchVisitStats();
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    incrementVisitCount();
  }, []);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user.email !== "tb123983@gmail.com") {
        await signOut(auth);
        setError("Unauthorized access. Please use the correct Google account.");
      }
    } catch (error) {
      setError("Error signing in with Google");
    }
  };

  const handleLogout = () => {
    signOut(auth);
    setContacts([]);
    setProjects([]);
    setBlogPosts([]);
  };

  const fetchContacts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "contacts"));
      const contactsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Contact[];
      setContacts(contactsData.sort((a, b) => b.timestamp - a.timestamp));
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "projects"));
      const projectsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      setProjects(projectsData);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchBlogPosts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "blogPosts"));
      const blogData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlogPost[];
      setBlogPosts(blogData);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    }
  };

  const fetchVisitStats = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "visits"));
      const statsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as VisitStats[];

      statsData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setVisitStats(statsData);

      const total = statsData.reduce((acc, curr) => acc + (curr.count || 0), 0);
      setTotalVisits(total);

      setAverageVisits(Math.round(total / (statsData.length || 1)));
    } catch (error) {
      console.error("Error fetching visit stats:", error);
    }
  };

  const incrementVisitCount = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const visitRef = doc(db, "visits", today);
      const visitDoc = await getDoc(visitRef);

      if (visitDoc.exists()) {
        await updateDoc(visitRef, {
          count: increment(1)
        });
      } else {
        await setDoc(visitRef, {
          count: 1,
          date: today
        });
      }
    } catch (error) {
      console.error("Error updating visit count:", error);
    }
  };

  const handleDelete = async (collection: string, id: string) => {
    try {
      await deleteDoc(doc(db, collection, id));
      toast({
        title: "Deleted successfully",
        description: "The item has been removed.",
      });
      if (collection === "contacts") fetchContacts();
      if (collection === "projects") fetchProjects();
      if (collection === "blogPosts") fetchBlogPosts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the item.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (collectionName: string, data: any) => {
    try {
      if (isEditing && currentItem) {
        await updateDoc(doc(db, collectionName, currentItem.id), {
          ...data,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, collectionName), {
          ...data,
          createdAt: serverTimestamp(),
        });
      }
      toast({
        title: "Success",
        description: `Item ${isEditing ? "updated" : "created"} successfully.`,
      });
      if (collectionName === "projects") fetchProjects();
      if (collectionName === "blogPosts") fetchBlogPosts();
      resetForms();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the item.",
        variant: "destructive",
      });
    }
  };

  const resetForms = () => {
    setProjectForm({
      title: "",
      description: "",
      tags: "",
      liveUrl: "",
      githubUrl: "",
      imageUrl: "",
    });
    setBlogForm({
      title: "",
      excerpt: "",
      content: "",
      author: "",
      category: "",
    });
    setIsEditing(false);
    setCurrentItem(null);
  };

  const handleEditProject = (project: Project) => {
    setIsEditing(true);
    setCurrentItem(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      tags: project.tags.join(", "),
      liveUrl: project.liveUrl,
      githubUrl: project.githubUrl,
      imageUrl: project.imageUrl,
    });
  };

  const handleEditBlogPost = (post: BlogPost) => {
    setIsEditing(true);
    setCurrentItem(post);
    setBlogForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      category: post.category,
    });
  };

  if (!user || user.email !== "tb123983@gmail.com") {
    return (
      <div className="section-padding min-h-screen">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-4xl font-display font-bold mb-6">Admin Login</h1>
          {error && (
            <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-md">
              {error}
            </div>
          )}
          <Button onClick={handleLogin} size="lg">
            Sign in with Google
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-display font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="contacts">Messages</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="blog">Blog Posts</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <h3 className="font-semibold">Total Visitors</h3>
                </div>
                <p className="text-2xl font-bold mt-2">{totalVisits}</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <h3 className="font-semibold">Avg. Daily Visits</h3>
                </div>
                <p className="text-2xl font-bold mt-2">{averageVisits}</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <h3 className="font-semibold">Today's Visits</h3>
                </div>
                <p className="text-2xl font-bold mt-2">
                  {visitStats.find(stat => stat.date === new Date().toISOString().split('T')[0])?.count || 0}
                </p>
              </Card>
            </div>
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Visitor Traffic</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={visitStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => new Date(date).toLocaleDateString()}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(date) => new Date(date).toLocaleDateString()}
                      formatter={(value) => [value as number, "Visits"]}
                    />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-4">
            {contacts.map((contact) => (
              <div key={contact.id} className="glass-card p-6 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{contact.name}</h3>
                    <p className="text-muted-foreground">{contact.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete("contacts", contact.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-foreground/90 whitespace-pre-wrap">
                  {contact.message}
                </p>
                <span className="text-sm text-muted-foreground block mt-4">
                  {new Date(contact.timestamp?.toDate()).toLocaleString()}
                </span>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <div className="flex justify-end">
              <Dialog onOpenChange={() => resetForms()}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Project
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {isEditing ? "Edit Project" : "Add New Project"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Input
                        placeholder="Project Title"
                        value={projectForm.title}
                        onChange={(e) =>
                          setProjectForm({ ...projectForm, title: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Project Description"
                        value={projectForm.description}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        placeholder="Tags (comma separated)"
                        value={projectForm.tags}
                        onChange={(e) =>
                          setProjectForm({ ...projectForm, tags: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        placeholder="Live URL"
                        value={projectForm.liveUrl}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            liveUrl: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        placeholder="GitHub URL"
                        value={projectForm.githubUrl}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            githubUrl: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        placeholder="Image URL"
                        value={projectForm.imageUrl}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            imageUrl: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={() =>
                        handleSave("projects", {
                          ...projectForm,
                          tags: projectForm.tags
                            .split(",")
                            .map((tag) => tag.trim())
                            .filter(Boolean),
                        })
                      }
                    >
                      {isEditing ? "Update" : "Create"} Project
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            {projects.map((project) => (
              <Card key={project.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{project.title}</h3>
                    <p className="text-muted-foreground mt-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditProject(project)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete("projects", project.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="blog" className="space-y-4">
            <div className="flex justify-end">
              <Dialog onOpenChange={() => resetForms()}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Blog Post
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {isEditing ? "Edit Blog Post" : "Add New Blog Post"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Input
                        placeholder="Post Title"
                        value={blogForm.title}
                        onChange={(e) =>
                          setBlogForm({ ...blogForm, title: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        placeholder="Excerpt"
                        value={blogForm.excerpt}
                        onChange={(e) =>
                          setBlogForm({ ...blogForm, excerpt: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Content"
                        value={blogForm.content}
                        onChange={(e) =>
                          setBlogForm({ ...blogForm, content: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        placeholder="Author"
                        value={blogForm.author}
                        onChange={(e) =>
                          setBlogForm({ ...blogForm, author: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        placeholder="Category"
                        value={blogForm.category}
                        onChange={(e) =>
                          setBlogForm({ ...blogForm, category: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={() =>
                        handleSave("blogPosts", {
                          ...blogForm,
                          date: new Date().toISOString(),
                        })
                      }
                    >
                      {isEditing ? "Update" : "Create"} Blog Post
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            {blogPosts.map((post) => (
              <Card key={post.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{post.title}</h3>
                    <p className="text-muted-foreground mt-2">{post.excerpt}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>{post.author}</span>
                      <span>{post.category}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditBlogPost(post)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete("blogPosts", post.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;