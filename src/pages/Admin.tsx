import { useEffect, useState } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc, serverTimestamp, getDoc, setDoc, increment } from "firebase/firestore";
import { auth, googleProvider, db } from "@/lib/firebase";
import { uploadImageToCloudinary } from "@/utils/cloudinary";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { LogOut, Trash2, Edit, Plus, Users, Clock, Eye, Upload, Image } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
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

interface GalleryImage {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

interface ProjectFormState {
  title: string;
  description: string;
  tags: string;
  liveUrl: string;
  githubUrl: string;
  imageUrl: string;
  imageFile: File | null;
}

interface BlogFormState {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
}

interface GalleryFormState {
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  imageFile: File | null;
}

const Admin = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [error, setError] = useState<string>("");
  const [visitStats, setVisitStats] = useState<VisitStats[]>([]);
  const [totalVisits, setTotalVisits] = useState(0);
  const [averageVisits, setAverageVisits] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [blogDialogOpen, setBlogDialogOpen] = useState(false);
  const [galleryDialogOpen, setGalleryDialogOpen] = useState(false);
  
  const [projectForm, setProjectForm] = useState<ProjectFormState>({
    title: "",
    description: "",
    tags: "",
    liveUrl: "",
    githubUrl: "",
    imageUrl: "",
    imageFile: null
  });
  
  const [blogForm, setBlogForm] = useState<BlogFormState>({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    category: ""
  });

  const [galleryForm, setGalleryForm] = useState<GalleryFormState>({
    title: "",
    description: "",
    category: "",
    imageUrl: "",
    imageFile: null
  });

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

