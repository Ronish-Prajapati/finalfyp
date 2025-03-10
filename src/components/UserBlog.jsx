import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UserBlog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        
        // Get the token from localStorage or wherever you store it
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          // Redirect to login if no token found
          navigate('/login');
          return;
        }

        // Using the API endpoint with bearer token
        const response = await fetch(`http://localhost:1010/adminuser/api/v1/user/${userId}/posts`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.status === 401) {
          // Handle unauthorized - token expired or invalid
          localStorage.removeItem('authToken');
          navigate('/login');
          return;
        }
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setPosts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId, navigate]);

  const handleReadMore = (postId) => {
    navigate(`/blog/${postId}`);
  };

  if (loading) return <div className="text-center p-4">Loading posts...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Blog Posts</h1>
      
      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="border rounded-lg shadow-md overflow-hidden">
              {post.coverImage && (
                <img 
                  src={post.coverImage} 
                  alt={post.title} 
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-2">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-700 mb-4">
                  {post.content.substring(0, 150)}
                  {post.content.length > 150 ? '...' : ''}
                </p>
                <button
                  onClick={() => handleReadMore(post.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBlog;