"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Plus, Car, Trash2, Zap, Gauge, DollarSign, Fuel, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { GenerateModal } from "@/components/content/GenerateModal";
import { useAdminUser } from "@/hooks/useAdminUser";

type VehicleStatus = "available" | "pending" | "sold";
type VehicleCondition = "new" | "used" | "certified";

const statusColors: Record<VehicleStatus, string> = {
  available: "badge-green",
  pending: "badge-yellow",
  sold: "badge-gray",
};

const conditionColors: Record<VehicleCondition, string> = {
  new: "badge-blue",
  certified: "badge-green",
  used: "badge-gray",
};

export default function VehiclesPage() {
  const { userId, isAdmin } = useAdminUser();
  const vehicles = useQuery(
    isAdmin ? api.vehicles.listAll : api.vehicles.list,
    isAdmin ? {} : { userId }
  );
  const createVehicle = useMutation(api.vehicles.create);
  const removeVehicle = useMutation(api.vehicles.remove);

  const [showForm, setShowForm] = useState(false);
  const [generating, setGenerating] = useState<Id<"vehicles"> | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    year: "",
    make: "",
    model: "",
    trim: "",
    vin: "",
    stockNumber: "",
    mileage: "",
    price: "",
    condition: "used" as VehicleCondition,
    status: "available" as VehicleStatus,
    color: "",
    transmission: "",
    engine: "",
    fuelType: "",
    features: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    await createVehicle({
      userId,
      year: Number(form.year),
      make: form.make,
      model: form.model,
      trim: form.trim || undefined,
      vin: form.vin || undefined,
      stockNumber: form.stockNumber || undefined,
      mileage: Number(form.mileage),
      price: Number(form.price),
      condition: form.condition,
      status: form.status,
      color: form.color || undefined,
      transmission: form.transmission || undefined,
      engine: form.engine || undefined,
      fuelType: form.fuelType || undefined,
      features: form.features.split(",").map((f) => f.trim()).filter(Boolean),
      description: form.description || undefined,
      imageUrls: [],
    });

    setForm({
      year: "", make: "", model: "", trim: "", vin: "", stockNumber: "",
      mileage: "", price: "", condition: "used", status: "available",
      color: "", transmission: "", engine: "", fuelType: "", features: "", description: "",
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
            Vehicles
          </h1>
          <p className="page-subtitle">
            {vehicles?.length ?? 0} vehicle{vehicles?.length !== 1 ? "s" : ""} in inventory
            {isAdmin && " · all users"}
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Vehicle
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="glass-card p-6 animate-fade-up">
          <h2 className="text-base font-semibold text-white mb-4">New Vehicle</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Year</label>
                <input name="year" type="number" value={form.year} onChange={handleChange} required className="input" placeholder="2023" />
              </div>
              <div>
                <label className="label">Make</label>
                <input name="make" value={form.make} onChange={handleChange} required className="input" placeholder="Toyota" />
              </div>
              <div>
                <label className="label">Model</label>
                <input name="model" value={form.model} onChange={handleChange} required className="input" placeholder="Camry" />
              </div>
              <div>
                <label className="label">Trim (optional)</label>
                <input name="trim" value={form.trim} onChange={handleChange} className="input" placeholder="XSE V6" />
              </div>
              <div>
                <label className="label">Price ($)</label>
                <input name="price" type="number" value={form.price} onChange={handleChange} required className="input" placeholder="28500" />
              </div>
              <div>
                <label className="label">Mileage</label>
                <input name="mileage" type="number" value={form.mileage} onChange={handleChange} required className="input" placeholder="34000" />
              </div>
              <div>
                <label className="label">Condition</label>
                <select name="condition" value={form.condition} onChange={handleChange} className="input">
                  <option value="new">New</option>
                  <option value="used">Used</option>
                  <option value="certified">Certified Pre-Owned</option>
                </select>
              </div>
              <div>
                <label className="label">Status</label>
                <select name="status" value={form.status} onChange={handleChange} className="input">
                  <option value="available">Available</option>
                  <option value="pending">Pending</option>
                  <option value="sold">Sold</option>
                </select>
              </div>
              <div>
                <label className="label">Color (optional)</label>
                <input name="color" value={form.color} onChange={handleChange} className="input" placeholder="Midnight Black" />
              </div>
              <div>
                <label className="label">Transmission (optional)</label>
                <input name="transmission" value={form.transmission} onChange={handleChange} className="input" placeholder="8-Speed Automatic" />
              </div>
              <div>
                <label className="label">Engine (optional)</label>
                <input name="engine" value={form.engine} onChange={handleChange} className="input" placeholder="3.5L V6" />
              </div>
              <div>
                <label className="label">Fuel Type (optional)</label>
                <input name="fuelType" value={form.fuelType} onChange={handleChange} className="input" placeholder="Gasoline" />
              </div>
              <div>
                <label className="label">VIN (optional)</label>
                <input name="vin" value={form.vin} onChange={handleChange} className="input" placeholder="1HGCM82633A000000" />
              </div>
              <div>
                <label className="label">Stock # (optional)</label>
                <input name="stockNumber" value={form.stockNumber} onChange={handleChange} className="input" placeholder="STK-1234" />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Features (comma-separated)</label>
                <input name="features" value={form.features} onChange={handleChange} className="input" placeholder="Sunroof, Heated Seats, Apple CarPlay, Backup Camera" />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Notes (optional)</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="input resize-none" placeholder="Any additional details..." />
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button type="submit" disabled={submitting} className="btn-primary">
                {submitting ? "Saving…" : "Save Vehicle"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {!vehicles ? (
        <div className="glass-card p-8 text-center text-[var(--text-muted)]">Loading…</div>
      ) : vehicles.length === 0 ? (
        <div className="glass-card p-12 text-center space-y-3">
          <Car className="w-10 h-10 text-[var(--text-muted)] mx-auto" />
          <p className="text-[var(--text-secondary)] text-sm">No vehicles in inventory yet.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary mx-auto">
            <Plus className="w-4 h-4" /> Add your first vehicle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {vehicles.map((v) => (
            <div key={v._id} className="glass-card p-5 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {v.year} {v.make} {v.model}
                    {v.trim ? ` ${v.trim}` : ""}
                  </p>
                  {v.stockNumber && (
                    <p className="text-xs text-[var(--text-muted)]">Stock #{v.stockNumber}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={cn(statusColors[v.status as VehicleStatus])}>{v.status}</span>
                  <span className={cn(conditionColors[v.condition as VehicleCondition])}>{v.condition}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-[var(--text-secondary)]">
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-green-400" />
                  ${v.price.toLocaleString()}
                </div>
                <div className="flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-blue-400" />
                  {v.mileage.toLocaleString()} mi
                </div>
                {v.fuelType && (
                  <div className="flex items-center gap-1.5 col-span-2">
                    <Fuel className="w-3.5 h-3.5 text-orange-400" />
                    {v.fuelType}{v.transmission ? ` · ${v.transmission}` : ""}
                  </div>
                )}
              </div>
              {v.features.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {v.features.slice(0, 3).map((f) => (
                    <span key={f} className="badge-gray text-xs">{f}</span>
                  ))}
                  {v.features.length > 3 && (
                    <span className="badge-gray text-xs">+{v.features.length - 3}</span>
                  )}
                </div>
              )}
              <div className="flex items-center gap-2 pt-1 mt-auto border-t border-[var(--border)]">
                <button
                  onClick={() => setGenerating(v._id)}
                  className="btn-primary flex-1 text-xs py-2"
                >
                  <Zap className="w-3.5 h-3.5" /> Generate Content
                </button>
                <button
                  onClick={() => removeVehicle({ id: v._id })}
                  className="btn-ghost p-2"
                  aria-label="Delete vehicle"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {generating && (
        <GenerateModal
          sourceType="vehicle"
          sourceId={generating}
          onClose={() => setGenerating(null)}
        />
      )}
    </div>
  );
}
