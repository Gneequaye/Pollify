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
          title: 'Admin Dashboard Access',
          description: 'Manage your school\'s elections, create polls, and oversee the democratic process with powerful admin tools.',
          image: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&q=80' // Voting/ballot box
        };
      case 'register':
        return {
          title: 'Empower Your School Democracy',
          description: 'Create and manage secure elections for your school. Set up voting events, manage candidates, and ensure fair democratic processes.',
          image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80' // Students/community
        };
      case 'reset':
        return {
          title: 'Account Recovery',
          description: 'Regain access to your account quickly and securely.',
          image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80' // Security/lock
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
            <Link to="/" className="inline-flex items-center gap-3">
              {/* Voting Ballot Icon */}
              <svg 
                className="w-10 h-10 text-foreground" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-2xl font-bold text-foreground">
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
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={imageContent.image}
            alt="Voting"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-purple-600/70 to-indigo-700/80"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white">
          <div className="text-center max-w-md">
            <h2 className="text-4xl font-bold mb-6 drop-shadow-lg">
              {imageContent.title}
            </h2>
            <p className="text-xl text-white/90 leading-relaxed drop-shadow-md">
              {imageContent.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
