import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { RegistrationSuccess } from './RegistrationSuccess';

type RegistrationType = 'domain' | 'code-list' | 'code-token';

export function RegisterFormMultiStep() {
  const [currentStep, setCurrentStep] = useState(1);
  const [hasOfficialEmail, setHasOfficialEmail] = useState<boolean | null>(null);
  const [registrationType, setRegistrationType] = useState<RegistrationType>('domain');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    // Step 1: Account Type
    type: 'domain' as RegistrationType,
    
    // Step 2: Personal Info
    firstName: '',
    lastName: '',
    email: '',
    
    // Step 3: School Info (varies by type)
    schoolCode: '',
    studentId: '',
    registrationToken: '',
    
    // Step 4: Password
    password: '',
    confirmPassword: '',
  });

  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasNumber: false,
    passwordsMatch: false,
  });

  const totalSteps = 4;

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Update password requirements in real-time
    if (field === 'password' || field === 'confirmPassword') {
      const pwd = field === 'password' ? value : formData.password;
      const confirmPwd = field === 'confirmPassword' ? value : formData.confirmPassword;
      
      setPasswordRequirements({
        minLength: pwd.length >= 8,
        hasNumber: /\d/.test(pwd),
        passwordsMatch: pwd === confirmPwd && pwd.length > 0,
      });
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Implement actual registration API call based on type
      console.log('Registration data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success - show success screen
      setRegistrationComplete(true);
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canProceedFromStep = (step: number): boolean => {
    switch (step) {
      case 1:
        // Must answer the email question first
        return hasOfficialEmail !== null;
      case 2:
        return formData.firstName.trim() !== '' && formData.lastName.trim() !== '' && formData.email.trim() !== '';
      case 3:
        // For domain school, no additional info needed
        if (registrationType === 'domain') return true;
        // For non-official email users, skip school info for now (will be configured in dashboard later)
        return true;
      case 4:
        return passwordRequirements.minLength && passwordRequirements.hasNumber && passwordRequirements.passwordsMatch;
      default:
        return false;
    }
  };

  // Step 1: Choose Registration Type
  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Create Your Admin Account</h3>
        <p className="text-sm text-muted-foreground">First, tell us about your email</p>
      </div>

      {/* Question: Do you have official school email? */}
      <div className="space-y-4">
        <Label className="text-base font-medium">Do you have an official school email address?</Label>
        <p className="text-sm text-muted-foreground">
          (e.g., admin@school.edu, faculty@university.edu)
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <div
            onClick={() => {
              setHasOfficialEmail(true);
              setRegistrationType('domain');
              updateFormData('type', 'domain');
            }}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              hasOfficialEmail === true
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50 hover:bg-accent'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                hasOfficialEmail === true
                  ? 'border-primary bg-primary'
                  : 'border-muted-foreground'
              }`}>
                {hasOfficialEmail === true && <Check className="h-3 w-3 text-primary-foreground" />}
              </div>
              <div className="flex-1">
                <p className="font-medium">Yes, I have one</p>
                <p className="text-xs text-muted-foreground mt-0.5">Use official email</p>
              </div>
            </div>
          </div>

          <div
            onClick={() => {
              setHasOfficialEmail(false);
              // Don't auto-select, let them choose
              if (registrationType === 'domain') {
                setRegistrationType('code-list');
                updateFormData('type', 'code-list');
              }
            }}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              hasOfficialEmail === false
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50 hover:bg-accent'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                hasOfficialEmail === false
                  ? 'border-primary bg-primary'
                  : 'border-muted-foreground'
              }`}>
                {hasOfficialEmail === false && <Check className="h-3 w-3 text-primary-foreground" />}
              </div>
              <div className="flex-1">
                <p className="font-medium">No, I don't</p>
                <p className="text-xs text-muted-foreground mt-0.5">Use personal email</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Show confirmation for users without official email */}
      {hasOfficialEmail === false && (
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm font-medium flex items-center gap-2">
            <Check className="h-4 w-4 text-green-600" />
            No problem! You'll use your personal email
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            You can set up your school connection after creating your admin account
          </p>
        </div>
      )}

      {/* Show confirmation for official email users */}
      {hasOfficialEmail === true && (
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm font-medium flex items-center gap-2">
            <Check className="h-4 w-4 text-green-600" />
            Perfect! You'll use your official school email
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            This helps us verify you're authorized to manage your school's elections
          </p>
        </div>
      )}
    </div>
  );

  // Step 2: Personal Information
  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Admin Information</h3>
        <p className="text-sm text-muted-foreground">Tell us about yourself</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            type="text"
            placeholder="John"
            value={formData.firstName}
            onChange={(e) => updateFormData('firstName', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Doe"
            value={formData.lastName}
            onChange={(e) => updateFormData('lastName', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder={
            registrationType === 'domain' 
              ? 'your.email@school.edu'
              : 'your.email@gmail.com'
          }
          value={formData.email}
          onChange={(e) => updateFormData('email', e.target.value)}
          required
        />
        <p className="text-xs text-muted-foreground">
          {registrationType === 'domain' 
            ? 'Use your official school email to verify your authorization'
            : 'Use your personal email address'
          }
        </p>
      </div>
    </div>
  );

  // Step 3: School Information
  const renderStep3 = () => {
    if (hasOfficialEmail === true) {
      // Domain School - Official Email
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">School Verification</h3>
            <p className="text-sm text-muted-foreground">We'll verify your school email to confirm your authorization</p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm">
              <strong>School Domain:</strong> {formData.email.split('@')[1] || 'Not yet entered'}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              A verification link will be sent to your email. Click it to activate your admin account and access the dashboard.
            </p>
          </div>
        </div>
      );
    }

    // For users without official email - skip school info for now
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Almost There!</h3>
          <p className="text-sm text-muted-foreground">You'll configure your school in the dashboard</p>
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm font-medium">Admin Account Email</p>
          <p className="text-sm mt-1">
            <strong>Email:</strong> {formData.email || 'Not yet entered'}
          </p>
          <p className="text-xs text-muted-foreground mt-3">
            After creating your admin account, you'll set up your school's details and configure the voting system from your dashboard.
          </p>
        </div>
      </div>
    );
  };

  // Step 4: Password
  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Secure Your Admin Account</h3>
        <p className="text-sm text-muted-foreground">Choose a strong password to protect your account</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => updateFormData('password', e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => updateFormData('confirmPassword', e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Password Requirements */}
      <div className="bg-muted p-4 rounded-lg space-y-2">
        <p className="text-sm font-medium mb-2">Password Requirements:</p>
        <div className="space-y-1 text-sm">
          <div className={`flex items-center gap-2 ${passwordRequirements.minLength ? 'text-green-600' : 'text-muted-foreground'}`}>
            {passwordRequirements.minLength ? <Check className="h-4 w-4" /> : <span className="h-4 w-4">✗</span>}
            <span>At least 8 characters</span>
          </div>
          <div className={`flex items-center gap-2 ${passwordRequirements.hasNumber ? 'text-green-600' : 'text-muted-foreground'}`}>
            {passwordRequirements.hasNumber ? <Check className="h-4 w-4" /> : <span className="h-4 w-4">✗</span>}
            <span>Contains a number</span>
          </div>
          <div className={`flex items-center gap-2 ${passwordRequirements.passwordsMatch ? 'text-green-600' : 'text-muted-foreground'}`}>
            {passwordRequirements.passwordsMatch ? <Check className="h-4 w-4" /> : <span className="h-4 w-4">✗</span>}
            <span>Passwords match</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Show success screen if registration is complete
  if (registrationComplete) {
    return (
      <RegistrationSuccess
        email={formData.email}
        hasOfficialEmail={hasOfficialEmail === true}
        firstName={formData.firstName}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center flex-1">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              currentStep >= step 
                ? 'border-primary bg-primary text-primary-foreground' 
                : 'border-muted bg-background text-muted-foreground'
            }`}>
              {currentStep > step ? <Check className="h-5 w-5" /> : step}
            </div>
            {step < 4 && (
              <div className={`flex-1 h-1 mx-2 ${
                currentStep > step ? 'bg-primary' : 'bg-muted'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Labels */}
      <div className="text-center mb-6">
        <p className="text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps}:{' '}
          {currentStep === 1 && 'Account Type'}
          {currentStep === 2 && 'Admin Information'}
          {currentStep === 3 && 'School Verification'}
          {currentStep === 4 && 'Secure Account'}
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Step Content */}
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
      {currentStep === 4 && renderStep4()}

      {/* Navigation Buttons */}
      <div className="flex gap-3 pt-4">
        {currentStep > 1 && (
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            className="flex-1"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        )}

        {currentStep < totalSteps ? (
          <Button
            type="button"
            onClick={handleNext}
            disabled={!canProceedFromStep(currentStep)}
            className="flex-1"
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={loading || !canProceedFromStep(currentStep)}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        )}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to="/login" className="text-primary font-medium hover:underline">
          Sign in
        </Link>
      </div>
    </form>
  );
}
