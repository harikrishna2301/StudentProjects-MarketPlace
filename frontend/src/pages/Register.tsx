import React from 'react';
import { BrandLogo } from '../components/BrandLogo';
import { SEOHead } from '../components/SEOHead';
import { AuthSplitCard } from '../components/AuthSplitCard';

export const Register: React.FC = () => {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center py-8 px-4 sm:px-6 bg-[#0B0720] text-[#F8FAFC] transition-colors duration-200">
      <SEOHead
        title="Create Student Account"
        description="Register for a verified ProjectKit student account."
        noIndex={true}
      />

      {/* Prominent High-Visibility Brand Logo Header */}
      <div className="mb-6 flex flex-col items-center text-center">
        <BrandLogo size="lg" variant="full" tagline="Verified Academic Kits & IEEE Projects" lightText={true} />
      </div>

      {/* Animated Diagonal Split Authentication Card strictly following reference styling */}
      <div className="w-full flex justify-center">
        <AuthSplitCard initialMode="register" />
      </div>
    </div>
  );
};

export default Register;
