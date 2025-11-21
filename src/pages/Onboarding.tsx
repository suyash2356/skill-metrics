import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";

const TOTAL_STEPS = 5;

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    displayName: "",
    background: "",
    education: "",
    jobTitle: "",
    company: "",
    experienceLevel: "",
    skills: [] as string[],
    learningGoals: "",
    bio: "",
  });

  const [skillInput, setSkillInput] = useState("");

  const handleAddSkill = () => {
    if (skillInput.trim() && formData.skills.length < 10) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()],
      });
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (index: number) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index),
    });
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Update user_preferences
      const { error: prefsError } = await supabase
        .from("user_preferences")
        .upsert({
          user_id: user.id,
          display_name: formData.displayName,
        });

      if (prefsError) throw prefsError;

      // Update user_profile_details
      const { error: profileError } = await supabase
        .from("user_profile_details")
        .upsert({
          user_id: user.id,
          bio: formData.bio,
          experience_level: formData.experienceLevel,
          job_title: formData.jobTitle,
          company: formData.company,
          skills: formData.skills.map((skill) => ({
            name: skill,
            level: formData.experienceLevel,
          })),
          learning_path: {
            background: formData.background,
            education: formData.education,
            goals: formData.learningGoals,
          },
        });

      if (profileError) throw profileError;

      // Update profiles table with display name
      const { error: updateProfileError } = await supabase
        .from("profiles")
        .update({ full_name: formData.displayName })
        .eq("user_id", user.id);

      if (updateProfileError) throw updateProfileError;

      toast({
        title: "Welcome aboard! 🎉",
        description: "Your profile has been set up successfully",
      });

      navigate("/home");
    } catch (error: any) {
      console.error("Onboarding error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const progress = (currentStep / TOTAL_STEPS) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Welcome to Your Learning Journey
            </h1>
          </motion.div>
          <p className="text-muted-foreground text-lg">
            Let's personalize your experience
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-xl p-8 backdrop-blur-sm">
          <div className="mb-8">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Step {currentStep} of {TOTAL_STEPS}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-[300px]"
            >
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-2">What should we call you?</h2>
                    <p className="text-muted-foreground">This will be your display name</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Full Name</Label>
                    <Input
                      id="displayName"
                      placeholder="John Doe"
                      value={formData.displayName}
                      onChange={(e) =>
                        setFormData({ ...formData, displayName: e.target.value })
                      }
                      className="text-lg"
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-2">Tell us about yourself</h2>
                    <p className="text-muted-foreground">What's your current situation?</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="background">Background</Label>
                      <select
                        id="background"
                        value={formData.background}
                        onChange={(e) =>
                          setFormData({ ...formData, background: e.target.value })
                        }
                        className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select your background</option>
                        <option value="student">Student</option>
                        <option value="professional">Working Professional</option>
                        <option value="self-learner">Self Learner</option>
                        <option value="career-switcher">Career Switcher</option>
                        <option value="freelancer">Freelancer</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="education">Education Level</Label>
                      <select
                        id="education"
                        value={formData.education}
                        onChange={(e) =>
                          setFormData({ ...formData, education: e.target.value })
                        }
                        className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select education level</option>
                        <option value="high-school">High School</option>
                        <option value="bachelors">Bachelor's Degree</option>
                        <option value="masters">Master's Degree</option>
                        <option value="phd">PhD</option>
                        <option value="bootcamp">Bootcamp</option>
                        <option value="self-taught">Self Taught</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-2">Professional Details</h2>
                    <p className="text-muted-foreground">Optional but helps us personalize</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">Current Role / Job Title</Label>
                      <Input
                        id="jobTitle"
                        placeholder="e.g. Frontend Developer, Student"
                        value={formData.jobTitle}
                        onChange={(e) =>
                          setFormData({ ...formData, jobTitle: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company / Institution</Label>
                      <Input
                        id="company"
                        placeholder="e.g. Google, MIT"
                        value={formData.company}
                        onChange={(e) =>
                          setFormData({ ...formData, company: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-2">Your Skills & Interests</h2>
                    <p className="text-muted-foreground">What do you want to learn?</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="experienceLevel">Experience Level</Label>
                      <select
                        id="experienceLevel"
                        value={formData.experienceLevel}
                        onChange={(e) =>
                          setFormData({ ...formData, experienceLevel: e.target.value })
                        }
                        className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select experience level</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="skills">Skills / Topics of Interest</Label>
                      <div className="flex gap-2">
                        <Input
                          id="skills"
                          placeholder="e.g. React, Python, Machine Learning"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                        />
                        <Button type="button" onClick={handleAddSkill} size="sm">
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {formData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2"
                          >
                            {skill}
                            <button
                              onClick={() => handleRemoveSkill(index)}
                              className="hover:text-destructive"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-2">Final Touch</h2>
                    <p className="text-muted-foreground">Share your learning goals</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="learningGoals">What are your learning goals?</Label>
                      <Textarea
                        id="learningGoals"
                        placeholder="e.g. I want to become a full-stack developer and build my own startup"
                        value={formData.learningGoals}
                        onChange={(e) =>
                          setFormData({ ...formData, learningGoals: e.target.value })
                        }
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Short Bio (Optional)</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us a bit about yourself..."
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData({ ...formData, bio: e.target.value })
                        }
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            {currentStep < TOTAL_STEPS ? (
              <Button onClick={handleNext} className="gap-2">
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={handleComplete} disabled={loading} className="gap-2">
                {loading ? "Completing..." : "Complete Setup"}
                <Sparkles className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/home")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip for now
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
