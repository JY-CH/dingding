import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useThingStore } from '../store/useThingStore';
import Button from '../components/common/Button';
import MainLayout from '../components/layout/MainLayout';

const HomePage: React.FC = () => {
  const { things, addThing } = useThingStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      addThing({ title, description });
      setTitle('');
      setDescription('');
    }
  };

  return (
    <MainLayout>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Things List</h2>
        
        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
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
          <Button type="submit" variant="primary">
            Add Thing
          </Button>
        </form>
        
        <div className="space-y-4">
          {things.length === 0 ? (
            <p className="text-gray-500">No things yet. Add your first one!</p>
          ) : (
            things.map((thing) => (
              <div key={thing.id} className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold">
                  <Link to={`/detail/${thing.id}`} className="text-blue-600 hover:underline">
                    {thing.title}
                  </Link>
                </h3>
                <p className="text-gray-600 mt-1">{thing.description}</p>
                <div className="mt-2 flex justify-end space-x-2">
                  <Link to={`/edit/${thing.id}`}>
                    <Button variant="secondary">Edit</Button>
                  </Link>
                  <Link to={`/detail/${thing.id}`}>
                    <Button>View Details</Button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;