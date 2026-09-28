export const renderError = (error: unknown): { message: string } => {
  return {
    message: error instanceof Error ? error.message : "Unknown Error",
  };
};

// ── Barrel re-exports (backward compatibility) ──────────────────────────────
export { getAuthUser, getAdminUser } from "./user";

export {
  fetchCartItems,
  fetchOrCreateCart,
  updateCart,
  addToCartAction,
  removeCartItemAction,
  updateCartItemAction,
} from "./cart";

export { fetchFavoritID, toggleFavAction, fetchUserFav } from "./Favorites";

export {
  createOrderAction,
  payOrderAction,
  fetchUserOrders,
  fetchAdminOrders,
} from "./orders";

export {
  fetchFeaturedProducts,
  fetchAllProducts,
  fetchSingleProduct,
  createProductAction,
  deleteProductAction,
  updateProductAction,
  updateProductImageAction,
  fetchAdminPosts,
} from "./products";

export {
  creatReviewAction,
  fetchProductReview,
  fetchAllReviews,
} from "./reviews";
