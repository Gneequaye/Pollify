import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  imageType?: 'login' | 'register' | 'reset';
}

export function AuthLayout({ children, title, subtitle, imageType = 'login' }: AuthLayoutProps) {
  const getImageContent = () => {
    switch (imageType) {
      case 'login':
        return {
          title: 'Welcome Back to Pollify',
          description: 'Secure, transparent, and accessible voting for your institution',
          features: [
            '🗳️ Real-time voting results',
            '🔒 Bank-level security',
            '📊 Complete transparency',
            '⚡ Instant notifications'
          ]
        };
      case 'register':
        return {
          title: 'Join Your School Community',
          description: 'Be part of the democratic process at your institution',
          features: [
            '✅ Verify your identity',
            '🎯 Cast your vote securely',
            '📈 Track election results',
            '🔔 Stay updated in real-time'
          ]
        };
      case 'reset':
        return {
          title: 'Secure Account Recovery',
          description: 'We\'ll help you get back to voting in no time',
          features: [
            '🔐 Secure password reset',
            '✉️ Email verification',
            '⚡ Quick recovery process',
            '🛡️ Account protection'
          ]
        };
    }
  };

  const imageContent = getImageContent();

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Pollify
              </span>
            </Link>
          </div>

          {/* Title & Subtitle */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>

          {/* Form Content */}
          <div>{children}</div>
        </div>
      </div>

      {/* Right Side - Image/Illustration */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white">
          {/* Voting Illustration */}
          <div className="mb-8">
            <svg
              className="w-64 h-64"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Ballot Box */}
              <rect x="40" y="100" width="120" height="80" rx="8" fill="white" fillOpacity="0.9" />
              <rect x="40" y="100" width="120" height="20" rx="8" fill="white" fillOpacity="1" />
              
              {/* Slot */}
              <rect x="85" y="85" width="30" height="4" rx="2" fill="white" fillOpacity="0.9" />
              
              {/* Ballot Paper */}
              <g transform="translate(70, 20)">
                <rect x="0" y="0" width="60" height="80" rx="4" fill="white" fillOpacity="0.95" />
                <line x1="10" y1="15" x2="50" y2="15" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
                <line x1="10" y1="25" x2="50" y2="25" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
                <line x1="10" y1="35" x2="40" y2="35" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
                <circle cx="15" cy="50" r="6" fill="#10B981" />
                <path d="M12 50 L14 52 L18 48" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </g>
              
              {/* Checkmark Badge */}
              <circle cx="140" cy="70" r="20" fill="#10B981" />
              <path d="M130 70 L136 76 L150 62" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>

          {/* Text Content */}
          <div className="text-center max-w-md">
            <h2 className="text-3xl font-bold mb-4">{imageContent.title}</h2>
            <p className="text-lg mb-8 text-blue-100">{imageContent.description}</p>

            {/* Features */}
            <div className="space-y-3 text-left">
              {imageContent.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-white/90">
                  <span className="text-xl">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full blur-xl" />
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        </div>
      </div>
    </div>
  );
}
