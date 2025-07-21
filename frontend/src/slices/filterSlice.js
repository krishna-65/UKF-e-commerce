// src/slices/filterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categories: [],
  gender: [],
  material: [],
  color: [],
  size: [],
  priceRanges: []
};

export const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    updateFilter: (state, action) => {
      const { type, value, checked } = action.payload;
      
      if (type === "priceRange") {
        // For price range, we need to handle adding/removing ranges
        if (checked) {
          // Add new price range if it doesn't exist
          const exists = state.priceRanges.some(
            range => range.min === value.min && range.max === value.max
          );
          if (!exists) {
            state.priceRanges.push(value);
          }
        } else {
          // Remove the price range
          state.priceRanges = state.priceRanges.filter(
            range => !(range.min === value.min && range.max === value.max)
          );
        }
      } else {
        // Handle other filters
        if (checked) {
          state[type].push(value);
        } else {
          state[type] = state[type].filter(item => item !== value);
        }
      }
    },
    clearFilters: () => {
      return initialState;
    }
  }
});

export const { updateFilter, clearFilters } = filterSlice.actions;
export default filterSlice.reducer;
