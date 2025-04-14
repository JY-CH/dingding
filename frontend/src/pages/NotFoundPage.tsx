import React from 'react';

import { Link } from 'react-router-dom';

import Button from '../components/common/Button';
import MainLayout from '../components/layout/MainLayout';

const NotFoundPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="bg-white shadow sm:rounded-lg p-6 text-center">
        <h2 className="text-3xl font-bold mb-4">404</h2>
        <p className="text-xl mb-6">Page Not Found</p>
        <p className="mb-6">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    </MainLayout>
  );
};

export default NotFoundPage;