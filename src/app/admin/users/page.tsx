"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  Search,
  Filter,
  Shield,
  Lock,
  Unlock,
  ShieldCheck,
  ShieldOff,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  MoreVertical,
  UserPlus,
  Ban,
  Star,
  Crown,
  Eye,
  Mail,
  Phone,
  Globe,
  Calendar,
  Activity,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  Zap,
  Trash2,
  Edit3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const ROLE_COLORS: Record<string, string> = {
  USER: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  ADVOCATE: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  ADMIN: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  SUPER_ADMIN: "text-purple-400 bg-purple-400/10 border-purple-400/20",
};

const PLAN_COLORS: Record<string, string> = {
  FREE: "text-slate-400 bg-slate-400/10 border-slate-400/20",
  PRO: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  BUSINESS: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20",
  ENTERPRISE: "text-rose-400 bg-rose-400/10 border-rose-400/20",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 50, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [planFilter, setPlanFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", email: "", password: "", userRole: "USER", plan: "FREE" });

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchUsers = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (roleFilter !== "ALL") params.append("role", roleFilter);
      if (planFilter !== "ALL") params.append("plan", planFilter);
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (searchQuery) params.append("q", searchQuery);
      params.append("page", String(page));
      params.append("limit", "50");

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setPagination(data.pagination || { total: 0, page: 1, limit: 50, pages: 1 });
      }
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  }, [roleFilter, planFilter, statusFilter, searchQuery]);

  useEffect(() => {
    const debounce = setTimeout(() => fetchUsers(1), 350);
    return () => clearTimeout(debounce);
  }, [fetchUsers]);

  const handleAction = async (userId: string, action: string, value?: string, reason?: string) => {
    try {
      setActionLoading(`${userId}-${action}`);
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action, value, reason }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`✅ ${action.replace(/_/g, " ")} successful`);
        fetchUsers(pagination.page);
        setSelectedUser(null);
      } else {
        showToast(data.error || "Action failed", "error");
      }
    } catch {
      showToast("Network error", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete user "${email}"? This action cannot be undone.`)) {
      return;
    }
    try {
      setActionLoading(`${userId}-delete`);
      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`✅ User "${email}" permanently deleted`);
        fetchUsers(pagination.page);
        setSelectedUser(null);
      } else {
        showToast(data.error || "Failed to delete user", "error");
      }
    } catch {
      showToast("Network error", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateUser = async () => {
    if (!createForm.name || !createForm.email || !createForm.password) {
      showToast("All fields required", "error");
      return;
    }
    try {
      setActionLoading("create");
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`✅ User ${createForm.email} created`);
        setShowCreateModal(false);
        setCreateForm({ name: "", email: "", password: "", userRole: "USER", plan: "FREE" });
        fetchUsers(1);
      } else {
        showToast(data.error || "Failed to create user", "error");
      }
    } catch {
      showToast("Network error", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const exportUsers = () => {
    const csv = [
      ["ID", "Name", "Email", "Role", "Plan", "Status", "Matters", "Bookings", "Created"].join(","),
      ...users.map(u => [
        u.id, u.name || "", u.email, u.role, u.plan || "FREE",
        u.isBanned ? "Banned" : u.isActive ? "Active" : "Inactive",
        u._count?.matters || 0, u._count?.bookings || 0,
        new Date(u.createdAt).toLocaleDateString("en-IN"),
      ].join(","))
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lexnova-users-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      {/* Header */}
      <div className="border-b border-white/5 bg-black/30 backdrop-blur-xl px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
              User Management
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {pagination.total.toLocaleString()} total users · All roles and plans
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportUsers}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-slate-300 transition-all"
            >
              <Download className="h-4 w-4" /> Export CSV
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-sm font-medium transition-all shadow-lg shadow-blue-900/20"
            >
              <UserPlus className="h-4 w-4" /> Add User
            </button>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name, email, phone, city..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="ALL">All Roles</option>
            <option value="USER">Users</option>
            <option value="ADVOCATE">Advocates</option>
            <option value="ADMIN">Admins</option>
            <option value="SUPER_ADMIN">Super Admins</option>
          </select>
          <select
            value={planFilter}
            onChange={e => setPlanFilter(e.target.value)}
            className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="ALL">All Plans</option>
            <option value="FREE">Free</option>
            <option value="PRO">Pro</option>
            <option value="BUSINESS">Business</option>
            <option value="ENTERPRISE">Enterprise</option>
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="ALL">All Status</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
            <option value="locked">Locked</option>
          </select>
          <button
            onClick={() => fetchUsers(pagination.page)}
            disabled={loading}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
          >
            <RefreshCw className={cn("h-4 w-4 text-slate-400", loading && "animate-spin")} />
          </button>
        </div>

        {/* Users Table */}
        <div className="rounded-2xl border border-white/5 bg-black/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-white/2">
                  <th className="text-left px-4 py-3 text-xs text-slate-500 font-medium uppercase tracking-wider">User</th>
                  <th className="text-left px-4 py-3 text-xs text-slate-500 font-medium uppercase tracking-wider">Role</th>
                  <th className="text-left px-4 py-3 text-xs text-slate-500 font-medium uppercase tracking-wider">Plan</th>
                  <th className="text-left px-4 py-3 text-xs text-slate-500 font-medium uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs text-slate-500 font-medium uppercase tracking-wider">Usage</th>
                  <th className="text-left px-4 py-3 text-xs text-slate-500 font-medium uppercase tracking-wider">Joined</th>
                  <th className="text-right px-4 py-3 text-xs text-slate-500 font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-white/5" />
                          <div className="space-y-1.5">
                            <div className="h-3 w-32 bg-white/5 rounded" />
                            <div className="h-2.5 w-44 bg-white/5 rounded" />
                          </div>
                        </div>
                      </td>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-4 py-4"><div className="h-3 w-16 bg-white/5 rounded" /></td>
                      ))}
                    </tr>
                  ))
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center text-slate-500">
                      No users found matching your filters.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-white/2 transition-colors group"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="relative h-8 w-8 rounded-full bg-gradient-to-br from-blue-500/30 to-indigo-500/30 border border-white/10 flex items-center justify-center text-xs font-bold text-blue-300 flex-shrink-0">
                            {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                            {user.isBanned && (
                              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-red-500 border border-[#030712] flex items-center justify-center">
                                <X className="h-2 w-2 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-white truncate">{user.name || "—"}</p>
                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={cn("inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border font-medium", ROLE_COLORS[user.role] || ROLE_COLORS.USER)}>
                          {user.role === "SUPER_ADMIN" && <Crown className="h-3 w-3" />}
                          {user.role === "ADMIN" && <Shield className="h-3 w-3" />}
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={cn("inline-flex text-xs px-2 py-1 rounded-full border font-medium", PLAN_COLORS[user.plan || "FREE"] || PLAN_COLORS.FREE)}>
                          {user.plan || "FREE"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        {user.isBanned ? (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                            <X className="h-3 w-3" /> Banned
                          </span>
                        ) : user.lockedUntil && new Date(user.lockedUntil) > new Date() ? (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                            <Lock className="h-3 w-3" /> Locked
                          </span>
                        ) : user.isActive ? (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle className="h-3 w-3" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20">
                            <AlertCircle className="h-3 w-3" /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-slate-400 text-xs">
                        <div className="space-y-0.5">
                          <div>{user._count?.matters || 0} cases</div>
                          <div>{user._count?.bookings || 0} bookings</div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-500 text-xs whitespace-nowrap">
                        {new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-medium transition-all"
                          title="Manage User"
                        >
                          <Edit3 className="h-3.5 w-3.5 text-blue-400" />
                          <span>Manage</span>
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="border-t border-white/5 px-6 py-4 flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Showing {((pagination.page - 1) * pagination.limit) + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total.toLocaleString()}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchUsers(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-40 transition-all"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm text-slate-400 px-2">
                  {pagination.page} / {pagination.pages}
                </span>
                <button
                  onClick={() => fetchUsers(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-40 transition-all"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Action Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-gradient-to-b from-[#0f1117] to-[#070a12] p-6 shadow-2xl"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500/30 to-indigo-500/30 border border-white/10 flex items-center justify-center text-lg font-bold text-blue-300">
                    {selectedUser.name?.[0]?.toUpperCase() || selectedUser.email[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{selectedUser.name || "No Name"}</h3>
                    <p className="text-sm text-slate-400">{selectedUser.email}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedUser(null)} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-500 transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
                <div className="rounded-xl bg-white/5 p-3">
                  <div className="text-slate-500 mb-1">Role</div>
                  <span className={cn("px-2 py-0.5 rounded-full border text-xs font-medium", ROLE_COLORS[selectedUser.role] || ROLE_COLORS.USER)}>
                    {selectedUser.role}
                  </span>
                </div>
                <div className="rounded-xl bg-white/5 p-3">
                  <div className="text-slate-500 mb-1">Plan</div>
                  <span className={cn("px-2 py-0.5 rounded-full border text-xs font-medium", PLAN_COLORS[selectedUser.plan || "FREE"] || PLAN_COLORS.FREE)}>
                    {selectedUser.plan || "FREE"}
                  </span>
                </div>
                <div className="rounded-xl bg-white/5 p-3">
                  <div className="text-slate-500 mb-1">Cases</div>
                  <span className="text-white font-medium">{selectedUser._count?.matters || 0}</span>
                </div>
                <div className="rounded-xl bg-white/5 p-3">
                  <div className="text-slate-500 mb-1">Bookings</div>
                  <span className="text-white font-medium">{selectedUser._count?.bookings || 0}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Admin Actions</p>

                {/* Role Actions */}
                <div className="grid grid-cols-2 gap-2">
                  {["USER", "ADVOCATE", "ADMIN", "SUPER_ADMIN"].map(r => (
                    <button
                      key={r}
                      onClick={() => handleAction(selectedUser.id, "SET_ROLE", r)}
                      disabled={!!actionLoading || selectedUser.role === r}
                      className={cn(
                        "py-2 px-3 rounded-xl text-xs font-medium border transition-all",
                        selectedUser.role === r
                          ? "bg-blue-500/20 border-blue-500/40 text-blue-300 cursor-default"
                          : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                      )}
                    >
                      Set {r}
                    </button>
                  ))}
                </div>

                {/* Plan Actions */}
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {["FREE", "PRO", "BUSINESS", "ENTERPRISE"].map(p => (
                    <button
                      key={p}
                      onClick={() => handleAction(selectedUser.id, "SET_PLAN", p)}
                      disabled={!!actionLoading || selectedUser.plan === p}
                      className={cn(
                        "py-2 px-3 rounded-xl text-xs font-medium border transition-all",
                        selectedUser.plan === p
                          ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300 cursor-default"
                          : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                      )}
                    >
                      {p} Plan
                    </button>
                  ))}
                </div>

                {/* Status Actions */}
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {selectedUser.isBanned ? (
                    <button
                      onClick={() => handleAction(selectedUser.id, "UNBAN")}
                      disabled={!!actionLoading}
                      className="py-2 px-3 rounded-xl text-xs font-medium border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 transition-all"
                    >
                      <ShieldCheck className="h-3 w-3 inline mr-1" /> Unban User
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAction(selectedUser.id, "BAN", undefined, "Violated Terms of Service")}
                      disabled={!!actionLoading}
                      className="py-2 px-3 rounded-xl text-xs font-medium border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 transition-all"
                    >
                      <ShieldOff className="h-3 w-3 inline mr-1" /> Ban User
                    </button>
                  )}
                  {selectedUser.lockedUntil && new Date(selectedUser.lockedUntil) > new Date() && (
                    <button
                      onClick={() => handleAction(selectedUser.id, "UNLOCK")}
                      disabled={!!actionLoading}
                      className="py-2 px-3 rounded-xl text-xs font-medium border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition-all"
                    >
                      <Unlock className="h-3 w-3 inline mr-1" /> Unlock
                    </button>
                  )}
                </div>

                {/* Delete User Action */}
                <div className="pt-3 mt-3 border-t border-white/10 flex justify-end">
                  <button
                    onClick={() => handleDeleteUser(selectedUser.id, selectedUser.email)}
                    disabled={!!actionLoading}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 transition-all disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete User Permanently</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create User Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-gradient-to-b from-[#0f1117] to-[#070a12] p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-blue-400" /> Create New User
                </h3>
                <button onClick={() => setShowCreateModal(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-500">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Full Name", key: "name", type: "text", placeholder: "John Doe" },
                  { label: "Email Address", key: "email", type: "email", placeholder: "user@example.com" },
                  { label: "Password", key: "password", type: "password", placeholder: "Minimum 8 characters" },
                ].map(field => (
                  <div key={field.key}>
                    <label className="text-xs text-slate-400 mb-1.5 block">{field.label}</label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={(createForm as any)[field.key]}
                      onChange={e => setCreateForm(f => ({ ...f, [field.key]: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 mb-1.5 block">Role</label>
                    <select
                      value={createForm.userRole}
                      onChange={e => setCreateForm(f => ({ ...f, userRole: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                      <option value="USER">User</option>
                      <option value="ADVOCATE">Advocate</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1.5 block">Plan</label>
                    <select
                      value={createForm.plan}
                      onChange={e => setCreateForm(f => ({ ...f, plan: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                      <option value="FREE">Free</option>
                      <option value="PRO">Pro</option>
                      <option value="BUSINESS">Business</option>
                      <option value="ENTERPRISE">Enterprise</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleCreateUser}
                  disabled={actionLoading === "create"}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-medium text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {actionLoading === "create" ? (
                    <><RefreshCw className="h-4 w-4 animate-spin" /> Creating...</>
                  ) : (
                    <><Zap className="h-4 w-4" /> Create User</>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={cn(
              "fixed bottom-6 right-6 z-[200] px-5 py-3 rounded-xl shadow-2xl text-sm font-medium border",
              toastType === "success"
                ? "bg-emerald-900/90 border-emerald-500/30 text-emerald-200"
                : "bg-red-900/90 border-red-500/30 text-red-200"
            )}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
