import { createContext, useContext, useReducer, useEffect } from "react";

const WishlistContext = createContext();

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_WISHLIST":
      if (state.items.find(item => item._id === action.product._id)) {
        return state;
      }
      return {
        ...state,
        items: [...state.items, action.product]
      };
    case "REMOVE_FROM_WISHLIST":
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.productId)
      };
    case "CLEAR_WISHLIST":
      return {
        ...state,
        items: []
      };
    default:
      return state;
  }
};

export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, {
    items: JSON.parse(localStorage.getItem("wishlist") || "[]")
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(state.items));
  }, [state.items]);

  const addToWishlist = (product) => {
    dispatch({ type: "ADD_TO_WISHLIST", product });
  };

  const removeFromWishlist = (productId) => {
    dispatch({ type: "REMOVE_FROM_WISHLIST", productId });
  };

  const isInWishlist = (productId) => {
    return state.items.some(item => item._id === productId);
  };

  const clearWishlist = () => {
    dispatch({ type: "CLEAR_WISHLIST" });
  };

  return (
    <WishlistContext.Provider value={{
      items: state.items,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
