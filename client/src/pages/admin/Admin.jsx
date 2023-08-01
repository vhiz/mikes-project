import { useReducer, useState } from "react";
import "./add.scss";
import { INITIAL_STATE, newBookReducer } from "../../reducer/newBookReducer";
import { uploadFile } from "../../upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiUrl } from "../../axios";
import { Link, useNavigate } from "react-router-dom";

export default function Admin() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [message, setMessage] = useState(false);
  const [messageL, setMessageL] = useState(false);
  const [imgMsg, setimgMsg] = useState(false);
  const [imgMsgL, setimgMsgL] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      setimgMsgL(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
      const img = await uploadFile(file);
      dispatch({ type: "ADD_IMAGES", payload: { img } });
      setimgMsgL(false);
      setimgMsg(true);
    }
  };

  const [state, dispatch] = useReducer(newBookReducer, INITIAL_STATE);
  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };
  const handleCat = (e) => {
    e.preventDefault();
    dispatch({
      type: "ADD_CATEGORIES",
      payload: e.target[0].value,
    });
    e.target[0].value = "";
  };
  const handleAut = (e) => {
    e.preventDefault();
    dispatch({
      type: "ADD_AUTHOR",
      payload: e.target[0].value,
    });
    e.target[0].value = "";
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setMessageL(true);
      const pdf = await uploadFile(file);
      dispatch({ type: "ADD_PDF", payload: { pdf } });
      setMessageL(false);
      setMessage(true);
    }
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newBook) => {
      return apiUrl.post("/book", newBook);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });

      navigate("/");
    },
    onError: () => {
      // setError(true);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    mutation.mutate(state);
  };

  return (
    <div className="admin">
      <div className="contanier">
        <div className="left">
          <h1>Add A Book</h1>
          <input
            type="text"
            placeholder="Title"
            name="title"
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Subtitle"
            name="subtitle"
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Publisher"
            name="publisher"
            onChange={handleChange}
          />
          <form onSubmit={handleAut}>
            <input type="text" placeholder="Authors" />
            <button type="submit">Add</button>
          </form>
          <div className="addedItem">
            {state?.authors?.map((author) => (
              <div className="item" key={author}>
                <button
                  onClick={() =>
                    dispatch({ type: "REMOVE_AUTHOR", payload: author })
                  }
                >
                  {author}
                  <span>X</span>
                </button>
              </div>
            ))}
          </div>
          <input
            type="text"
            placeholder="Published Date"
            name="publishedDate"
            onChange={handleChange}
          />
          <input
            type="number"
            placeholder="Page Count"
            min={1}
            name="pageCount"
            onChange={handleChange}
          />
          <form onSubmit={handleCat}>
            <input type="text" placeholder="Add Categories" />
            <button type="submit">ADD</button>
          </form>
          <div className="addedItem">
            {state?.categories?.map((category) => (
              <div className="item" key={category}>
                <button
                  onClick={() =>
                    dispatch({ type: "REMOVE_CATEGORIES", payload: category })
                  }
                >
                  {category}
                  <span>X</span>
                </button>
              </div>
            ))}
          </div>
          <textarea
            name="description"
            id=""
            cols="30"
            rows="10"
            placeholder="Description"
            onChange={handleChange}
          />

          <button onClick={handleSubmit}>Add Book</button>
        </div>
        <div className="right">
          <input
            type="file"
            id="add"
            accept="image/*"
            onChange={handleImageChange}
          />
          <label htmlFor="add">
            <img src="/upload.png" alt="" />
          </label>
          {selectedImage && (
            <div className="preview">
              <img src={selectedImage} alt="Preview" />
              <p onClick={() => setSelectedImage(null)}>x</p>
            </div>
          )}
          {imgMsgL ? "Uploading..." : imgMsg ? <p>image uploaded ✅</p> : null}
          <label htmlFor="pdf">
            <img src="/file.png" alt="" />
          </label>
          <input
            type="file"
            accept=".pdf"
            id="pdf"
            onChange={handleFileChange}
          />
          {messageL ? "Uploading..." : message ? <p>File uploaded ✅</p> : null}
        </div>
      </div>
      <div className="sucess">
        <div className="sucessDetails">
          <div className="logo">✔️</div>
          <span>Book Added Sucessfully </span>
          <Link to={"/"}>Redirect to home </Link>
        </div>
      </div>
    </div>
  );
}
