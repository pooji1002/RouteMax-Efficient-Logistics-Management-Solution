import React, { useState } from 'react';
import axios from 'axios';
import { FaHeadphones } from 'react-icons/fa';

export default function FeedbackForm({ trackingNumber }) {
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRatingClick = (star) => {
    setRating(star);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('Submitting feedback...');
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('You must be logged in to submit feedback.');
        setIsSubmitting(false);
        return;
      }

      const response = await axios.post(
        `http://localhost:8080/api/feedback/submit`,
        null,
        {
          params: {
            trackingNumber,
            rating,
            comment,
          },
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data || 'Feedback submitted successfully!');
      setSuccess(true);

      setRating(1);
      setComment('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setMessage(error.response?.data || 'Error submitting feedback.');
      setSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="flex justify-center mb-4">
          <FaHeadphones className="text-4xl text-blue-600 p-2 bg-blue-100 rounded-full" />
        </div>

        <h3 className="text-2xl font-bold text-gray-800 mb-1 text-center">We're Here to Help!</h3>
        <p className="text-gray-600 mb-4 text-center">Tell us about your experience below.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="rating-input" className="form-label">Your Rating:</label>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= rating ? 'selected' : ''}`}
                  onClick={() => handleRatingClick(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="comment-textarea" className="form-label">Your Comment:</label>
            <textarea
              id="comment-textarea"
              placeholder="Write your feedback here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
              className="form-textarea"
              required
            ></textarea>
          </div>

          <div className="modal-actions">
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>

          {message && (
            <p className={`message ${success ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}
        </form>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Our support team will get back to you within 24 hours.
        </p>
      </div>

      {/* Inline Styling - you can extract this to a CSS file if preferred */}
      <style>{`
        .modal-overlay {
          min-height: 100vh;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          font-family: sans-serif;
        }
        .modal-content {
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 500px;
        }
        .form-group {
          margin-bottom: 15px;
        }
        .form-label {
          display: block;
          font-size: 16px;
          color: #555;
          margin-bottom: 8px;
          font-weight: bold;
        }
        .rating-stars {
          font-size: 30px;
          color: #ccc;
          margin-bottom: 20px;
          cursor: pointer;
          text-align: center;
        }
        .star {
          margin: 0 2px;
          transition: color 0.2s;
        }
        .star.selected {
          color: #ffc107;
        }
        .form-textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          resize: vertical;
          font-size: 15px;
          box-sizing: border-box;
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 20px;
        }
        .submit-button {
          background-color: #007bff;
          color: white;
          padding: 10px 20px;
          font-size: 16px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .submit-button:hover:not(:disabled) {
          background-color: #0056b3;
        }
        .submit-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        .message {
          margin-top: 15px;
          font-size: 14px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
