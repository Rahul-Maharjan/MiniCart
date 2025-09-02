import { createContext, useContext, useReducer, useMemo } from "react";

const CartContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const { product } = action;
      const existing = state.items.find((i) => i.product._id === product._id);
      let items;
      if (existing) {
        items = state.items.map((i) =>
          i.product._id === product._id ? { ...i, qty: i.qty + 1 } : i
        );
      } else {
        items = [...state.items, { product, qty: 1 }];
      }
      return { ...state, items };
    }
    case "REMOVE": {
      return {
        ...state,
        items: state.items.filter((i) => i.product._id !== action.id),
      };
    }
    case "QTY": {
      return {
        ...state,
        items: state.items.map((i) =>
          i.product._id === action.id
            ? { ...i, qty: Math.max(1, action.qty) }
            : i
        ),
      };
    }
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });
  const totals = useMemo(() => {
    const itemsTotal = state.items.reduce(
      (sum, i) => sum + i.product.price * i.qty,
      0
    );
    return { itemsTotal };
  }, [state.items]);
  const value = useMemo(
    () => ({
      ...state,
      add: (p) => dispatch({ type: "ADD", product: p }),
      remove: (id) => dispatch({ type: "REMOVE", id }),
      setQty: (id, qty) => dispatch({ type: "QTY", id, qty }),
      clear: () => dispatch({ type: "CLEAR" }),
      totals,
    }),
    [state, totals]
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
