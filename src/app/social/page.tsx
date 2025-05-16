"use client";

import { useState } from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";

// Sample data
const DUMMY_POSTS = [
  {
    id: 1,
    username: "BlockMaster",
    userHandle: "@blockmaster",
    avatar: null,
    content: "Solana price surged today! 🚀",
    likes: 24,
    comments: 5,
    timestamp: "1 hour ago",
  },
  {
    id: 2,
    username: "ChainExplorer",
    userHandle: "@chainexplorer",
    avatar: null,
    content: "New NFT collection launching tomorrow! #NFT #Solana",
    likes: 56,
    comments: 12,
    timestamp: "3 hours ago",
  },
  {
    id: 3,
    username: "EthereumFan",
    userHandle: "@eth_lover",
    avatar: null,
    content:
      "Ethereum 2.0 update is progressing faster than expected. What are your thoughts?",
    likes: 89,
    comments: 32,
    timestamp: "5 hours ago",
  },
];

export default function SocialPage() {
  const [posts, setPosts] = useState(DUMMY_POSTS);
  const [newPost, setNewPost] = useState("");

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    const post = {
      id: Date.now(),
      username: "My Account",
      userHandle: "@me",
      avatar: null,
      content: newPost,
      likes: 0,
      comments: 0,
      timestamp: "Just now",
    };

    setPosts([post, ...posts]);
    setNewPost("");
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Social Feed</h1>

      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <form onSubmit={handlePostSubmit}>
          <div className="flex items-start gap-3">
            <UserCircleIcon className="h-10 w-10 text-gray-400" />
            <div className="flex-1">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's happening?"
                className="w-full border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  disabled={!newPost.trim()}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3 mb-3">
              <UserCircleIcon className="h-10 w-10 text-gray-400" />
              <div>
                <p className="font-semibold">{post.username}</p>
                <p className="text-gray-500 text-sm">{post.userHandle}</p>
              </div>
              <span className="ml-auto text-sm text-gray-500">
                {post.timestamp}
              </span>
            </div>
            <p className="mb-4">{post.content}</p>
            <div className="flex gap-4 text-gray-500 text-sm">
              <button className="flex items-center gap-1 hover:text-blue-500">
                <span>❤️</span> {post.likes}
              </button>
              <button className="flex items-center gap-1 hover:text-blue-500">
                <span>💬</span> {post.comments}
              </button>
              <button className="flex items-center gap-1 hover:text-blue-500">
                <span>🔁</span> Share
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
