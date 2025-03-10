import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaRegHeart, FaComment, FaUser, FaChevronDown, FaChevronUp, FaPaperPlane } from 'react-icons/fa';

const SingleBlog = () => {
  const { id,email } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeInProgress, setLikeInProgress] = useState(false);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [postingComment, setPostingComment] = useState(false);
  const [commentError, setCommentError] = useState(null);
  const [showComments, setShowComments] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      const token = localStorage.getItem("token");

      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:1010/adminuser/api/v1/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBlog(response.data);
        console.log(response.data.ourUser?.name);
        // Check if the post is liked
        // await checkLikeStatus(id);
        
        // Load comments
        await fetchComments(id);
      } catch (err) {
        console.error("Error fetching blog post:", err);
        setError("Failed to load blog post.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

//   const checkLikeStatus = async (postId) => {
//     try {
//       const token = localStorage.getItem("token");
      
//       // Replace with your actual like status endpoint
//       // This is a placeholder - adjust according to your API
//       const response = await axios.get(
//         `http://localhost:1010/adminuser/api/likes/status/${postId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       // Adjust based on your API response structure
//       setLiked(response.data.liked || false);
//     } catch (err) {
//       console.error("Error checking like status:", err);
//       // Default to not liked if there's an error
//       setLiked(false);
//     }
//   };

  const fetchComments = async (postId) => {
    try {
      setLoadingComments(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:1010/adminuser/api/v1/posts/${postId}/comments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setComments(response.data);
    } catch (err) {
      console.error(`Error fetching comments for post ${postId}:`, err);
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleLikeToggle = async () => {
    if (likeInProgress) return;
    
    try {
      setLikeInProgress(true);
      
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:1010/adminuser/api/likes/like/${id}`,
        {}, // Empty body or you can add any required data
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Toggle like status
      setLiked(prevLiked => !prevLiked);
    } catch (err) {
      console.error(`Error toggling like for post ${id}:`, err);
    } finally {
      setLikeInProgress(false);
    }
  };

  const postComment = async () => {
    // Check if comment is empty
    if (!commentText || commentText.trim() === '') {
      setCommentError('Comment cannot be empty');
      return;
    }

    try {
      setPostingComment(true);
      setCommentError(null);
      
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:1010/adminuser/api/v1/posts/${id}/comments`,
        { content: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Clear the comment text
      setCommentText('');
      
      // Refresh comments
      await fetchComments(id);
    } catch (err) {
      console.error(`Error posting comment for post ${id}:`, err);
      setCommentError('Failed to post comment. Please try again.');
    } finally {
      setPostingComment(false);
    }
  };

  const toggleComments = () => {
    setShowComments(prevState => !prevState);
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
          <Link to="/blogs" className="btn btn-outline-primary mt-2">
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="mb-4">
            <Link to="/blogs" className="btn btn-outline-primary">
              &larr; Back to Blogs
            </Link>
          </div>
          
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              {/* Header with user info */}
              <div className="d-flex align-items-center mb-2">
                <div className="bg-light rounded-circle p-2 me-2">
                  <FaUser className="text-secondary" />
                </div>
                <div>
                  <h6 className="mb-0 fw-bold">{email}</h6>
                  <small className="text-muted">@{blog.user?.email?.split('@')[0] || 'user'}</small>
                </div>
                <div className="ms-auto">
                  <small className="text-muted">{formatDate(blog.addedDate)}</small>
                </div>
              </div>
              
              {/* Blog content */}
              <h2 className="card-title mb-3">{blog.title}</h2>
              
              {/* Blog image if available */}
              {blog.imageName && blog.imageName !== "default.png" && (
                <img 
                  src='/defailt.jpg'
                  className="img-fluid rounded mb-4"
                  alt={blog.title}
                />
              )}
              
              <div className="card-text mb-4">
                {/* Render each paragraph properly */}
                {blog.content.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              
              {/* Action buttons */}
              <div className="d-flex justify-content-between mt-4 border-top pt-3">
                <button 
                  className="btn btn-sm btn-link text-decoration-none text-muted"
                  onClick={handleLikeToggle}
                  disabled={likeInProgress}
                >
                  {likeInProgress ? (
                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                  ) : liked ? (
                    <><FaHeart className="text-danger" /> <span className="ms-1">Liked</span></>
                  ) : (
                    <><FaRegHeart /> <span className="ms-1">Like</span></>
                  )}
                </button>
                
                <button 
                  className="btn btn-sm btn-link text-decoration-none text-muted"
                  onClick={toggleComments}
                >
                  <FaComment /> 
                  <span className="ms-1">
                    Comments 
                    {showComments ? <FaChevronUp className="ms-1" /> : <FaChevronDown className="ms-1" />}
                  </span>
                </button>
                
                {/* <div className="btn btn-sm btn-link text-decoration-none text-muted">
                  
                  Share
                </div> */}
              </div>
              
              {/* Comments section */}
              {showComments && (
                <div className="mt-3 pt-3 border-top">
                  <h5 className="mb-3">Comments</h5>
                  
                  {loadingComments ? (
                    <div className="text-center py-2">
                      <div className="spinner-border spinner-border-sm text-primary" role="status">
                        <span className="visually-hidden">Loading comments...</span>
                      </div>
                    </div>
                  ) : comments.length > 0 ? (
                    <div className="mb-4">
                      {comments.map(comment => (
                        <div key={comment.id} className="mb-3 pb-2 border-bottom">
                          <div className="d-flex align-items-center mb-1">
                            <div className="bg-light rounded-circle p-1 me-2">
                              <FaUser className="text-secondary" size={12} />
                            </div>
                            <small className="fw-bold">{comment.commentedBy?.email || 'Anonymous'}</small>
                            <small className="text-muted ms-2">
                              {comment.timestamp ? formatDate(comment.timestamp) : 'Just now'}
                            </small>
                          </div>
                          <p className="mb-1 ms-4 small">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted mb-4">No comments yet. Be the first to comment!</p>
                  )}
                  
                  {/* Comment form */}
                  <div className="mt-3">
                    <div className="input-group">
                      <input 
                        type="text" 
                        className={`form-control ${commentError ? 'is-invalid' : ''}`}
                        placeholder="Write a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        disabled={postingComment}
                      />
                      <button 
                        className="btn btn-primary" 
                        onClick={postComment}
                        disabled={postingComment}
                      >
                        {postingComment ? (
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                          <FaPaperPlane />
                        )}
                      </button>
                    </div>
                    {commentError && (
                      <div className="invalid-feedback d-block">
                        {commentError}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBlog;
