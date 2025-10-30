import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import useDebounce from "../../hooks/useDebounce";
import { toast } from "react-toastify";
import { BACKEND_URL } from "../utils/Url";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token } = useAuth();
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    if (!token) {
      setCart([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BACKEND_URL}/person/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.success) {
        // Fetch fresh data for each test to get latest offers
        const cartWithFreshData = await Promise.all(
          res.data.cart.map(async (item) => {
            try {
              // For expert packages, use expert endpoint
              if (item.isExpertPackage) {
                const expertResponse = await axios.get(
                  `${BACKEND_URL}/api/expertServiceLists/${item.testId?._id || item.testId}`,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );
                const freshTestData = expertResponse.data?.data;
                
                return {
                  ...item,
                  subCategoryId: freshTestData,
                  testId: freshTestData,
                  totalAmount: parseFloat(freshTestData?.discountPrice || 0)
                };
              } else {
                // For regular tests, use subcategories endpoint
                const testResponse = await axios.get(
                  `${BACKEND_URL}/api/subcategories/${item.testId?._id || item.testId}`,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );
                
                const freshTestData = testResponse.data?.data;
                
                // Calculate price based on current offer status
                let basePrice;
                let hasActiveOffer = false;
                
                if (freshTestData?.hasOffer && freshTestData?.offerValidUntil) {
                  const offerValidUntil = new Date(freshTestData.offerValidUntil);
                  if (offerValidUntil > new Date()) {
                    basePrice = parseFloat(freshTestData.offerDiscountedPrice || freshTestData.oldPrice);
                    hasActiveOffer = true;
                  } else {
                    basePrice = parseFloat(freshTestData.oldPrice || 0);
                  }
                } else {
                  basePrice = parseFloat(freshTestData?.oldPrice || 0);
                }
                
                const contrastPrice = parseFloat(freshTestData?.contrastPrice || 0);
                const totalAmount = basePrice + contrastPrice;
                
                return {
                  ...item,
                  subCategoryId: freshTestData,
                  testId: freshTestData,
                  basePrice,
                  contrastPrice,
                  totalAmount,
                  hasActiveOffer,
                  offerDiscountPercent: hasActiveOffer ? freshTestData?.offerDiscountPercent : 0
                };
              }
            } catch (error) {
              console.error("Error fetching fresh test data:", error);
              // Return original item if fetch fails, but try to calculate price from existing data
              const test = item.testId;
              let basePrice = parseFloat(test?.oldPrice || 0);
              let hasActiveOffer = false;
              
              if (test?.hasOffer && test?.offerValidUntil) {
                const offerValidUntil = new Date(test.offerValidUntil);
                if (offerValidUntil > new Date()) {
                  basePrice = parseFloat(test.offerDiscountedPrice || test.oldPrice);
                  hasActiveOffer = true;
                }
              }
              
              const contrastPrice = parseFloat(test?.contrastPrice || 0);
              const totalAmount = basePrice + contrastPrice;
              
              return {
                ...item,
                basePrice,
                contrastPrice,
                totalAmount,
                hasActiveOffer,
                offerDiscountPercent: hasActiveOffer ? test?.offerDiscountPercent : 0
              };
            }
          })
        );

        console.log("Cart with fresh offer data:", cartWithFreshData);
        setCart(cartWithFreshData);
      }
    } catch (err) {
      console.error("Failed to fetch cart", err);
      setError(err.response?.data?.error || "Failed to load cart");
      toast.error(err.response?.data?.error || "Failed to load cart");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const debouncedFetchCart = useDebounce(fetchCart, 300);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (testId, testName, isExpertPackage = false) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("🛒 Adding:", { testId, isExpertPackage });

      if (!token) {
        throw new Error("Please login to add items to cart");
      }

      // ✅ Use different endpoints for regular tests vs expert packages
      let testDetails;

      if (isExpertPackage) {
        // Fetch from expert packages endpoint
        const expertResponse = await axios.get(
          `${BACKEND_URL}/api/expertServiceLists/${testId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        testDetails = expertResponse.data?.data;
      } else {
        // Fetch from subcategories endpoint
        const testResponse = await axios.get(
          `${BACKEND_URL}/api/subcategories/${testId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        testDetails = testResponse.data?.data;
      }

      if (!testDetails) {
        throw new Error(
          isExpertPackage ? "Expert package not found" : "Test not found"
        );
      }

      // ✅ Check if test already exists in cart
      const isAlreadyInCart = cart.some(
        (item) =>
          item.subCategoryId?._id === testId ||
          item.testId?._id === testId ||
          item._id === testId
      );

      if (isAlreadyInCart) {
        return { success: false, error: "This item is already in your cart" };
      }

      const response = await axios.post(
        `${BACKEND_URL}/person/cart/add`,
        {
          testId,
          isExpertPackage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      if (!response.data?.success) {
        throw new Error(response.data.error || "Failed to add to cart");
      }

      await fetchCart();

      // Show success message
      toast.success(`${testName} added to cart!`);

      return { success: true };
    } catch (error) {
      let errorMessage = "Failed to add to cart";

      if (error.response) {
        errorMessage =
          error.response.data?.error ||
          `Server error (${error.response.status})`;
      } else if (error.request) {
        errorMessage = "No response from server";
      } else {
        errorMessage = error.message;
      }

      console.error("❌ Cart error:", errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = useCallback(async () => {
    if (!token) return;
    try {
      await axios.delete(`${BACKEND_URL}/person/cart/clear`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart([]);
      console.log("Cart cleared successfully");
    } catch (err) {
      console.error("Clear cart error:", err);
      throw err;
    }
  }, [token]);

  const removeFromCart = async (testId) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/person/cart/remove`,
        { testId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        await debouncedFetchCart();
        toast.success("Item removed from cart");
      } else {
        throw new Error(response.data.error || "Failed to remove item");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || "Failed to remove from cart";
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        fetchCart: debouncedFetchCart,
        addToCart,
        removeFromCart,
        clearCart,
        isLoading,
        error,
        clearError: () => setError(null),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};