  const fetchGalleryImages = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "galleryImages"));
      const imagesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GalleryImage[];
      setGalleryImages(imagesData);
    } catch (error) {
      console.error("Error fetching gallery images:", error);
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
      if (collection === "galleryImages") fetchGalleryImages();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the item.",
        variant: "destructive",
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, formSetter: (value: any) => void, currentForm: any) => {
    if (e.target.files && e.target.files[0]) {
      formSetter({
        ...currentForm,
        imageFile: e.target.files[0],
        imageUrl: URL.createObjectURL(e.target.files[0])
      });
    }
  };

  const handleUploadImage = async (formData: any, formSetter: (value: any) => void) => {
    if (!formData.imageFile) {
      toast({
        title: "No image selected",
        description: "Please select an image to upload.",
        variant: "destructive",
      });
      return;
    }

    setImageUploading(true);
    
    try {
      const imageUrl = await uploadImageToCloudinary(formData.imageFile);
      formSetter({
        ...formData,
        imageUrl
      });
      toast({
        title: "Image uploaded",
        description: "Image successfully uploaded to Cloudinary.",
      });
      return imageUrl;
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      console.error(error);
      return null;
    } finally {
      setImageUploading(false);
    }
  };

  const handleSave = async (collectionName: string, data: any) => {
    try {
      if (isEditing && currentItem) {
        await updateDoc(doc(db, collectionName, currentItem.id), {
          ...data,
          updatedAt: serverTimestamp(),
        });
        toast({
          title: "Success",
          description: "Item updated successfully.",
        });
      } else {
        await addDoc(collection(db, collectionName), {
          ...data,
          createdAt: serverTimestamp(),
        });
        toast({
          title: "Success",
          description: "Item created successfully.",
        });
      }
      
      if (collectionName === "projects") fetchProjects();
      if (collectionName === "blogPosts") fetchBlogPosts();
      if (collectionName === "galleryImages") fetchGalleryImages();
      resetForms();
      setDialogOpen(false);
      setBlogDialogOpen(false);
      setGalleryDialogOpen(false);
    } catch (error) {
      console.error("Error saving item:", error);
      toast({
        title: "Error",
        description: "Failed to save the item. Please try again.",
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
      imageFile: null
    });
    setBlogForm({
      title: "",
      excerpt: "",
      content: "",
      author: "",
      category: "",
    });
    setGalleryForm({
      title: "",
      description: "",
      category: "",
      imageUrl: "",
      imageFile: null
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
      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || "",
      imageUrl: project.imageUrl || "",
      imageFile: null
    });
    setDialogOpen(true);
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
    setBlogDialogOpen(true);
  };

  const handleEditGalleryImage = (image: GalleryImage) => {
    setIsEditing(true);
    setCurrentItem(image);
    setGalleryForm({
      title: image.title,
      description: image.description,
      category: image.category || "",
      imageUrl: image.imageUrl || "",
      imageFile: null
    });
    setGalleryDialogOpen(true);
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

  useEffect(() => {
    incrementVisitCount();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user?.email === "tb123983@gmail.com") {
        fetchContacts();
        fetchProjects();
        fetchBlogPosts();
        fetchGalleryImages();
        fetchVisitStats();
      }
    });

    return () => unsubscribe();
  }, []);

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
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
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
                    <RechartsTooltip 
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
              <Dialog open={dialogOpen} onOpenChange={(open) => {
                setDialogOpen(open);
                if (!open) resetForms();
              }}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    resetForms();
                    setDialogOpen(true);
                  }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>
                      {isEditing ? "Edit Project" : "Add New Project"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
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
                      <label className="block text-sm font-medium mb-1">Project Image</label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, setProjectForm, projectForm)}
                          className="flex-1"
                        />
                        <Button 
                          type="button" 
                          onClick={() => handleUploadImage(projectForm, setProjectForm)}
                          disabled={!projectForm.imageFile || imageUploading}
                          size="sm"
                        >
                          {imageUploading ? "Uploading..." : "Upload"}
                          <Upload className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                      {projectForm.imageUrl && (
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground mb-1">Image Preview:</p>
                          <img 
                            src={projectForm.imageUrl} 
                            alt="Preview" 
                            className="max-h-40 object-cover rounded-md" 
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      onClick={() => {
                        const projectData = {
                          title: projectForm.title,
                          description: projectForm.description,
                          tags: projectForm.tags
                            .split(",")
                            .map((tag) => tag.trim())
                            .filter(Boolean),
                          liveUrl: projectForm.liveUrl,
                          githubUrl: projectForm.githubUrl,
                          imageUrl: projectForm.imageUrl,
                        };
                        handleSave("projects", projectData);
                      }}
                      disabled={!projectForm.imageUrl || !projectForm.title}
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
                  <div className="flex gap-4">
                    {project.imageUrl && (
                      <img 
                        src={project.imageUrl} 
                        alt={project.title} 
                        className="w-24 h-24 object-cover rounded-md"
                      />
                    )}
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
              <Dialog open={blogDialogOpen} onOpenChange={(open) => {
                setBlogDialogOpen(open);
                if (!open) resetForms();
              }}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    resetForms();
                    setBlogDialogOpen(true);
                  }}>
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

          <TabsContent value="gallery" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={galleryDialogOpen} onOpenChange={(open) => {
                setGalleryDialogOpen(open);
                if (!open) resetForms();
              }}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    resetForms();
                    setGalleryDialogOpen(true);
                  }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Gallery Image
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>
                      {isEditing ? "Edit Gallery Image" : "Add New Gallery Image"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
                    <div className="space-y-2">
                      <Input
                        placeholder="Image Title"
                        value={galleryForm.title}
                        onChange={(e) =>
                          setGalleryForm({ ...galleryForm, title: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Image Description"
                        value={galleryForm.description}
                        onChange={(e) =>
                          setGalleryForm({
                            ...galleryForm,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        placeholder="Category"
                        value={galleryForm.category}
                        onChange={(e) =>
                          setGalleryForm({ ...galleryForm, category: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium mb-1">Image</label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, setGalleryForm, galleryForm)}
                          className="flex-1"
                        />
                        <Button 
                          type="button" 
                          onClick={() => handleUploadImage(galleryForm, setGalleryForm)}
                          disabled={!galleryForm.imageFile || imageUploading}
                          size="sm"
                        >
                          {imageUploading ? "Uploading..." : "Upload"}
                          <Upload className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                      {galleryForm.imageUrl && (
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground mb-1">Image Preview:</p>
                          <img 
                            src={galleryForm.imageUrl} 
                            alt="Preview" 
                            className="max-h-40 object-cover rounded-md" 
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      onClick={() => {
                        const galleryData = {
                          title: galleryForm.title,
                          description: galleryForm.description,
                          category: galleryForm.category,
                          imageUrl: galleryForm.imageUrl,
                        };
                        handleSave("galleryImages", galleryData);
                      }}
                      disabled={!galleryForm.imageUrl || !galleryForm.title}
                    >
                      {isEditing ? "Update" : "Add"} Gallery Image
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryImages.map((image) => (
                <Card key={image.id} className="overflow-hidden">
                  <div className="aspect-square">
                    <img 
                      src={image.imageUrl} 
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{image.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{image.description}</p>
                        {image.category && (
                          <span className="inline-block mt-2 text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                            {image.category}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditGalleryImage(image)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete("galleryImages", image.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              {galleryImages.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  <Image className="mx-auto h-12 w-12 opacity-20 mb-4" />
                  <p>No gallery images found. Add some images to get started!</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;