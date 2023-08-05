import { useState } from "react";
import "./students.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiUrl } from "../../axios";

export default function Student() {
  const [open, setOpen] = useState(false);

  const [inputs, setInputs] = useState({
    username: "",
    password: "",
    reg_no: "",
    department: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const [sucess, setSucess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
  };

  const { error, isLoading, data } = useQuery(
    ["students", submittedQuery],
    async () => {
      const res = await apiUrl.get(`/student?student=${submittedQuery}`);
      return res.data;
    }
  );

  const handleInput = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    setSubmittedQuery(searchQuery);
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newStudent) => {
      return apiUrl.post("/auth/register", newStudent);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });

      setSucess(true);
      setOpen(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (
        inputs.username.trim() === "" ||
        inputs.password.trim() === "" ||
        inputs.department.trim() === "" ||
        inputs.reg_no.trim() === ""
      ) {
        alert("Please complete the form.");
        return;
      } else {
        mutation.mutate(inputs);
      }
    } catch (error) {
      if (error) {
        alert("Someting went wrong try filling in the details again");
      }
    }
  };

  const mutationDelete = useMutation({
    mutationFn: (id) => {
      return apiUrl.delete(`/student/${id}`);
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: () => {},
  });

  const deleteUser = async (id) => {
    mutationDelete.mutate(id);
  };

  return (
    <>
      <div className="student">
        <div className="top">
          <div className="name">
            <h1>Students</h1>
            <button onClick={() => setOpen(!open)}>Add Student ➕</button>
          </div>
          <div className="search">
            <input
              type="search"
              onChange={handleInput}
              placeholder="Search for students"
            />
            <p onClick={handleSearch}>🔬</p>
          </div>
        </div>
        <div className="list">
          <div className="thead">
            <tr className="thead">
              <th className="th">Username</th>
              <th className="th">Reg_no</th>
              <th className="th">Department</th>
              <th className="th">Edit</th>
            </tr>
          </div>
          <div className="tbody">
            {isLoading
              ? "Loading"
              : error
              ? "error"
              : data.map((student) => (
                  <tr className="tr" key={student._id}>
                    <td className="td">{student.username}</td>
                    <td className="td">{student.reg_no}</td>
                    <td className="td">{student.department}</td>
                    <td className="td">
                      <div className="buttons">
                        <p>✏️</p>
                        <p onClick={() => deleteUser(student._id)}>❌</p>
                      </div>
                    </td>
                  </tr>
                ))}
          </div>
        </div>
      </div>
      {open && (
        <div className="addStudent">
          <div className="contanier">
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              onChange={handleChange}
            />
            <input
              type="text"
              onChange={handleChange}
              name="reg_no"
              id="reg_no"
              placeholder="Reg no"
            />
            <input
              type="text"
              name="department"
              id="department"
              placeholder="Department"
              onChange={handleChange}
            />
            <input
              type="text"
              name="password"
              id="password"
              placeholder="Password"
              onChange={handleChange}
            />
            <button onClick={handleSubmit}>Add</button>
            <p onClick={() => setOpen(!open)}>❌</p>
          </div>
        </div>
      )}
    </>
  );
}
