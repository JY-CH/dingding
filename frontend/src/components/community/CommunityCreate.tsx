import { useState } from "react";

export const CommunityCreate: React.FC = () => {
      const [newPostTitle, setNewPostTitle] = useState('');
      const [newPostContent, setNewPostContent] = useState('');
    return (
        <>
        <section className="bg-zinc-800/90 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Create a New Post</h2>
          <input
            type="text"
            placeholder="Post Title"
            className="w-full py-2 px-4 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-amber-500 mb-4"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
          />
          <textarea
            placeholder="Post Content"
            className="w-full py-2 px-4 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-amber-500 mb-4 h-32 resize-none"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          />
          <button
            onClick={handleCreatePost}
            className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Post
          </button>
        </section>

        {/* Categories Section */}
        <section className="bg-zinc-800/90 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {mockCategories.map((category) => (
              <button
                key={category}
                className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm hover:bg-white/10 transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </section>
        </>
    )
}
