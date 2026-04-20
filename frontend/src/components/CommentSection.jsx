import React, { useState, useEffect } from 'react';
import { FiMessageSquare, FiHeart, FiSmile, FiSend } from 'react-icons/fi';
import API from '../api';
import EmojiPicker from 'emoji-picker-react';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

const CommentSection = ({ careerId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [user, setUser] = useState(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const profile = localStorage.getItem('profile');
    if (profile) setUser(JSON.parse(profile));
    fetchComments();
  }, [careerId]);

  const fetchComments = async () => {
    try {
      const { data } = await API.get(`/comments/${careerId}`);
      setComments(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    try {
      await API.post(`/comments/${careerId}`, { text: newComment });
      setNewComment('');
      setShowEmoji(false);
      fetchComments();
      toast.success('Comment posted successfully.');
    } catch (error) {
      console.error(error);
      toast.error('Failed to post comment.');
    }
  };

  const handleLike = async (commentId) => {
    try {
      await API.put(`/comments/${commentId}/like`);
      fetchComments();
    } catch (error) {
      console.error(error);
      toast.error('You must be logged in to like.');
    }
  };

  const onEmojiClick = (emojiObject) => {
    setNewComment(prev => prev + emojiObject.emoji);
  };

  return (
    <div className="w-full font-sans">
      <div className={`flex items-center gap-3 mb-6 pb-4 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <FiMessageSquare className="text-xl" />
        <h3 className="text-xl font-bold tracking-tight">Discussion</h3>
      </div>

      {user ? (
        <form onSubmit={handlePostComment} className="mb-8 relative">
          <div className={`relative flex items-end rounded-xl border transition-all ${isDark ? 'bg-[#0f1115] border-gray-700 focus-within:border-gray-500' : 'bg-gray-50 border-gray-300 focus-within:border-gray-500'}`}>
            <button 
              type="button" 
              onClick={() => setShowEmoji(!showEmoji)}
              className={`p-3 transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`}
            >
              <FiSmile className="text-xl" />
            </button>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add your thoughts or ask a question..."
              className={`flex-1 bg-transparent border-none focus:ring-0 resize-none py-3 px-2 text-sm h-12 ${isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-500'}`}
            />
            <button 
              type="submit" 
              disabled={!newComment.trim()}
              className={`m-1 p-2 rounded-lg transition-colors disabled:opacity-30 ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
            >
              <FiSend size={18} />
            </button>
          </div>
          {showEmoji && (
            <div className={`absolute top-full left-0 mt-2 z-50 rounded-lg overflow-hidden border shadow-lg ${isDark ? 'border-gray-800 shadow-black' : 'border-gray-200 shadow-gray-200'}`}>
              <EmojiPicker onEmojiClick={onEmojiClick} theme={isDark ? "dark" : "light"} />
            </div>
          )}
        </form>
      ) : (
        <div className={`mb-8 p-4 rounded-xl border text-center ${isDark ? 'bg-[#16181d] border-gray-800 text-gray-400' : 'bg-white border-gray-200 text-gray-500'}`}>
          <p className="text-sm">You must log in to participate in the discussion.</p>
        </div>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment._id} className={`p-5 rounded-xl border flex gap-4 ${isDark ? 'bg-[#16181d] border-gray-800' : 'bg-white border-gray-200'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 ${isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
              {comment.user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className={`font-semibold text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                  {comment.user?.name || 'Unknown User'}
                </span>
                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className={`text-sm leading-relaxed mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{comment.text}</p>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handleLike(comment._id)}
                  className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                    comment.likes?.includes(user?._id) 
                      ? (isDark ? 'text-red-400' : 'text-red-500')
                      : (isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600')
                  }`}
                >
                  <FiHeart className={comment.likes?.includes(user?._id) ? "fill-current" : ""} /> 
                  <span>{comment.likes?.length || 0}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <div className={`text-center py-8 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            No comments yet. Be the first to share your thoughts.
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
