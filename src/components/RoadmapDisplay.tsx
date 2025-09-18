import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Check, Clock, Play, Book, Video, ExternalLink, Network, PenTool, Trophy, Star, Flag, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { updateTopicProgress } from "@/services/roadmapGenerator";
import { Roadmap } from "@/types/roadmap";

interface RoadmapDisplayProps {
  roadmap: Roadmap;
  onRoadmapUpdate: (roadmap: Roadmap) => void;
  onDeleteRoadmap?: () => void;
  className?: string;
}

const RoadmapDisplay: React.FC<RoadmapDisplayProps> = ({
  roadmap,
  onRoadmapUpdate,
  onDeleteRoadmap,
  className
}) => {
  const [expandedTopics, setExpandedTopics] = useState(new Set<string>());
  const [currentRoadmap, setCurrentRoadmap] = useState(roadmap);

  useEffect(() => {
    setCurrentRoadmap(roadmap);
  }, [roadmap]);

  const toggleTopic = (topicId: string) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicId)) {
      newExpanded.delete(topicId);
    } else {
      newExpanded.add(topicId);
    }
    setExpandedTopics(newExpanded);
  };

  const toggleSubtopicCompletion = async (topicId: string, subtopicId: string) => {
    const topic = currentRoadmap.topics.find(t => t.id === topicId);
    const subtopic = topic?.subtopics.find(s => s.id === subtopicId);
    if (subtopic) {
      const optimisticRoadmap = JSON.parse(JSON.stringify(currentRoadmap));
      const optTopic = optimisticRoadmap.topics.find((t: { id: string }) => t.id === topicId);
      const optSubtopic = optTopic.subtopics.find((s: { id: string }) => s.id === subtopicId);
      optSubtopic.completed = !subtopic.completed;
      setCurrentRoadmap(optimisticRoadmap);
      const updatedRoadmap = await updateTopicProgress(
        currentRoadmap.id,
        topicId,
        subtopicId,
        !subtopic.completed
      );
      if (updatedRoadmap) {
        setCurrentRoadmap(updatedRoadmap);
        onRoadmapUpdate?.(updatedRoadmap);
      }
    }
  };

  const toggleTopicCompletion = async (topicId: string) => {
    const topic = currentRoadmap.topics.find(t => t.id === topicId);
    if (topic) {
      const optimisticRoadmap = JSON.parse(JSON.stringify(currentRoadmap));
      const optTopic = optimisticRoadmap.topics.find((t: { id: string; }) => t.id === topicId);
      optTopic.completed = !topic.completed;
      if (Array.isArray(optTopic.subtopics)) {
        optTopic.subtopics.forEach((s: { completed: string; }) => s.completed = optTopic.completed);
      }
      setCurrentRoadmap(optimisticRoadmap);
      const updatedRoadmap = await updateTopicProgress(
        currentRoadmap.id,
        topicId,
        null,
        !topic.completed
      );
      if (updatedRoadmap) {
        setCurrentRoadmap(updatedRoadmap);
        onRoadmapUpdate?.(updatedRoadmap);
      }
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'book': return <Book className="h-4 w-4" />;
      case 'course': return <Play className="h-4 w-4" />;
      case 'project': return <Network className="h-4 w-4" />;
      case 'practice': return <PenTool className="h-4 w-4" />;
      default: return <ExternalLink className="h-4 w-4" />;
    }
  };

  const formatTimeEstimate = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)}min`;
    if (hours === 1) return '1 hour';
    return `${hours} hours`;
  };

  const calculateTimeToComplete = () => {
    if (!currentRoadmap || !Array.isArray(currentRoadmap.topics)) return 0;
    return currentRoadmap.topics.reduce((total, topic) => {
      if (!topic.completed) {
        return total + topic.estimatedHours;
      }
      return total;
    }, 0);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  };

  const topicVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 120,
        damping: 12
      }
    }
  };

  const subtopicVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  };

  const floatingVariants = {
    hover: {
      y: -5,
      transition: {
        type: "spring" as const,
        stiffness: 300
      }
    }
  };

  return (
    <motion.div
      className={cn("space-y-6 relative", className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Stats Cards */}
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden relative group bg-white/60 dark:bg-black/50 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-2xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">{currentRoadmap.title}</CardTitle>
            <p className="text-muted-foreground">{currentRoadmap.description}</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Progress Card */}
              <motion.div
                variants={floatingVariants}
                whileHover="hover"
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Card className="w-full bg-white/60 dark:bg-black/50 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-2xl shadow-xl">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-3">
                      <motion.div
                        className="p-2 bg-[#1EB36B]/10 rounded-full"
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Trophy className="h-5 w-5 text-[#1EB36B]" />
                      </motion.div>
                      <div>
                        <p className="text-sm font-medium">Progress</p>
                        <p className="text-2xl font-bold">{Math.round(currentRoadmap.overallProgress)}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Time Card */}
              <motion.div
                variants={floatingVariants}
                whileHover="hover"
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Card className="w-full bg-white/60 dark:bg-black/50 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-2xl shadow-xl">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-3">
                      <motion.div
                        className="p-2 bg-[#1EB36B]/10 rounded-full"
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Clock className="h-5 w-5 text-[#1EB36B]" />
                      </motion.div>
                      <div>
                        <p className="text-sm font-medium">Remaining</p>
                        <p className="text-2xl font-bold">{calculateTimeToComplete()}h</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Timeline Card */}
              <motion.div
                variants={floatingVariants}
                whileHover="hover"
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Card className="w-full bg-white/60 dark:bg-black/50 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-2xl shadow-xl">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-3">
                      <motion.div
                        className="p-2 bg-[#1EB36B]/10 rounded-full"
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Calendar className="h-5 w-5 text-[#1EB36B]" />
                      </motion.div>
                      <div>
                        <p className="text-sm font-medium">Timeline</p>
                        <p className="text-2xl font-bold">{currentRoadmap.params.timeframe}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Progress Bar */}
      <motion.div variants={itemVariants}>
        <Card className="bg-white/60 dark:bg-black/50 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-2xl shadow-xl">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm font-medium">{Math.round(currentRoadmap.overallProgress)}%</span>
              </div>
              <Progress value={currentRoadmap.overallProgress} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Topics */}
      <motion.div className="space-y-4" variants={containerVariants}>
        {currentRoadmap.topics.map((topic, index) => (
          <motion.div
            key={topic.id}
            variants={topicVariants}
            whileHover={{ scale: 1.01, y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card
              className={cn(
                "transition-all duration-300 relative group bg-white/60 dark:bg-black/50 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-2xl shadow-xl",
                topic.completed && "bg-[#1EB36B]/5 border-[#1EB36B]/20 shadow-lg"
              )}
            >
              <CardHeader
                className="cursor-pointer space-y-4 pb-2"
                onClick={() => toggleTopic(topic.id)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start space-x-4 flex-1 min-w-0">
                    <div className="flex items-start space-x-2">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 h-9 w-9 shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTopic(topic.id);
                          }}
                        >
                          <motion.div
                            animate={{
                              rotate: expandedTopics.has(topic.id) ? 90 : 0,
                              scale: expandedTopics.has(topic.id) ? 1.1 : 1
                            }}
                            transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                          >
                            {expandedTopics.has(topic.id) ?
                              <ChevronDown className="h-4 w-4" /> :
                              <ChevronRight className="h-4 w-4" />
                            }
                          </motion.div>
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <Checkbox
                          checked={topic.completed}
                          onCheckedChange={() => toggleTopicCompletion(topic.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="mt-2"
                        />
                      </motion.div>
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold break-words text-base sm:text-lg md:text-xl leading-snug line-clamp-2 sm:line-clamp-1">
                          {index + 1}. {topic.title}
                        </h3>
                        <Badge variant="outline" className="capitalize shrink-0">
                          {topic.priority}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm md:text-base text-muted-foreground break-words whitespace-normal leading-snug line-clamp-3 sm:line-clamp-2">{topic.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 ml-[52px] sm:ml-0">
                    <div className="flex items-center gap-2">
                      <div className="w-[80px] sm:w-[100px]">
                        <Progress value={topic.progress} />
                      </div>
                      <span className="text-sm font-medium min-w-[40px]">{topic.progress}%</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground whitespace-nowrap">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatTimeEstimate(topic.estimatedHours)}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <AnimatePresence>
                {expandedTopics.has(topic.id) && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={subtopicVariants}
                  >
                    <CardContent className="pt-0">
                      <motion.div
                        className="space-y-4"
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                      >
                        {topic.subtopics.map((subtopic) => (
                          <motion.div
                            key={subtopic.id}
                            variants={itemVariants}
                            whileHover={{ scale: 1.02, x: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <Card
                              className={cn(
                                "transition-all duration-300 bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-xl",
                                subtopic.completed && "bg-[#1EB36B]/5 border-[#1EB36B]/20 shadow-md"
                              )}
                            >
                              <CardContent className="p-4">
                                <div className="flex flex-col gap-4">
                                  <div className="flex items-start gap-3">
                                    <div className="pt-1">
                                      <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        transition={{ type: "spring", stiffness: 400 }}
                                      >
                                        <Checkbox
                                          checked={subtopic.completed}
                                          onCheckedChange={() => toggleSubtopicCompletion(topic.id, subtopic.id)}
                                        />
                                      </motion.div>
                                    </div>
                                    <div className="space-y-1 min-w-0 flex-1">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <h4 className="font-medium text-sm sm:text-base md:text-lg break-words leading-snug line-clamp-2">{subtopic.title}</h4>
                                        <div className="flex flex-wrap items-center gap-2">
                                          <Badge variant="outline" className="capitalize whitespace-nowrap text-xs border-[#1EB36B]/30 text-[#1EB36B] bg-[#1EB36B]/5">
                                            <Star className="h-3 w-3 mr-1" />
                                            {subtopic.difficulty}
                                          </Badge>
                                          <div className="flex items-center text-xs text-muted-foreground whitespace-nowrap">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {formatTimeEstimate(subtopic.estimatedHours)}
                                          </div>
                                        </div>
                                      </div>
                                      <p className="text-xs sm:text-sm md:text-base text-muted-foreground break-words whitespace-normal leading-snug line-clamp-3 sm:line-clamp-2">{subtopic.description}</p>
                                    </div>
                                  </div>

                                  {subtopic.resources && subtopic.resources.length > 0 && (
                                    <motion.div
                                      className="mt-4 space-y-2"
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: 0.2 }}
                                    >
                                      <h5 className="text-sm font-medium">Learning Resources:</h5>
                                      <div className="grid gap-2">
                                        {subtopic.resources.map((resource, resourceIndex) => (
                                          resource.url ? (
                                            <a
                                              key={resourceIndex}
                                              href={resource.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="rounded-md"
                                              aria-label={`Open resource: ${resource.title}`}
                                            >
                                              <motion.div
                                                className="flex items-start space-x-3 p-2 rounded-md bg-white/50 dark:bg-black/30 border border-white/30 dark:border-white/10 backdrop-blur-sm cursor-pointer"
                                                whileHover={{ scale: 1.02, backgroundColor: "rgba(30, 179, 107, 0.08)" }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                              >
                                                <div className="mt-0.5">
                                                  {getResourceIcon(resource.type)}
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                  <div className="flex items-center justify-between">
                                                    <h6 className="font-medium text-sm sm:text-base break-words leading-snug line-clamp-2">{resource.title}</h6>
                                                    <ExternalLink className="h-4 w-4 opacity-70" />
                                                  </div>
                                                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground break-words whitespace-normal leading-snug line-clamp-3 sm:line-clamp-2">{resource.description}</p>
                                                </div>
                                              </motion.div>
                                            </a>
                                          ) : (
                                            <motion.div
                                              key={resourceIndex}
                                              className="flex items-start space-x-3 p-2 rounded-md bg-white/50 dark:bg-black/30 border border-white/30 dark:border-white/10 backdrop-blur-sm"
                                              whileHover={{ scale: 1.02, backgroundColor: "rgba(30, 179, 107, 0.08)" }}
                                              transition={{ type: "spring", stiffness: 300 }}
                                            >
                                              <div className="mt-0.5">
                                                {getResourceIcon(resource.type)}
                                              </div>
                                              <div className="flex-1 space-y-1">
                                                <h6 className="font-medium text-sm sm:text-base break-words leading-snug line-clamp-2">{resource.title}</h6>
                                                <p className="text-xs sm:text-sm md:text-base text-muted-foreground break-words whitespace-normal leading-snug line-clamp-3 sm:line-clamp-2">{resource.description}</p>
                                              </div>
                                            </motion.div>
                                          )
                                        ))}
                                      </div>
                                    </motion.div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </motion.div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer Stats */}
      <motion.div variants={itemVariants}>
        <Card className="bg-white/60 dark:bg-black/50 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-2xl shadow-xl">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                className="space-y-1"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className="text-sm text-muted-foreground">Topics Completed</p>
                <p className="text-2xl font-bold">
                  {currentRoadmap.topics.filter(t => t.completed).length}
                  <span className="text-base font-normal text-muted-foreground">
                    /{currentRoadmap.topics.length}
                  </span>
                </p>
              </motion.div>
              <motion.div
                className="space-y-1"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className="text-sm text-muted-foreground">Subtopics Completed</p>
                <p className="text-2xl font-bold">
                  {currentRoadmap.topics.reduce((total, topic) =>
                    total + (topic.subtopics.filter(s => s.completed).length), 0)}
                  <span className="text-base font-normal text-muted-foreground">
                    /{currentRoadmap.topics.reduce((total, topic) =>
                      total + topic.subtopics.length, 0)}
                  </span>
                </p>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default RoadmapDisplay;