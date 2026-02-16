import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Loader2, Check, X } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type RegistrationType = 'domain' | 'code-list' | 'code-token';

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registrationType, setRegistrationType] = useState<RegistrationType>('domain');
  
  const [formData, setFormData] = useState({
    // Common fields
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    
    // Domain school
    schoolEmail: '',
    
    // Code school
    schoolCode: '',
    studentId: '',
    registrationToken: '',
    personalEmail: '',
  });

  const passwordRequirements = [
    { met: formData.password.length >= 8, text: 'At least 8 characters' },
    { met: /\d/.test(formData.password), text: 'Contains a number' },
    { met: formData.password === formData.confirmPassword && formData.password.length > 0, text: 'Passwords match' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Implement actual registration API call based on type
      console.log('Registration attempt:', { registrationType, formData });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Handle successful registration
      // navigate('/auth/login?registered=true');
    } catch (err) {
      setError('Registration failed. Please check your information and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Registration Type Selection */}
      <div className="space-y-3">
        <Label>How are you registering?</Label>
        <RadioGroup value={registrationType} onValueChange={(value) => setRegistrationType(value as RegistrationType)}>
          <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-accent">
            <RadioGroupItem value="domain" id="domain" />
            <Label htmlFor="domain" className="cursor-pointer flex-1">
              <div className="font-medium">School Email</div>
              <div className="text-xs text-muted-foreground">I have an official school email (e.g., name@school.edu)</div>
            </Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-accent">
            <RadioGroupItem value="code-list" id="code-list" />
            <Label htmlFor="code-list" className="cursor-pointer flex-1">
              <div className="font-medium">School Code + Student ID</div>
              <div className="text-xs text-muted-foreground">My school provided a code and I have my student ID</div>
            </Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-accent">
            <RadioGroupItem value="code-token" id="code-token" />
            <Label htmlFor="code-token" className="cursor-pointer flex-1">
              <div className="font-medium">School Code + Registration Token</div>
              <div className="text-xs text-muted-foreground">My school gave me a registration token</div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Domain School Fields */}
      {registrationType === 'domain' && (
        <div className="space-y-2">
          <Label htmlFor="schoolEmail">School Email Address</Label>
          <Input
            id="schoolEmail"
            type="email"
            placeholder="your.name@school.edu"
            value={formData.schoolEmail}
            onChange={(e) => setFormData({ ...formData, schoolEmail: e.target.value })}
            required
            disabled={loading}
          />
          <p className="text-xs text-muted-foreground">Use your official school email address</p>
        </div>
      )}

      {/* Code School - Student List Fields */}
      {registrationType === 'code-list' && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="schoolCode">School Code</Label>
              <Input
                id="schoolCode"
                type="text"
                placeholder="GCTU"
                value={formData.schoolCode}
                onChange={(e) => setFormData({ ...formData, schoolCode: e.target.value.toUpperCase() })}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID</Label>
              <Input
                id="studentId"
                type="text"
                placeholder="ST2024001"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                required
                disabled={loading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="personalEmail">Personal Email</Label>
            <Input
              id="personalEmail"
              type="email"
              placeholder="your.email@gmail.com"
              value={formData.personalEmail}
              onChange={(e) => setFormData({ ...formData, personalEmail: e.target.value })}
              required
              disabled={loading}
            />
          </div>
        </>
      )}

      {/* Code School - Token Fields */}
      {registrationType === 'code-token' && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="schoolCodeToken">School Code</Label>
              <Input
                id="schoolCodeToken"
                type="text"
                placeholder="RADFORD"
                value={formData.schoolCode}
                onChange={(e) => setFormData({ ...formData, schoolCode: e.target.value.toUpperCase() })}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registrationToken">Registration Token</Label>
              <Input
                id="registrationToken"
                type="text"
                placeholder="PLF-XXXXXXXX"
                value={formData.registrationToken}
                onChange={(e) => setFormData({ ...formData, registrationToken: e.target.value.toUpperCase() })}
                required
                disabled={loading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="personalEmailToken">Personal Email</Label>
            <Input
              id="personalEmailToken"
              type="email"
              placeholder="your.email@gmail.com"
              value={formData.personalEmail}
              onChange={(e) => setFormData({ ...formData, personalEmail: e.target.value })}
              required
              disabled={loading}
            />
          </div>
        </>
      )}

      {/* Common Fields - Name */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            type="text"
            placeholder="John"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Doe"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
            disabled={loading}
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a strong password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            disabled={loading}
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

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
            disabled={loading}
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
      {formData.password && (
        <div className="space-y-2 p-3 bg-muted rounded-lg">
          <p className="text-sm font-medium">Password Requirements:</p>
          <div className="space-y-1">
            {passwordRequirements.map((req, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                {req.met ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-muted-foreground" />
                )}
                <span className={req.met ? 'text-green-600' : 'text-muted-foreground'}>
                  {req.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full" 
        size="lg" 
        disabled={loading || !passwordRequirements.every(req => req.met)}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          'Create Account'
        )}
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to="/auth/login" className="text-primary font-medium hover:underline">
          Sign in
        </Link>
      </div>
    </form>
  );
}
