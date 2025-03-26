import React from 'react';

import { useParams, useNavigate } from 'react-router-dom';

import Button from '@/components/common/Button';
import MainLayout from '@/components/layout/MainLayout';
import { useThingStore } from '@/store/useThingStore';

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { things, removeThing } = useThingStore();
  
  const thing = things.find(t => t.id === id);
  
  if (!thing) {
    return (
      <MainLayout>
        <div className="bg-white shadow sm:rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Item Not Found</h2>
          <p className="mb-4">The item you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </MainLayout>
    );
  }
  
  const handleDelete = () => {
    removeThing(thing.id);
    navigate('/');
  };
  
  return (
    <MainLayout>
      <div className="bg-white shadow sm:rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">{thing.title}</h2>
        <p className="text-gray-700 mb-4">{thing.description}</p>
        <p className="text-sm text-gray-500 mb-6">
          Created: {thing.createdAt.toLocaleString()}
        </p>
        
        <div className="flex space-x-4">
          <Button onClick={() => navigate(`/edit/${thing.id}`)}>Edit</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
          <Button variant="secondary" onClick={() => navigate('/')}>Back</Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default DetailPage;