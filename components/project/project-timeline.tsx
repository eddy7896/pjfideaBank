"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { TimelineEvent, Idea } from "@/types";
import {
  Sparkles,
  ArrowRight,
  FileCheck,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { STATUS_COLORS } from "@/lib/constants";

interface ProjectTimelineProps {
  idea: Idea;
  onAddComment: (content: string) => void;
  canComment?: boolean;
  isLoading?: boolean;
}

const getEventIcon = (event: TimelineEvent) => {
  switch (event.type) {
    case "created":
      return <Sparkles className="h-5 w-5 text-primary" />;
    case "stage_change":
      return (
        <ArrowRight
          className={cn(
            "h-5 w-5",
            event.toStage ? STATUS_COLORS[event.toStage].text : "text-muted-foreground"
          )}
        />
      );
    case "form_submitted":
      return (
        <FileCheck
          className={cn(
            "h-5 w-5",
            event.stage ? STATUS_COLORS[event.stage].text : "text-muted-foreground"
          )}
        />
      );
    case "comment":
      return <MessageSquare className="h-5 w-5 text-muted-foreground" />;
    case "test_failed":
      return <AlertTriangle className="h-5 w-5 text-rose-500" />;
    default:
      return <div className="h-5 w-5 rounded-full bg-border" />;
  }
};

const getEventLabel = (event: TimelineEvent): string => {
  switch (event.type) {
    case "created":
      return "Project created";
    case "stage_change":
      return `Moved to ${event.toStage}`;
    case "form_submitted":
      return `${event.stage} documentation submitted`;
    case "comment":
      return "Comment added";
    case "test_failed":
      return "Test failed - Returned to Prototype";
    default:
      return event.content || "Event";
  }
};

export function ProjectTimeline({
  idea,
  onAddComment,
  canComment,
  isLoading,
}: ProjectTimelineProps) {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddComment = async () => {
    if (newComment.trim()) {
      setIsSubmitting(true);
      try {
        onAddComment(newComment);
        setNewComment("");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const sortedTimeline = [...idea.timeline].sort(
    (a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {canComment && (
        <div className="rounded-xl border border-border/50 bg-card p-5">
          <label className="block text-sm font-semibold mb-2">Add a Note</label>
          <div className="space-y-3">
            <Textarea
              placeholder="Add notes, comments, or updates about this project..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={isSubmitting}
              className="min-h-20"
            />
            <Button
              onClick={handleAddComment}
              disabled={!newComment.trim() || isSubmitting}
              size="sm"
            >
              {isSubmitting ? "Adding..." : "Add Note"}
            </Button>
          </div>
        </div>
      )}

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

        {/* Events */}
        <div className="space-y-6">
          {sortedTimeline.map((event, index) => (
            <div key={event.id} className="relative pl-16">
              {/* Icon bubble */}
              <div className="absolute left-0 top-0 h-12 w-12 rounded-full border-4 border-background bg-card flex items-center justify-center">
                {getEventIcon(event)}
              </div>

              {/* Event card */}
              <div className="rounded-lg border border-border/50 bg-card p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">
                      {getEventLabel(event)}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(event.timestamp)}
                    </p>
                    {event.author && (
                      <p className="text-xs text-muted-foreground">
                        by {event.author}
                      </p>
                    )}
                  </div>
                </div>

                {/* Event-specific content */}
                {event.type === "comment" && event.content && (
                  <div className="mt-3 text-sm text-foreground bg-background rounded p-3 border border-border/50">
                    {event.content}
                  </div>
                )}

                {event.type === "stage_change" && event.fromStage && event.toStage && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    <span
                      className={cn(
                        "inline-block px-2 py-1 rounded text-xs font-medium",
                        STATUS_COLORS[event.fromStage].bg,
                        STATUS_COLORS[event.fromStage].text
                      )}
                    >
                      {event.fromStage}
                    </span>
                    <ArrowRight className="inline h-4 w-4 mx-2 text-muted-foreground" />
                    <span
                      className={cn(
                        "inline-block px-2 py-1 rounded text-xs font-medium",
                        STATUS_COLORS[event.toStage].bg,
                        STATUS_COLORS[event.toStage].text
                      )}
                    >
                      {event.toStage}
                    </span>
                  </div>
                )}

                {event.type === "form_submitted" && event.stage && (
                  <div className="mt-3 space-y-2">
                    <span
                      className={cn(
                        "inline-block px-2 py-1 rounded text-xs font-medium",
                        STATUS_COLORS[event.stage].bg,
                        STATUS_COLORS[event.stage].text
                      )}
                    >
                      {event.stage} Documentation
                    </span>
                    <div className="mt-2 rounded-lg border border-border/50 bg-background p-3 text-foreground/80">
                      {renderStageDataDoc((idea.stageData as any)?.[event.stage])}
                    </div>
                  </div>
                )}

                {event.type === "test_failed" && (
                  <div className="mt-2 rounded bg-rose-50 border border-rose-200 p-2">
                    <p className="text-xs text-rose-700">
                      Project returned to Prototype stage for refinement based on test results.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function renderStageDataDoc(data: any) {
  if (!data) return <p className="text-xs text-muted-foreground italic">No documentation provided.</p>;

  // Empathize
  if ("what" in data) {
    return (
      <div className="space-y-2 text-xs leading-relaxed text-foreground/90">
        <p><strong>What:</strong> {data.what}</p>
        <p><strong>When:</strong> {data.when}</p>
        <p><strong>Where:</strong> {data.where}</p>
        <p><strong>Who:</strong> {data.who}</p>
        <p><strong>How:</strong> {data.how}</p>
        <p><strong>Root Cause Analysis:</strong> {data.rootCause}</p>
      </div>
    );
  }

  // Define
  if ("problemStatement" in data && !("brainstormIdeas" in data)) {
    return (
      <div className="space-y-2 text-xs leading-relaxed text-foreground/90">
        <p><strong>Problem Statement:</strong> {data.problemStatement}</p>
        <p><strong>User Persona:</strong> {data.userPersona}</p>
        <p><strong>Need Statement:</strong> {data.needStatement}</p>
      </div>
    );
  }

  // Ideate
  if ("brainstormIdeas" in data || "selectedIdea" in data) {
    return (
      <div className="space-y-2 text-xs leading-relaxed text-foreground/90">
        <p><strong>Selected Idea:</strong> {data.selectedIdea}</p>
        <p><strong>Selection Reason:</strong> {data.selectionReason}</p>
        {data.brainstormIdeas && data.brainstormIdeas.length > 0 && (
          <div className="mt-1">
            <p className="font-semibold">Brainstormed Ideas:</p>
            <ul className="list-disc pl-4 mt-0.5 space-y-0.5">
              {data.brainstormIdeas.map((idea: string, i: number) => (
                <li key={i}>{idea}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  // Prototype
  if ("toolsRequired" in data) {
    return (
      <div className="space-y-2 text-xs leading-relaxed text-foreground/90">
        {data.toolsRequired && data.toolsRequired.length > 0 && (
          <div>
            <p><strong>Tools Required:</strong></p>
            <ul className="list-disc pl-4 mt-0.5 space-y-0.5">
              {data.toolsRequired.map((tool: string, i: number) => (
                <li key={i}>{tool}</li>
              ))}
            </ul>
          </div>
        )}
        {data.iterations && data.iterations.length > 0 && (
          <div className="mt-2">
            <p className="font-semibold mb-1">Iterations ({data.iterations.length}):</p>
            <div className="space-y-2 pl-2 border-l-2 border-border/80">
              {data.iterations.map((it: any, i: number) => (
                <div key={i} className="bg-muted/50 p-2 rounded">
                  <p><strong>Description:</strong> {it.description}</p>
                  <p><strong>Outcome:</strong> {it.outcome}</p>
                  {it.date && <p className="text-[10px] text-muted-foreground mt-0.5">{it.date}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Test
  if ("testPlan" in data) {
    return (
      <div className="space-y-2 text-xs leading-relaxed text-foreground/90">
        <p><strong>Status:</strong> {data.passed ? "Passed" : "Failed"}</p>
        <p><strong>Test Plan:</strong> {data.testPlan}</p>
        {data.results && <p><strong>Test Results:</strong> {data.results}</p>}
      </div>
    );
  }

  return <pre className="text-xs font-mono">{JSON.stringify(data, null, 2)}</pre>;
}

