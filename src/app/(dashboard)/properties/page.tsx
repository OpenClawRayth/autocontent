"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Plus, Home, Trash2, Zap, BedDouble, Bath, Maximize2, DollarSign, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { GenerateModal } from "@/components/content/GenerateModal";
import { useAdminUser } from "@/hooks/useAdminUser";

type PropertyStatus = "active" | "pending" | "sold";

const statusColors: Record<PropertyStatus, string> = {
  active: "badge-green",
  pending: "badge-yellow",
  sold: "badge-gray",
};

export default function PropertiesPage() {
  const { userId, isAdmin } = useAdminUser();
  const propertiesAll = useQuery(api.properties.listAll, isAdmin ? {} : "skip");
  const propertiesByUser = useQuery(api.properties.list, !isAdmin ? { userId } : "skip");
  const properties = isAdmin ? propertiesAll : propertiesByUser;
  const createProperty = useMutation(api.properties.create);
  const removeProperty = useMutation(api.properties.remove);

  const [showForm, setShowForm] = useState(false);
  const [generating, setGenerating] = useState<Id<"properties"> | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    address: "",
    city: "",
    state: "",
    zipCode: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    squareFeet: "",
    propertyType: "house",
    status: "active" as PropertyStatus,
    yearBuilt: "",
    mlsNumber: "",
    features: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    await createProperty({
      userId,
      address: form.address,
      city: form.city,
      state: form.state,
      zipCode: form.zipCode,
      price: Number(form.price),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      squareFeet: Number(form.squareFeet),
      propertyType: form.propertyType,
      status: form.status,
      yearBuilt: form.yearBuilt ? Number(form.yearBuilt) : undefined,
      mlsNumber: form.mlsNumber || undefined,
      features: form.features.split(",").map((f) => f.trim()).filter(Boolean),
      description: form.description || undefined,
      imageUrls: [],
    });

    setForm({
      address: "", city: "", state: "", zipCode: "", price: "",
      bedrooms: "", bathrooms: "", squareFeet: "", propertyType: "house",
      status: "active", yearBuilt: "", mlsNumber: "", features: "", description: "",
    });
    setShowForm(false);
    setSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title flex items-center gap-2">
            {isAdmin && <Shield className="w-5 h-5 text-violet-400" />}
            Properties
          </h1>
          <p className="page-subtitle">
            {properties?.length ?? 0} listing{properties?.length !== 1 ? "s" : ""}
            {isAdmin && " · all users"}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          Add Property
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="glass-card p-6 animate-fade-up">
          <h2 className="text-base font-semibold text-white mb-4">New Property</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="label">Street Address</label>
                <input name="address" value={form.address} onChange={handleChange} required className="input" placeholder="123 Main St" />
              </div>
              <div>
                <label className="label">City</label>
                <input name="city" value={form.city} onChange={handleChange} required className="input" placeholder="Miami" />
              </div>
              <div>
                <label className="label">State</label>
                <input name="state" value={form.state} onChange={handleChange} required className="input" placeholder="FL" />
              </div>
              <div>
                <label className="label">ZIP Code</label>
                <input name="zipCode" value={form.zipCode} onChange={handleChange} required className="input" placeholder="33101" />
              </div>
              <div>
                <label className="label">Price ($)</label>
                <input name="price" type="number" value={form.price} onChange={handleChange} required className="input" placeholder="550000" />
              </div>
              <div>
                <label className="label">Bedrooms</label>
                <input name="bedrooms" type="number" value={form.bedrooms} onChange={handleChange} required className="input" placeholder="4" />
              </div>
              <div>
                <label className="label">Bathrooms</label>
                <input name="bathrooms" type="number" value={form.bathrooms} onChange={handleChange} required className="input" placeholder="3" />
              </div>
              <div>
                <label className="label">Square Feet</label>
                <input name="squareFeet" type="number" value={form.squareFeet} onChange={handleChange} required className="input" placeholder="2400" />
              </div>
              <div>
                <label className="label">Property Type</label>
                <select name="propertyType" value={form.propertyType} onChange={handleChange} className="input">
                  <option value="house">House</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="land">Land</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
              <div>
                <label className="label">Status</label>
                <select name="status" value={form.status} onChange={handleChange} className="input">
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="sold">Sold</option>
                </select>
              </div>
              <div>
                <label className="label">Year Built (optional)</label>
                <input name="yearBuilt" type="number" value={form.yearBuilt} onChange={handleChange} className="input" placeholder="2005" />
              </div>
              <div>
                <label className="label">MLS # (optional)</label>
                <input name="mlsNumber" value={form.mlsNumber} onChange={handleChange} className="input" placeholder="MLS-XXXXX" />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Features (comma-separated)</label>
                <input name="features" value={form.features} onChange={handleChange} className="input" placeholder="Pool, Garage, Updated Kitchen, Ocean View" />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Notes (optional)</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="input resize-none" placeholder="Any additional details..." />
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button type="submit" disabled={submitting} className="btn-primary">
                {submitting ? "Saving…" : "Save Property"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {!properties ? (
        <div className="glass-card p-8 text-center text-[var(--text-muted)]">Loading…</div>
      ) : properties.length === 0 ? (
        <div className="glass-card p-12 text-center space-y-3">
          <Home className="w-10 h-10 text-[var(--text-muted)] mx-auto" />
          <p className="text-[var(--text-secondary)] text-sm">No properties yet.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary mx-auto">
            <Plus className="w-4 h-4" /> Add your first property
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {properties.map((p) => (
            <div key={p._id} className="glass-card p-5 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{p.address}</p>
                  <p className="text-xs text-[var(--text-muted)]">{p.city}, {p.state} {p.zipCode}</p>
                </div>
                <span className={cn(statusColors[p.status as PropertyStatus], "flex-shrink-0")}>{p.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-[var(--text-secondary)]">
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-green-400" />
                  ${p.price.toLocaleString()}
                </div>
                <div className="flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
                  {p.squareFeet.toLocaleString()} sqft
                </div>
                <div className="flex items-center gap-1.5">
                  <BedDouble className="w-3.5 h-3.5 text-purple-400" />
                  {p.bedrooms} beds
                </div>
                <div className="flex items-center gap-1.5">
                  <Bath className="w-3.5 h-3.5 text-indigo-400" />
                  {p.bathrooms} baths
                </div>
              </div>
              {p.features.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {p.features.slice(0, 3).map((f) => (
                    <span key={f} className="badge-gray text-xs">{f}</span>
                  ))}
                  {p.features.length > 3 && (
                    <span className="badge-gray text-xs">+{p.features.length - 3}</span>
                  )}
                </div>
              )}
              <div className="flex items-center gap-2 pt-1 mt-auto border-t border-[var(--border)]">
                <button
                  onClick={() => setGenerating(p._id)}
                  className="btn-primary flex-1 text-xs py-2"
                >
                  <Zap className="w-3.5 h-3.5" /> Generate Content
                </button>
                <button
                  onClick={() => removeProperty({ id: p._id })}
                  className="btn-ghost p-2"
                  aria-label="Delete property"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Generate Modal */}
      {generating && (
        <GenerateModal
          sourceType="property"
          sourceId={generating}
          onClose={() => setGenerating(null)}
        />
      )}
    </div>
  );
}
