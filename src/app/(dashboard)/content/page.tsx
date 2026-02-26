"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import {
  FileText, Copy, Check, Trash2, Home, Car,
  Instagram, Facebook, Twitter, Mail, MessageSquare, Video, Megaphone,
} from "lucide-react";
import { cn } from "@/lib/utils";

const contentTypeIcons: Record<string, React.ElementType> = {
  listing_description: FileText,
  social_instagram: Instagram,
  social_facebook: Facebook,
  social_twitter: Twitter,
  email_campaign: Mail,
  sms_blast: MessageSquare,
  video_script: Video,
  ad_copy: Megaphone,
};

const statusBadge: Record<string, string> = {
  draft: "badge-yellow",
  approved: "badge-green",
  published: "badge-blue",
};

export default function ContentPage() {
  const { user } = useUser();
  const content = useQuery(api.content.listByUser, { userId: user?.id ?? "" });
  const updateStatus = useMutation(api.content.updateStatus);
  const removeContent = useMutation(api.content.remove);

  const [copied, setCopied] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "draft" | "approved" | "published">("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleCopy = (id: string, body: string) => {
    navigator.clipboard.writeText(body);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const filtered = content?.filter((c) => {
    const statusMatch = filter === "all" || c.status === filter;
    const typeMatch = typeFilter === "all" || c.contentType === typeFilter;
    return statusMatch && typeMatch;
  });

  const uniqueTypes = Array.from(new Set(content?.map((c) => c.contentType) ?? []));

  return (
    <div className="animate-fade-up space-y-6">
      <div>
        <h1 className="page-title">Content Library</h1>
        <p className="page-subtitle">{content?.length ?? 0} piece{content?.length !== 1 ? "s" : ""} generated</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
          {(["all", "draft", "approved", "published"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize",
                filter === s
                  ? "bg-indigo-600 text-white"
                  : "text-[var(--text-secondary)] hover:text-white"
              )}
            >
              {s}
            </button>
          ))}
        </div>

        {uniqueTypes.length > 0 && (
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="input py-1.5 text-xs w-auto"
          >
            <option value="all">All Types</option>
            {uniqueTypes.map((t) => (
              <option key={t} value={t}>
                {t.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Content list */}
      {!content ? (
        <div className="glass-card p-8 text-center text-[var(--text-muted)]">Loading…</div>
      ) : filtered?.length === 0 ? (
        <div className="glass-card p-12 text-center space-y-3">
          <FileText className="w-10 h-10 text-[var(--text-muted)] mx-auto" />
          <p className="text-[var(--text-secondary)] text-sm">
            {content.length === 0
              ? "No content yet. Go to Properties or Vehicles and generate some!"
              : "No results match your filter."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered?.map((item) => {
            const Icon = contentTypeIcons[item.contentType] ?? FileText;
            const SourceIcon = item.sourceType === "property" ? Home : Car;
            const isExpanded = expanded === item._id;

            return (
              <div key={item._id} className="glass-card overflow-hidden">
                {/* Row header */}
                <div
                  className="flex items-center gap-4 p-4 cursor-pointer"
                  onClick={() => setExpanded(isExpanded ? null : item._id)}
                >
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-white capitalize">
                        {item.contentType.replace(/_/g, " ")}
                      </p>
                      <span className={cn(statusBadge[item.status])}>
                        {item.status}
                      </span>
                      <span className="badge-gray gap-1">
                        <SourceIcon className="w-3 h-3" />
                        {item.sourceType}
                      </span>
                      {item.tone && (
                        <span className="badge-gray">{item.tone}</span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate">
                      {item.body.slice(0, 100)}…
                    </p>
                  </div>
                  <span className="text-xs text-[var(--text-muted)] flex-shrink-0">
                    {new Date(item._creationTime).toLocaleDateString()}
                  </span>
                </div>

                {/* Expanded body */}
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3 border-t border-[var(--border)] pt-4">
                    <pre className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap font-sans leading-relaxed">
                      {item.body}
                    </pre>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => handleCopy(item._id, item.body)}
                        className="btn-ghost text-xs gap-1.5"
                      >
                        {copied === item._id
                          ? <><Check className="w-3.5 h-3.5 text-green-400" /> Copied</>
                          : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                      </button>
                      {item.status === "draft" && (
                        <button
                          onClick={() => updateStatus({ id: item._id as Id<"content">, status: "approved" })}
                          className="btn-ghost text-xs"
                        >
                          ✓ Approve
                        </button>
                      )}
                      {item.status === "approved" && (
                        <button
                          onClick={() => updateStatus({ id: item._id as Id<"content">, status: "published" })}
                          className="btn-ghost text-xs"
                        >
                          🚀 Mark Published
                        </button>
                      )}
                      <button
                        onClick={() => removeContent({ id: item._id as Id<"content"> })}
                        className="btn-ghost text-xs text-red-400 ml-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
