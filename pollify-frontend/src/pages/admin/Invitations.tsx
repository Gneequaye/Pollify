import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { invitationService, InvitationResponse } from '@/services/invitationService';
import { ApiError } from '@/lib/api';

const panel = "w-full bg-white dark:bg-zinc-900/70 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-sm backdrop-blur-xl";
import {
  IconTrendingUp,
  IconMail,
  IconClock,
  IconCircleCheckFilled,
  IconXboxX,
  IconSearch,
  IconInbox,
  IconLoader,
  IconAlertCircle,
  IconRefresh,
} from "@tabler/icons-react";

const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    icon: IconClock,
    className: "bg-yellow-50 text-yellow-700 border-yellow-300 dark:bg-yellow-950/20 dark:text-yellow-400",
  },
  ACCEPTED: {
    label: "Accepted",
    icon: IconCircleCheckFilled,
    className: "bg-green-50 text-green-700 border-green-300 dark:bg-green-950/20 dark:text-green-400",
  },
  EXPIRED: {
    label: "Expired",
    icon: IconXboxX,
    className: "bg-red-50 text-red-700 border-red-300 dark:bg-red-950/20 dark:text-red-400",
  },
  REVOKED: {
    label: "Cancelled",
    icon: IconXboxX,
    className: "bg-red-50 text-red-700 border-red-300 dark:bg-red-950/20 dark:text-red-400",
  },
} as const;

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

// Derive a status string from the InvitationResponse message field
// (backend returns message = status string e.g. "PENDING", "ACCEPTED", etc.)
type InvStatus = "PENDING" | "ACCEPTED" | "EXPIRED" | "REVOKED";

function getStatus(inv: InvitationResponse): InvStatus {
  const msg = inv.message?.toUpperCase() ?? "";
  if (msg === "PENDING" || msg === "ACCEPTED" || msg === "EXPIRED" || msg === "REVOKED") {
    return msg as InvStatus;
  }
  return "PENDING";
}

export function Invitations() {
  const [search, setSearch] = useState("");
  const [invitations, setInvitations] = useState<InvitationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvitations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await invitationService.getAllInvitations();
      setInvitations(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load invitations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInvitations(); }, []);

  const filtered = invitations.filter(
    (inv) =>
      inv.universityName?.toLowerCase().includes(search.toLowerCase()) ||
      inv.universityEmail?.toLowerCase().includes(search.toLowerCase()) ||
      inv.invitationToken?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPending  = invitations.filter((i) => getStatus(i) === "PENDING").length;
  const totalAccepted = invitations.filter((i) => getStatus(i) === "ACCEPTED").length;
  const totalExpiredRevoked = invitations.filter(
    (i) => getStatus(i) === "EXPIRED" || getStatus(i) === "REVOKED"
  ).length;

  return (
    <div className="flex flex-col gap-4 md:gap-6">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-3">
        <div className={`${panel} p-5 flex flex-col gap-3`}>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Sent</p>
            <Badge variant="outline" className="gap-1 text-xs">
              <IconTrendingUp className="size-3" /> All time
            </Badge>
          </div>
          <p className="text-3xl font-semibold tabular-nums">
            {loading ? "—" : invitations.length}
          </p>
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium flex items-center gap-1">
              All invitations ever sent <IconTrendingUp className="size-3.5" />
            </p>
            <p className="text-xs text-muted-foreground">Platform lifetime total</p>
          </div>
        </div>

        <div className={`${panel} p-5 flex flex-col gap-3`}>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Pending</p>
            <Badge variant="outline" className="gap-1 text-xs">
              <IconClock className="size-3" /> Awaiting
            </Badge>
          </div>
          <p className="text-3xl font-semibold tabular-nums">
            {loading ? "—" : totalPending}
          </p>
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium flex items-center gap-1">
              Awaiting response <IconClock className="size-3.5" />
            </p>
            <p className="text-xs text-muted-foreground">Schools yet to accept</p>
          </div>
        </div>

        <div className={`${panel} p-5 flex flex-col gap-3`}>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Accepted</p>
            <Badge variant="outline" className="gap-1 text-xs">
              <IconCircleCheckFilled className="size-3" /> Done
            </Badge>
          </div>
          <p className="text-3xl font-semibold tabular-nums">
            {loading ? "—" : totalAccepted}
          </p>
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium flex items-center gap-1">
              Successfully onboarded <IconCircleCheckFilled className="size-3.5" />
            </p>
            <p className="text-xs text-muted-foreground">
              {loading ? "" : `${totalExpiredRevoked} expired or cancelled`}
            </p>
          </div>
        </div>
      </div>

      {/* Invitations Table */}
      <div className={`${panel} flex flex-col gap-0 overflow-hidden`}>
        {/* Header */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between px-6 pt-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h3 className="text-base font-semibold">All Invitations</h3>
            <p className="text-sm text-muted-foreground">
              A complete record of all school invitations sent from this platform
            </p>
          </div>
          <button
            onClick={fetchInvitations}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <IconRefresh className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="relative max-w-sm">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              className="flex h-9 w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent pl-9 pr-3 py-1 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Search by school or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3">
            <IconLoader className="size-5 animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Loading invitations…</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center px-6">
            <IconAlertCircle className="size-8 text-red-500" />
            <p className="text-sm text-muted-foreground">{error}</p>
            <button onClick={fetchInvitations} className="text-xs underline text-muted-foreground">
              Try again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center px-6">
            <IconInbox className="size-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {search ? "No invitations match your search" : "No invitations sent yet"}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                <TableHead className="pl-6 font-semibold text-xs uppercase tracking-wide">School</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">Contact Email</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">Code</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">Status</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">Sent</TableHead>
                <TableHead className="pr-6 font-semibold text-xs uppercase tracking-wide">Expires</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((inv) => {
                const status = getStatus(inv);
                const statusCfg = STATUS_CONFIG[status];
                const StatusIcon = statusCfg.icon;
                return (
                  <TableRow
                    key={inv.invitationToken}
                    className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 transition-colors"
                  >
                    <TableCell className="pl-6">
                      <div className="font-medium text-sm">{inv.universityName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <IconMail className="size-3.5 shrink-0" />
                        {inv.universityEmail}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                        {inv.invitationCode ?? '—'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs flex items-center gap-1 w-fit ${statusCfg.className}`}
                      >
                        <StatusIcon className="size-3" />
                        {statusCfg.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {inv.expiresAt ? formatDate(new Date(new Date(inv.expiresAt).getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()) : "—"}
                    </TableCell>
                    <TableCell className="pr-6 text-sm text-muted-foreground">
                      {inv.expiresAt ? formatDate(inv.expiresAt) : "—"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        {/* Footer */}
        {!loading && !error && (
          <div className="px-6 py-3 border-t border-zinc-100 dark:border-zinc-800">
            <p className="text-xs text-muted-foreground">
              Showing {filtered.length} of {invitations.length} invitations
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
