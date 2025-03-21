import React, { useState, useEffect } from 'react';

import { useParams, useNavigate } from 'react-router-dom';

import Button from '../components/common/Button';
import MainLayout from '../components/layout/MainLayout';
import { useThingStore } from '../store/useThingStore';

const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { things, updateThing } = useThingStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const thing = things.find(t => t.id === id);
  
  useEffect(() => {
    if (thing) {
      setTitle(thing.title);
      setDescription(thing.description);
    } else {
      navigate('/');
    }
  }, [thing, navigate]);
  
  if (!thing) {
    return null;
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateThing(thing.id, { title, description });
    navigate(`/detail/${thing.id}`);
  };
  
  return (
    <MainLayout>
      <div className="bg-white shadow sm:rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Edit Thing</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              rows={3}
              required
            />
          </div>
          <div className="flex space-x-4">
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(`/detail/${thing.id}`)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default EditPage;