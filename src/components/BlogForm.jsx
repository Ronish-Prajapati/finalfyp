import React, { useState, useEffect } from 'react';
import UserService from '../components/service/UserService'; // Import your UserService

const BlogForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    addedDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD
    category: '',
    image: null
  });
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fetchingCategories, setFetchingCategories] = useState(true);
  
  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      setFetchingCategories(true);
      try {
        // Get token from storage
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if (!token) {
          setError("Authentication required. Please log in to access categories.");
          return;
        }
        
        // Use your getAllCategories function
        const categoriesData = await UserService.getAllCategories(token);
        console.log("Fetched categories:", categoriesData);
        setCategories(categoriesData);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again.");
      } finally {
        setFetchingCategories(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0]
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Get token from local storage or wherever you store it
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError("Authentication required. Please log in.");
        setLoading(false);
        return;
      }
      
      // Debug information
      console.log("Submitting blog with token:", token.substring(0, 10) + "...");
      
      // Create FormData object for multipart/form-data
      const blogFormData = new FormData();
      blogFormData.append('title', formData.title);
      blogFormData.append('content', formData.content);
      blogFormData.append('addedDate', formData.addedDate);
      // blogFormData.append('category', JSON.stringify({ categoryId: Number(formData.category) }));
      if (formData.image) {
        blogFormData.append('image', formData.image);  // Corrected
    }
      
      console.log(blogFormData, "dsfsdf");
      
      // Modified to send FormData
      const response = await UserService.createBlog({
        title: formData.title,
        content: formData.content,
        addedDate: formData.addedDate,
        // category: { categoryId: Number(formData.category) },
        image: formData.image
      }, token);
      console.log(response, "response");
      if (response && (response.status === 201 || response.status === 200)) {
        setSuccess("Blog post created successfully!");
        // Reset form
        setFormData({
          title: '',
          content: '',
          addedDate: new Date().toISOString().split('T')[0],
          category: '',
          image_name: null
        });
        // Reset file input
        document.getElementById('image-upload').value = '';
      }
    } catch (err) {
      console.error("Full error details:", err);
      if (err.response?.status === 403) {
        setError("You don't have permission to create blog posts. Please check your login credentials.");
      } else {
        setError(err.response?.data?.message || "Failed to create blog post. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mt-5">
      <div className="card p-4 shadow-sm rounded-3">
        <h2 className="text-center mb-4 text-primary">Create New Blog Post</h2>
        
        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter blog title"
              required
            />
          </div>
          
          {/* <div className="mb-3">
            <label htmlFor="category" className="form-label">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-select"
              required
              disabled={fetchingCategories}
            >
              <option value="">
                {fetchingCategories ? "Loading categories..." : "Select a category"}
              </option>
              {categories.map(category => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.categoryTitle}
                </option>
              ))}
            </select>
            {fetchingCategories && <div className="spinner-border spinner-border-sm text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>}
          </div> */}
          
          <div className="mb-3">
            <label htmlFor="addedDate" className="form-label">Date</label>
            <input
              type="date"
              id="addedDate"
              name="addedDate"
              value={formData.addedDate}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="image-upload" className="form-label">Featured Image</label>
            <input
              type="file"
              id="image-upload"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="form-control"
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="content" className="form-label">Content</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="10"
              className="form-control"
              placeholder="Write your blog content here..."
              required
            ></textarea>
          </div>
          
          <button
            type="submit"
            className="btn btn-primary w-100 mt-3"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Blog Post'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BlogForm;
