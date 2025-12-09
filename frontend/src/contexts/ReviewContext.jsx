import React, {
  createContext,
  useContext,
  useState,
} from "react";

/**
 * @typedef {Object} Review
 * @property {string} id
 * @property {string} productId
 * @property{string} userId
 * @property{string} userName
 * @property {string} orderId
 * @property {number} rating
 * @property {string} comment
 * @property {string[]=} images
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} ReviewContextType
 * @property {Review[]} reviews
 * @property {(review: Omit<Review, 'id' | 'createdAt'>) => void} addReview
 * @property {(productId: string) => Review[]} getReviewsByProductId
 * @property {(userId: string) => Review[]} getReviewsByUserId
 * @property {(userId: string, productId: string, orderId: string) => boolean} canReview
 */

/** @type {React.Context<ReviewContextType | undefined>} */
const ReviewContext = createContext(undefined);

export function ReviewProvider({ children }) {
  /** @type {[Review[], Function]} */
  const [reviews, setReviews] = useState([]);

  /**
   * @param {Omit<Review, 'id' | 'createdAt'>} review
   */
  const addReview = (review) => {
    const newReview = {
      ...review,
      id: `review-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      createdAt: new Date(),
    };
    setReviews((prev) => [newReview, ...prev]);
  };

  /**
   * @param {string} productId
   * @returns {Review[]}
   */
  const getReviewsByProductId = (productId) => {
    return reviews.filter(
      (review) => review.productId === productId
    );
  };

  /**
   * @param {string} userId
   * @returns {Review[]}
   */
  const getReviewsByUserId = (userId) => {
    return reviews.filter(
      (review) => review.userId === userId
    );
  };

  /**
   * @param {string} userId
   * @param {string} productId
   * @param {string} orderId
   * @returns {boolean}
   */
  const canReview = (
    userId,
    productId,
    orderId
  ) => {
    return !reviews.some(
      (review) =>
        review.userId === userId &&
        review.productId === productId &&
        review.orderId === orderId
    );
  };

  return (
    <ReviewContext.Provider
      value={{
        reviews,
        addReview,
        getReviewsByProductId,
        getReviewsByUserId,
        canReview,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error(
      "useReviews must be used within a ReviewProvider"
    );
  }
  return context;
}
