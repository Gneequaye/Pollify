import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

const panel = "w-full bg-white dark:bg-zinc-900/70 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-sm backdrop-blur-xl";
import {
  IconTrendingUp,
  IconMail,
  IconClock,
  IconCircleCheckFilled,
  IconXboxX,
  IconSearch,
  IconInbox,
} from "@tabler/icons-react";

// ── Simulated mock data ──────────────────────────────────────────────────────
type MockInvitation = {
  id: string;
  universityName: string;
  universityEmail: string;
  schoolType: "DOMAIN_SCHOOL" | "CODE_SCHOOL";
  status: "PENDING" | "ACCEPTED" | "EXPIRED" | "REVOKED";
  invitedBy: string;
  sentAt: string;
  expiresAt: string;
};

const MOCK_INVITATIONS: MockInvitation[] = [
  {
    id: "INV-001",
    universityName: "University of Ghana",
    universityEmail: "admin@ug.edu.gh",
    schoolType: "DOMAIN_SCHOOL",
    status: "ACCEPTED",
    invitedBy: "Super Admin",
    sentAt: "2025-11-01",
    expiresAt: "2025-11-08",
  },
  {
    id: "INV-002",
    universityName: "KNUST",
    universityEmail: "admin@knust.edu.gh",
    schoolType: "CODE_SCHOOL",
    status: "ACCEPTED",
    invitedBy: "Super Admin",
    sentAt: "2025-11-05",
    expiresAt: "2025-11-12",
  },
  {
    id: "INV-003",
    universityName: "University of Cape Coast",
    universityEmail: "admin@ucc.edu.gh",
    schoolType: "DOMAIN_SCHOOL",
    status: "PENDING",
    invitedBy: "Super Admin",
    sentAt: "2026-02-18",
    expiresAt: "2026-02-25",
  },
  {
    id: "INV-004",
    universityName: "Ashesi University",
    universityEmail: "admin@ashesi.edu.gh",
    schoolType: "CODE_SCHOOL",
    status: "EXPIRED",
    invitedBy: "Super Admin",
    sentAt: "2025-12-01",
    expiresAt: "2025-12-08",
  },
  {
    id: "INV-005",
    universityName: "Ghana Institute of Management",
    universityEmail: "admin@gimpa.edu.gh",
    schoolType: "DOMAIN_SCHOOL",
    status: "REVOKED",
    invitedBy: "Super Admin",
    sentAt: "2025-10-10",
    expiresAt: "2025-10-17",
  },
  {
    id: "INV-006",
    universityName: "Central University",
    universityEmail: "admin@central.edu.gh",
    schoolType: "CODE_SCHOOL",
    status: "PENDING",
    invitedBy: "Super Admin",
    sentAt: "2026-02-20",
    expiresAt: "2026-02-27",
  },
];

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

export function Invitations() {
  const [search, setSearch] = useState("");

  const filtered = MOCK_INVITATIONS.filter(
    (inv) =>
      inv.universityName.toLowerCase().includes(search.toLowerCase()) ||
      inv.universityEmail.toLowerCase().includes(search.toLowerCase()) ||
      inv.id.toLowerCase().includes(search.toLowerCase())
  );

  const totalPending = MOCK_INVITATIONS.filter((i) => i.status === "PENDING").length;
  const totalAccepted = MOCK_INVITATIONS.filter((i) => i.status === "ACCEPTED").length;
  const totalExpiredRevoked = MOCK_INVITATIONS.filter(
    (i) => i.status === "EXPIRED" || i.status === "REVOKED"
  ).length;

  return (
    <div className="flex flex-col gap-4 md:gap-6">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-3">
        {/* Total Sent */}
        <div className={`${panel} p-5 flex flex-col gap-3`}>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Sent</p>
            <Badge variant="outline" className="gap-1 text-xs">
              <IconTrendingUp className="size-3" /> All time
            </Badge>
          </div>
          <p className="text-3xl font-semibold tabular-nums">{MOCK_INVITATIONS.length}</p>
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium flex items-center gap-1">
              All invitations ever sent <IconTrendingUp className="size-3.5" />
            </p>
            <p className="text-xs text-muted-foreground">Platform lifetime total</p>
          </div>
        </div>

        {/* Pending */}
        <div className={`${panel} p-5 flex flex-col gap-3`}>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Pending</p>
            <Badge variant="outline" className="gap-1 text-xs">
              <IconClock className="size-3" /> Awaiting
            </Badge>
          </div>
          <p className="text-3xl font-semibold tabular-nums">{totalPending}</p>
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium flex items-center gap-1">
              Awaiting response <IconClock className="size-3.5" />
            </p>
            <p className="text-xs text-muted-foreground">Schools yet to accept</p>
          </div>
        </div>

        {/* Accepted */}
        <div className={`${panel} p-5 flex flex-col gap-3`}>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Accepted</p>
            <Badge variant="outline" className="gap-1 text-xs">
              <IconCircleCheckFilled className="size-3" /> Done
            </Badge>
          </div>
          <p className="text-3xl font-semibold tabular-nums">{totalAccepted}</p>
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium flex items-center gap-1">
              Successfully onboarded <IconCircleCheckFilled className="size-3.5" />
            </p>
            <p className="text-xs text-muted-foreground">{totalExpiredRevoked} expired or cancelled</p>
          </div>
        </div>
      </div>

      {/* Invitations Table */}
      <div className={`${panel} flex flex-col gap-0 overflow-hidden`}>
        {/* Header */}
        <div className="flex flex-col gap-1 px-6 pt-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <h3 className="text-base font-semibold">All Invitations</h3>
          <p className="text-sm text-muted-foreground">
            A complete record of all school invitations sent from this platform
          </p>
        </div>

        {/* Search */}
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="relative max-w-sm">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              className="flex h-9 w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent pl-9 pr-3 py-1 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Search by school, email or ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table or empty state */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center px-6">
            <IconInbox className="size-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No invitations match your search</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                <TableHead className="pl-6 w-[110px] font-semibold text-xs uppercase tracking-wide">ID</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">School</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">Contact Email</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">Type</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">Status</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">Sent</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">Expires</TableHead>
                <TableHead className="pr-6 font-semibold text-xs uppercase tracking-wide">Invited By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((inv) => {
                const statusCfg = STATUS_CONFIG[inv.status];
                const StatusIcon = statusCfg.icon;
                return (
                  <TableRow key={inv.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 transition-colors">
                    <TableCell className="pl-6">
                      <Badge variant="outline" className="font-mono text-xs">
                        {inv.id}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">{inv.universityName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <IconMail className="size-3.5 shrink-0" />
                        {inv.universityEmail}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {inv.schoolType === "DOMAIN_SCHOOL" ? "Domain" : "Code"}
                      </Badge>
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
                      {formatDate(inv.sentAt)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(inv.expiresAt)}
                    </TableCell>
                    <TableCell className="pr-6 text-sm text-muted-foreground">
                      {inv.invitedBy}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-100 dark:border-zinc-800">
          <p className="text-xs text-muted-foreground">
            Showing {filtered.length} of {MOCK_INVITATIONS.length} invitations
          </p>
        </div>
      </div>
    </div>
  );
}
