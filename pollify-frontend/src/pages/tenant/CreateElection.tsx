import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  IconArrowLeft,
  IconArrowRight,
  IconCalendar,
  IconCircleCheckFilled,
  IconInfoCircle,
  IconLoader,
  IconPlus,
  IconTrash,
  IconUsers,
  IconX,
} from '@tabler/icons-react';

const panel =
  'w-full bg-white dark:bg-zinc-900/70 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-sm backdrop-blur-xl';

// ─── Schemas ──────────────────────────────────────────────────────────────────

const detailsSchema = z
  .object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
  })
  .refine((d) => new Date(d.endDate) > new Date(d.startDate), {
    message: 'End date must be after start date',
    path: ['endDate'],
  });

type DetailsFormData = z.infer<typeof detailsSchema>;

type Candidate = {
  id: string;
  name: string;
  position: string;
};

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  const steps = [
    { n: 1, label: 'Election Details' },
    { n: 2, label: 'Add Candidates' },
    { n: 3, label: 'Review & Create' },
  ];
  return (
    <div className="flex items-center gap-0">
      {steps.map((step, i) => (
        <div key={step.n} className="flex items-center gap-0">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`size-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                current > step.n
                  ? 'bg-emerald-500 text-white'
                  : current === step.n
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-muted-foreground'
              }`}
            >
              {current > step.n ? <IconCircleCheckFilled className="size-4" /> : step.n}
            </div>
            <span
              className={`text-xs font-medium hidden sm:block ${
                current === step.n ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`h-px w-16 sm:w-20 mx-2 mb-5 transition-all ${
                current > step.n ? 'bg-emerald-400' : 'bg-zinc-200 dark:bg-zinc-700'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CreateElection() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);
  const [detailsData, setDetailsData] = useState<DetailsFormData | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [candidateName, setCandidateName] = useState('');
  const [candidatePosition, setCandidatePosition] = useState('');
  const [candidateError, setCandidateError] = useState('');

  const detailsForm = useForm<DetailsFormData>({
    resolver: zodResolver(detailsSchema),
    defaultValues: { title: '', description: '', startDate: '', endDate: '' },
  });

  // ── Step 1: Election Details ────────────────────────────────────────────────
  const handleDetailsSubmit = (data: DetailsFormData) => {
    setDetailsData(data);
    setStep(2);
  };

  // ── Step 2: Candidate management ───────────────────────────────────────────
  const handleAddCandidate = () => {
    if (!candidateName.trim() || !candidatePosition.trim()) {
      setCandidateError('Both candidate name and position are required.');
      return;
    }
    setCandidates((prev) => [
      ...prev,
      {
        id: `CAND-${Date.now()}`,
        name: candidateName.trim(),
        position: candidatePosition.trim(),
      },
    ]);
    setCandidateName('');
    setCandidatePosition('');
    setCandidateError('');
  };

  const handleRemoveCandidate = (id: string) => {
    setCandidates((prev) => prev.filter((c) => c.id !== id));
  };

  const handleCandidatesNext = () => {
    if (candidates.length < 2) {
      setCandidateError('You must add at least 2 candidates before proceeding.');
      return;
    }
    setCandidateError('');
    setStep(3);
  };

  // ── Step 3: Create ──────────────────────────────────────────────────────────
  const handleCreate = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1400));
    setSubmitting(false);
    toast.success('Election created successfully!', {
      description: `"${detailsData?.title}" is now in draft. You can activate it from the elections list.`,
    });
    navigate('/dashboard/tenant/elections');
  };

  // ═══ STEP 1 ═══════════════════════════════════════════════════════════════
  if (step === 1) {
    return (
      <div className="flex flex-col gap-4 md:gap-6">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground hover:text-foreground -ml-1"
            onClick={() => navigate('/dashboard/tenant/elections')}
          >
            <IconArrowLeft className="size-4" /> Back to Elections
          </Button>
        </div>

        <div className={`${panel} p-6`}>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl font-bold">Create Election</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Set up a new election for your institution
              </p>
            </div>
            <StepIndicator current={1} />
          </div>
          <Separator className="bg-zinc-100 dark:bg-zinc-800 mb-6" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="size-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h2 className="text-base font-semibold">Election Details</h2>
                </div>
                <p className="text-sm text-muted-foreground ml-8">
                  Provide the core information for this election.
                </p>
              </div>

              <Form {...detailsForm}>
                <form
                  onSubmit={detailsForm.handleSubmit(handleDetailsSubmit)}
                  className="space-y-5"
                >
                  {/* Title */}
                  <FormField
                    control={detailsForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Election Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. SRC Presidential Election 2025"
                            className="h-10 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={detailsForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Description</FormLabel>
                        <FormControl>
                          <textarea
                            rows={4}
                            placeholder="Describe the purpose and scope of this election..."
                            className="w-full rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Dates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField
                      control={detailsForm.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Start Date & Time</FormLabel>
                          <FormControl>
                            <Input
                              type="datetime-local"
                              className="h-10 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={detailsForm.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">End Date & Time</FormLabel>
                          <FormControl>
                            <Input
                              type="datetime-local"
                              className="h-10 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button type="submit" className="gap-2 px-6">
                      Continue <IconArrowRight className="size-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            </div>

            {/* Info Panel */}
            <div className="lg:col-span-1">
              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-5 border border-zinc-200 dark:border-zinc-700">
                <div className="flex items-center gap-2 mb-3">
                  <IconInfoCircle className="size-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold">About this step</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Define the basic metadata for your election before adding candidates.
                </p>
                <div className="space-y-2.5">
                  {[
                    'Choose a clear, descriptive title so voters can identify the election easily',
                    'The description helps voters understand the context and importance of the election',
                    'Start and end dates control when voters can cast their ballots — set these carefully',
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
      </div>
    );
  }

  // ═══ STEP 2 ═══════════════════════════════════════════════════════════════
  if (step === 2) {
    return (
      <div className="flex flex-col gap-4 md:gap-6">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground hover:text-foreground -ml-1"
            onClick={() => setStep(1)}
          >
            <IconArrowLeft className="size-4" /> Back
          </Button>
        </div>

        <div className={`${panel} p-6`}>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl font-bold">Add Candidates</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Add all candidates who will participate in{' '}
                <span className="font-semibold text-foreground">{detailsData?.title}</span>
              </p>
            </div>
            <StepIndicator current={2} />
          </div>
          <Separator className="bg-zinc-100 dark:bg-zinc-800 mb-6" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
            {/* Form */}
            <div className="lg:col-span-2 space-y-5">
              <div className="mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="size-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h2 className="text-base font-semibold">Add Candidates</h2>
                </div>
                <p className="text-sm text-muted-foreground ml-8">
                  Add at least 2 candidates. You can remove them before proceeding.
                </p>
              </div>

              {/* Inline add form */}
              <div className="bg-zinc-50 dark:bg-zinc-800/30 rounded-xl border border-zinc-200 dark:border-zinc-700 p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  New Candidate
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="text-sm font-medium block mb-1.5">Candidate Name</label>
                    <Input
                      placeholder="e.g. Kofi Boateng"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCandidate())}
                      className="h-9 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1.5">Position / Role</label>
                    <Input
                      placeholder="e.g. President"
                      value={candidatePosition}
                      onChange={(e) => setCandidatePosition(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCandidate())}
                      className="h-9 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-sm"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="gap-1.5"
                  onClick={handleAddCandidate}
                >
                  <IconPlus className="size-4" /> Add Candidate
                </Button>
              </div>

              {/* Error */}
              {candidateError && (
                <p className="text-sm text-destructive flex items-center gap-1.5">
                  <IconX className="size-4" /> {candidateError}
                </p>
              )}

              {/* Candidate list */}
              {candidates.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Added Candidates ({candidates.length})
                  </p>
                  {candidates.map((c, i) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between gap-3 bg-white dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {i + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {c.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{c.position}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveCandidate(c.id)}
                        className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                        title="Remove candidate"
                      >
                        <IconTrash className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {candidates.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-700 text-center">
                  <IconUsers className="size-10 mb-3 text-muted-foreground opacity-40" />
                  <p className="text-sm text-muted-foreground">No candidates added yet</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Use the form above to add candidates
                  </p>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="gap-2"
                >
                  <IconArrowLeft className="size-4" /> Back
                </Button>
                <Button type="button" onClick={handleCandidatesNext} className="gap-2 px-6">
                  Review <IconArrowRight className="size-4" />
                </Button>
              </div>
            </div>

            {/* Info Panel */}
            <div className="lg:col-span-1">
              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-5 border border-zinc-200 dark:border-zinc-700">
                <div className="flex items-center gap-2 mb-3">
                  <IconInfoCircle className="size-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold">About candidates</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Candidates are the options voters will choose from during this election.
                </p>
                <div className="space-y-2.5">
                  {[
                    'A minimum of 2 candidates is required for a valid election',
                    'Each candidate should have a distinct name and position or role',
                    'You can remove candidates before finalising — changes cannot be made after creation',
                  ].map((tip, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <IconCircleCheckFilled className="size-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-xs text-muted-foreground">{tip}</span>
                    </div>
                  ))}
                </div>
                {candidates.length > 0 && (
                  <>
                    <Separator className="my-4 bg-zinc-200 dark:bg-zinc-700" />
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Candidates added</span>
                      <Badge
                        className={`text-xs border-0 ${
                          candidates.length >= 2
                            ? 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-300'
                        }`}
                      >
                        {candidates.length} / min 2
                      </Badge>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══ STEP 3 ═══════════════════════════════════════════════════════════════
  if (step === 3 && detailsData) {
    return (
      <div className="flex flex-col gap-4 md:gap-6">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground hover:text-foreground -ml-1"
            onClick={() => setStep(2)}
          >
            <IconArrowLeft className="size-4" /> Back
          </Button>
        </div>

        <div className={`${panel} p-6`}>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl font-bold">Review & Create</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Confirm all details before creating the election
              </p>
            </div>
            <StepIndicator current={3} />
          </div>
          <Separator className="bg-zinc-100 dark:bg-zinc-800 mb-6" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Election Summary */}
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 p-5">
              <div className="flex items-center gap-2 mb-4">
                <IconCalendar className="size-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Election Details
                </h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Title', value: detailsData.title },
                  { label: 'Description', value: detailsData.description },
                  { label: 'Start Date', value: detailsData.startDate.replace('T', ' ') },
                  { label: 'End Date', value: detailsData.endDate.replace('T', ' ') },
                  { label: 'Total Candidates', value: String(candidates.length) },
                ].map((row) => (
                  <div key={row.label} className="flex items-start justify-between gap-4">
                    <span className="text-sm text-muted-foreground shrink-0 w-32">
                      {row.label}
                    </span>
                    <span className="text-sm font-medium text-right">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Candidates Summary */}
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 p-5">
              <div className="flex items-center gap-2 mb-4">
                <IconUsers className="size-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Candidates ({candidates.length})
                </h3>
              </div>
              <div className="space-y-2.5">
                {candidates.map((c, i) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-3 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5"
                  >
                    <div className="size-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.position}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Notice */}
          <div className="mt-6 flex items-start gap-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <IconInfoCircle className="size-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              The election will be created in <strong>Draft</strong> status. You can activate it
              from the elections list when you're ready to open voting.
            </p>
          </div>

          {/* Actions */}
          <Separator className="bg-zinc-100 dark:bg-zinc-800 my-6" />
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={() => setStep(2)}
              className="gap-2"
            >
              <IconArrowLeft className="size-4" /> Back
            </Button>
            <Button
              onClick={handleCreate}
              disabled={submitting}
              className="gap-2 px-8"
            >
              {submitting ? (
                <>
                  <IconLoader className="size-4 animate-spin" /> Creating…
                </>
              ) : (
                <>
                  <IconCircleCheckFilled className="size-4" /> Create Election
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
