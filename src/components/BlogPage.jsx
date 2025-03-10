import React, { useState, useEffect } from 'react';
import UserService from '../components/service/UserService';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaComment, FaUser, FaChevronDown, FaChevronUp, FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [likedPosts, setLikedPosts] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [comments, setComments] = useState({});
  const [loadingComments, setLoadingComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [postingComment, setPostingComment] = useState({});
  const [commentErrors, setCommentErrors] = useState({});
  const [likeInProgress, setLikeInProgress] = useState({});

  

  useEffect(() => {
    // Initialize liked posts status
    const initLikedPostsStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        // You might want to create an API endpoint to get all liked posts for the current user
        // For now, we'll just use local state
      } catch (err) {
        console.error("Error fetching liked posts status:", err);
      }
    };

    initLikedPostsStatus();
  }, []);

  const fetchBlogs = async (page = 0) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await UserService.getAllBlog(token);
      
      setBlogs(response.content);
      console.log(response.content);
      setTotalPages(response.totalPages);
      setCurrentPage(page);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("Failed to load blogs. Please try again later.");
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBlogs();
  }, [currentPage]);
  const fetchComments = async (postId) => {
    try {
      setLoadingComments(prev => ({ ...prev, [postId]: true }));
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:1010/adminuser/api/v1/posts/${postId}/comments`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setComments(prev => ({ ...prev, [postId]: response.data }));
      setLoadingComments(prev => ({ ...prev, [postId]: false }));
    } catch (err) {
      console.error(`Error fetching comments for post ${postId}:`, err);
      setLoadingComments(prev => ({ ...prev, [postId]: false }));
      setComments(prev => ({ ...prev, [postId]: [] }));
    }
  };

  const postComment = async (postId) => {
    // Check if comment is empty
    if (!commentText[postId] || commentText[postId].trim() === '') {
      setCommentErrors(prev => ({ ...prev, [postId]: 'Comment cannot be empty' }));
      return;
    }

    try {
      setPostingComment(prev => ({ ...prev, [postId]: true }));
      setCommentErrors(prev => ({ ...prev, [postId]: null }));
      
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:1010/adminuser/api/v1/posts/${postId}/comments`,
        { content: commentText[postId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Clear the comment text
      setCommentText(prev => ({ ...prev, [postId]: '' }));
      
      // Fetch updated comments
      fetchComments(postId);
      setPostingComment(prev => ({ ...prev, [postId]: false }));
    } catch (err) {
      console.error(`Error posting comment for post ${postId}:`, err);
      setPostingComment(prev => ({ ...prev, [postId]: false }));
      setCommentErrors(prev => ({ 
        ...prev, 
        [postId]: 'Failed to post comment. Please try again.' 
      }));
    }
  };

  const toggleComments = (postId) => {
    const newExpandedState = !expandedComments[postId];
    setExpandedComments(prev => ({ ...prev, [postId]: newExpandedState }));
    
    // Fetch comments if expanding and we don't have them yet
    if (newExpandedState && !comments[postId]) {
      fetchComments(postId);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
      // Scroll to top when page changes
      window.scrollTo(0, 0);
    }
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const handleLikeToggle = async (postId) => {
    // Prevent multiple clicks
    if (likeInProgress[postId]) return;
    
    try {
      setLikeInProgress(prev => ({ ...prev, [postId]: true }));
      
      const token = localStorage.getItem('token');
      // Call the API to like/unlike the post
      await axios.post(
        `http://localhost:1010/adminuser/api/likes/like/${postId}`,
        {}, // Empty body or you can add any required data
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update the local state
      setLikedPosts(prev => ({
        ...prev,
        [postId]: !prev[postId]
      }));
      
      // Update like count in blogs if you have a likes count
      // This depends on your API response. If it returns updated post data, you 
      // might want to update the blog post in the state
      
      setLikeInProgress(prev => ({ ...prev, [postId]: false }));
    } catch (err) {
      console.error(`Error toggling like for post ${postId}:`, err);
      setLikeInProgress(prev => ({ ...prev, [postId]: false }));
      // Optionally show an error message
    }
  };

  const handleCommentChange = (postId, text) => {
    setCommentText(prev => ({ ...prev, [postId]: text }));
    // Clear any previous errors when user starts typing
    if (commentErrors[postId]) {
      setCommentErrors(prev => ({ ...prev, [postId]: null }));
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <div className="alert alert-danger" role="alert">
          <p>{error}</p>
          <button 
            onClick={fetchBlogs}
            className="btn btn-outline-danger mt-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">What's happening</h1>
      
      {blogs.length === 0 ? (
        <div className="text-center py-5">
          <p className="fs-4 text-muted">No blog posts found.</p>
        </div>
      ) : (
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            {blogs.map((blog) => (
              <div key={blog.postId} className="card mb-3 border-0 shadow-sm">
                <div className="card-body">
                  {/* Header with user info */}
                  <div className="d-flex align-items-center mb-2">
                    <div className="bg-light rounded-circle p-2 me-2">
                      <FaUser className="text-secondary" />
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold">{blog.user.name || blog.user.email.split('@')[0]}</h6>
                      <small className="text-muted">@{blog.user.email.split('@')[0]}</small>
                    </div>
                    <div className="ms-auto">
                      <small className="text-muted">{formatDate(blog.addedDate)}</small>
                    </div>
                  </div>
                  
                  {/* Blog content */}
                  <h5 className="card-title">{blog.title}</h5>
                  <p className="card-text">{truncateContent(blog.content)}</p>
                  
                  {/* Blog image if available */}
                  {blog.imageName && blog.imageName !== "default.png" && (
                    <img 
                      src={`/blog-images/${blog.imageName}`}
                      className="img-fluid rounded mb-3"
                      alt={blog.title}
                    />
                  )}
                  
                  {/* Action buttons */}
                  <div className="d-flex justify-content-between mt-3">
                    <button 
                      className="btn btn-sm btn-link text-decoration-none text-muted"
                      onClick={() => handleLikeToggle(blog.postId)}
                      disabled={likeInProgress[blog.postId]}
                    >
                      {likeInProgress[blog.postId] ? (
                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                      ) : likedPosts[blog.postId] ? (
                        <><FaHeart className="text-danger" /> <span className="ms-1">Liked</span></>
                      ) : (
                        <><FaRegHeart /> <span className="ms-1">Like</span></>
                      )}
                    </button>
                    
                    <button 
                      className="btn btn-sm btn-link text-decoration-none text-muted"
                      onClick={() => toggleComments(blog.postId)}
                    >
                      <FaComment /> 
                      <span className="ms-1">
                        Comments 
                        {expandedComments[blog.postId] ? <FaChevronUp className="ms-1" /> : <FaChevronDown className="ms-1" />}
                      </span>
                    </button>
                    
                    <Link 
                      to={`/blog/${blog.postId}/${blog.user.email}`}
                      className="btn btn-sm btn-link text-decoration-none text-primary"
                    >
                      Read more
                    </Link>
                  </div>
                  
                  {/* Comments section */}
                  {expandedComments[blog.postId] && (
                    <div className="mt-3 pt-3 border-top">
                      <h6 className="mb-3">Comments</h6>
                      
                      {loadingComments[blog.postId] ? (
                        <div className="text-center py-2">
                          <div className="spinner-border spinner-border-sm text-primary" role="status">
                            <span className="visually-hidden">Loading comments...</span>
                          </div>
                        </div>
                      ) : comments[blog.postId]?.length > 0 ? (
                        <>
                          {comments[blog.postId].map(comment => (
                            <div key={comment.id} className="mb-3 pb-2 border-bottom">
                              <div className="d-flex align-items-center mb-1">
                                <div className="bg-light rounded-circle p-1 me-2">
                                  <FaUser className="text-secondary" size={12} />
                                </div>
                                <small className="fw-bold">{comment.commentedBy.email || 'Anonymous'}</small>
                                <small className="text-muted ms-2">
                                  {comment.timestamp ? formatDate(comment.timestamp) : 'Just now'}
                                </small>
                              </div>
                              <p className="mb-1 ms-4 small">{comment.content}</p>
                            </div>
                          ))}
                        </>
                      ) : (
                        <p className="text-muted">No comments yet. Be the first to comment!</p>
                      )}
                      
                      {/* Comment form */}
                      <div className="mt-3">
                        <div className="input-group">
                          <input 
                            type="text" 
                            className={`form-control ${commentErrors[blog.postId] ? 'is-invalid' : ''}`}
                            placeholder="Write a comment..."
                            value={commentText[blog.postId] || ''}
                            onChange={(e) => handleCommentChange(blog.postId, e.target.value)}
                            disabled={postingComment[blog.postId]}
                          />
                          <button 
                            className="btn btn-primary" 
                            onClick={() => postComment(blog.postId)}
                            disabled={postingComment[blog.postId]}
                          >
                            {postingComment[blog.postId] ? (
                              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            ) : (
                              <FaPaperPlane />
                            )}
                          </button>
                        </div>
                        {commentErrors[blog.postId] && (
                          <div className="invalid-feedback d-block">
                            {commentErrors[blog.postId]}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
  <nav aria-label="Blog pagination" className="mt-4">
    <ul className="pagination justify-content-center">
      {/* First Page Button */}
      <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
        <button 
          className="page-link" 
          onClick={() => handlePageChange(0)}
          disabled={currentPage === 0}
          aria-label="First page"
        >
          &laquo;
        </button>
      </li>
      
      {/* Previous Button */}
      <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
        <button 
          className="page-link" 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
          aria-label="Previous page"
        >
          &lsaquo;
        </button>
      </li>
      
      {/* Dynamic Page Numbers */}
      {(() => {
        let pages = [];
        const maxVisiblePages = 5; // Show max 5 page numbers
        let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
        
        // Adjust start page if we're near the end
        if (endPage - startPage + 1 < maxVisiblePages) {
          startPage = Math.max(0, endPage - maxVisiblePages + 1);
        }
        
        // Add ellipsis at start if needed
        if (startPage > 0) {
          pages.push(
            <li key="start-ellipsis" className="page-item disabled">
              <span className="page-link">...</span>
            </li>
          );
        }
        
        // Add page numbers
        for (let i = startPage; i <= endPage; i++) {
          pages.push(
            <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(i)}>
                {i + 1}
              </button>
            </li>
          );
        }
        
        // Add ellipsis at end if needed
        if (endPage < totalPages - 1) {
          pages.push(
            <li key="end-ellipsis" className="page-item disabled">
              <span className="page-link">...</span>
            </li>
          );
        }
        
        return pages;
      })()}
      
      {/* Next Button */}
      <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
        <button 
          className="page-link" 
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          aria-label="Next page"
        >
          &rsaquo;
        </button>
      </li>
      
      {/* Last Page Button */}
      <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
        <button 
          className="page-link" 
          onClick={() => handlePageChange(totalPages - 1)}
          disabled={currentPage === totalPages - 1}
          aria-label="Last page"
        >
          &raquo;
        </button>
      </li>
    </ul>
    
    {/* Page info */}
    <div className="text-center mt-2">
      <small className="text-muted">
        Page {currentPage + 1} of {totalPages}
      </small>
    </div>
  </nav>
)}
    </div>
  );
};

export default BlogPage;