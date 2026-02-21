import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  IconUser,
  IconMail,
  IconShieldCheck,
  IconCircleCheckFilled,
  IconEdit,
  IconKey,
  IconCheck,
  IconLoader,
  IconEye,
  IconEyeOff,
  IconCamera,
} from '@tabler/icons-react';
import { getCurrentUser } from '@/lib/auth';
import { toast } from 'sonner';

const panel = "w-full bg-white dark:bg-zinc-900/70 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-sm backdrop-blur-xl";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export function Profile() {
  const user = getCurrentUser();
  const [editingProfile, setEditingProfile] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : 'SA';

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
    },
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const onProfileSubmit = async (data: ProfileForm) => {
    await new Promise(r => setTimeout(r, 800));
    toast.success('Profile updated successfully');
    setEditingProfile(false);
  };

  const onPasswordSubmit = async (_data: PasswordForm) => {
    await new Promise(r => setTimeout(r, 900));
    toast.success('Password changed successfully');
    passwordForm.reset();
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6">

      {/* Profile Hero */}
      <div className={`${panel} p-6`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="size-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold select-none">
              {initials}
            </div>
            <button className="absolute -bottom-1 -right-1 size-7 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
              <IconCamera className="size-3.5 text-muted-foreground" />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-xl font-bold">
                {user ? `${user.firstName} ${user.lastName}` : 'Super Admin'}
              </h1>
              <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 border-0 gap-1 text-xs">
                <IconShieldCheck className="size-3" /> Super Admin
              </Badge>
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-0 gap-1 text-xs">
                <IconCircleCheckFilled className="size-3" /> Active
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <IconMail className="size-3.5" />
              {user?.email ?? 'admin@pollify.com'}
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 h-8 shrink-0"
            onClick={() => setEditingProfile(e => !e)}
          >
            {editingProfile ? <IconCheck className="size-3.5" /> : <IconEdit className="size-3.5" />}
            {editingProfile ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

        {/* LEFT: Profile form + Password */}
        <div className="lg:col-span-2 flex flex-col gap-4 md:gap-6">

          {/* Personal Information */}
          <div className={`${panel} p-6`}>
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="size-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  <IconUser className="size-3.5" />
                </span>
                <h2 className="text-base font-semibold">Personal Information</h2>
              </div>
              <p className="text-sm text-muted-foreground ml-8">
                Your personal details used across the platform.
              </p>
            </div>
            <Separator className="bg-zinc-100 dark:bg-zinc-800 mb-5" />

            {editingProfile ? (
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField
                      control={profileForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">First Name</FormLabel>
                          <FormControl>
                            <Input className="h-10 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Last Name</FormLabel>
                          <FormControl>
                            <Input className="h-10 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" className="h-10 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700" {...field} />
                        </FormControl>
                        <FormDescription className="text-xs">Changing your email will require re-verification.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <Button type="button" variant="outline" size="sm" onClick={() => setEditingProfile(false)}>Cancel</Button>
                    <Button type="submit" size="sm" disabled={profileForm.formState.isSubmitting} className="gap-1.5 px-5">
                      {profileForm.formState.isSubmitting ? <IconLoader className="size-3.5 animate-spin" /> : <IconCheck className="size-3.5" />}
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <div className="space-y-4">
                {[
                  { label: 'First Name', value: user?.firstName ?? '—' },
                  { label: 'Last Name', value: user?.lastName ?? '—' },
                  { label: 'Email Address', value: user?.email ?? '—' },
                  { label: 'Role', value: 'Super Admin' },
                  { label: 'Account Status', value: 'Active' },
                ].map((row, i, arr) => (
                  <div key={row.label}>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-muted-foreground w-36 shrink-0">{row.label}</span>
                      <span className="text-sm font-medium">{row.value}</span>
                    </div>
                    {i < arr.length - 1 && <Separator className="mt-4 bg-zinc-100 dark:bg-zinc-800" />}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Change Password */}
          <div className={`${panel} p-6`}>
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="size-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  <IconKey className="size-3.5" />
                </span>
                <h2 className="text-base font-semibold">Change Password</h2>
              </div>
              <p className="text-sm text-muted-foreground ml-8">
                Update your password to keep your account secure.
              </p>
            </div>
            <Separator className="bg-zinc-100 dark:bg-zinc-800 mb-5" />

            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-5">
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Current Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showCurrent ? 'text' : 'password'}
                            placeholder="Enter current password"
                            className="h-10 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 pr-10"
                            {...field}
                          />
                          <button type="button" onClick={() => setShowCurrent(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                            {showCurrent ? <IconEyeOff className="size-4" /> : <IconEye className="size-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showNew ? 'text' : 'password'}
                              placeholder="Min 8 characters"
                              className="h-10 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 pr-10"
                              {...field}
                            />
                            <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                              {showNew ? <IconEyeOff className="size-4" /> : <IconEye className="size-4" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirm ? 'text' : 'password'}
                              placeholder="Repeat new password"
                              className="h-10 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 pr-10"
                              {...field}
                            />
                            <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                              {showConfirm ? <IconEyeOff className="size-4" /> : <IconEye className="size-4" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end pt-1">
                  <Button type="submit" size="sm" disabled={passwordForm.formState.isSubmitting} className="gap-1.5 px-5">
                    {passwordForm.formState.isSubmitting ? <IconLoader className="size-3.5 animate-spin" /> : <IconKey className="size-3.5" />}
                    Update Password
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>

        {/* RIGHT: Account summary */}
        <div className="flex flex-col gap-4">
          <div className={`${panel} p-6`}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Account Summary</h3>
            <div className="space-y-3">
              {[
                { label: 'Member Since', value: 'Jan 10, 2024' },
                { label: 'Last Login', value: 'Feb 21, 2026' },
                { label: 'Role', value: 'Super Admin' },
                { label: 'Status', value: 'Active' },
                { label: 'Email Verified', value: '✓ Verified' },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">{row.label}</span>
                  <span className="text-xs font-medium">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security Tips */}
          <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-5 border border-zinc-100 dark:border-zinc-800">
            <h3 className="text-sm font-semibold mb-3">Security Tips</h3>
            <div className="space-y-2.5">
              {[
                'Use a strong, unique password',
                'Never share your credentials',
                'Log out from shared devices',
                'Review your login activity regularly',
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2">
                  <IconCircleCheckFilled className="size-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-xs text-muted-foreground">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
