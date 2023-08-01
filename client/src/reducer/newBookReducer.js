export const INITIAL_STATE = {
  title: "",
  subtitle: "",
  publisher: "",
  publishedDate: "",
  pageCount: 0,
  authors: [],
  categories: [],
  img: "",
  pdf: "",
  description:""
};

// Define ADD_IMAGES as a string constant
const ADD_IMAGES = "ADD_IMAGES";

export const newBookReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_INPUT":
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    case ADD_IMAGES: // Use the defined constant here
      return {
        ...state,
        img: action.payload.img,
      };
    case "ADD_PDF":
      return {
        ...state,
        pdf: action.payload.pdf,
      };
    case "ADD_CATEGORIES":
      return {
        ...state,
        categories: [...state.categories, action.payload],
      };
    case "REMOVE_CATEGORIES":
      return {
        ...state,
        categories: state.categories.filter(
          (category) => category !== action.payload
        ),
      };
    case "ADD_AUTHOR":
      return {
        ...state,
        authors: [...state.authors, action.payload],
      };
    case "REMOVE_AUTHOR":
      return {
        ...state,
        authors: state.authors.filter((author) => author !== action.payload),
      };
    default:
      return state;
  }
};
