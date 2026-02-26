"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import {
  X, Zap, Copy, Check, RefreshCw, Save,
  FileText, Instagram, Facebook, Twitter,
  Mail, MessageSquare, Video, Megaphone,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ContentType =
  | "listing_description"
  | "social_instagram"
  | "social_facebook"
  | "social_twitter"
  | "email_campaign"
  | "sms_blast"
  | "video_script"
  | "ad_copy";

const contentTypes: { value: ContentType; label: string; icon: React.ElementType }[] = [
  { value: "listing_description", label: "Listing", icon: FileText },
  { value: "social_instagram", label: "Instagram", icon: Instagram },
  { value: "social_facebook", label: "Facebook", icon: Facebook },
  { value: "social_twitter", label: "Twitter/X", icon: Twitter },
  { value: "email_campaign", label: "Email", icon: Mail },
  { value: "sms_blast", label: "SMS", icon: MessageSquare },
  { value: "video_script", label: "Video Script", icon: Video },
  { value: "ad_copy", label: "Ad Copy", icon: Megaphone },
];

const tones = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "luxury", label: "Luxury" },
  { value: "energetic", label: "Energetic" },
  { value: "friendly", label: "Friendly" },
];

type Props = {
  sourceType: "property" | "vehicle";
  sourceId: Id<"properties"> | Id<"vehicles">;
  onClose: () => void;
};

export const GenerateModal = ({ sourceType, sourceId, onClose }: Props) => {
  const { user } = useUser();
  const [selectedType, setSelectedType] = useState<ContentType>("listing_description");
  const [tone, setTone] = useState("professional");
  const [generated, setGenerated] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const property = useQuery(
    api.properties.get,
    sourceType === "property" ? { id: sourceId as Id<"properties"> } : "skip"
  );
  const vehicle = useQuery(
    api.vehicles.get,
    sourceType === "vehicle" ? { id: sourceId as Id<"vehicles"> } : "skip"
  );
  const saveContent = useMutation(api.content.create);

  const sourceData = sourceType === "property" ? property : vehicle;

  const handleGenerate = async () => {
    if (!sourceData || !user) return;
    setLoading(true);
    setGenerated("");
    setSaved(false);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceType,
          contentType: selectedType,
          tone,
          data: sourceData,
        }),
      });

      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setGenerated(json.body);
    } catch (err) {
      console.error(err);
      setGenerated("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!generated || !user) return;
    await saveContent({
      userId: user.id,
      sourceType,
      sourceId: String(sourceId),
      contentType: selectedType,
      tone,
      body: generated,
      status: "draft",
    });
    setSaved(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-400" />
            <span className="font-semibold text-white text-sm">AI Content Generator</span>
          </div>
          <button onClick={onClose} className="btn-ghost p-1.5" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Source info */}
          {sourceData && (
            <div className="px-3 py-2 rounded-xl bg-white/5 border border-[var(--border)] text-xs text-[var(--text-secondary)]">
              {sourceType === "property" && property
                ? `${property.address}, ${property.city}, ${property.state} · $${property.price.toLocaleString()}`
                : vehicle
                ? `${vehicle.year} ${vehicle.make} ${vehicle.model} · $${vehicle.price.toLocaleString()}`
                : "Loading…"}
            </div>
          )}

          {/* Content type selector */}
          <div>
            <p className="label">Content Type</p>
            <div className="grid grid-cols-4 gap-2">
              {contentTypes.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setSelectedType(value)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs font-medium border transition-all",
                    selectedType === value
                      ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-300"
                      : "bg-white/5 border-[var(--border)] text-[var(--text-secondary)] hover:bg-white/8 hover:text-white"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Tone selector */}
          <div>
            <p className="label">Tone</p>
            <div className="flex flex-wrap gap-2">
              {tones.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTone(t.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                    tone === t.value
                      ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-300"
                      : "bg-white/5 border-[var(--border)] text-[var(--text-secondary)] hover:bg-white/8 hover:text-white"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Output */}
          {(generated || loading) && (
            <div>
              <p className="label">Generated Content</p>
              <div className="relative">
                <textarea
                  readOnly
                  value={loading ? "" : generated}
                  rows={8}
                  className="input resize-none font-mono text-xs leading-relaxed w-full"
                  placeholder={loading ? "" : ""}
                />
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs text-[var(--text-secondary)]">Generating with GPT-4o…</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[var(--border)] flex items-center gap-3">
          <button
            onClick={handleGenerate}
            disabled={loading || !sourceData}
            className="btn-primary flex-1"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            {loading ? "Generating…" : generated ? "Regenerate" : "Generate"}
          </button>

          {generated && !loading && (
            <>
              <button onClick={handleCopy} className="btn-ghost gap-2">
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={handleSave}
                disabled={saved}
                className="btn-ghost gap-2"
              >
                <Save className="w-4 h-4" />
                {saved ? "Saved!" : "Save"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
