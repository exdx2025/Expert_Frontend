import React, { useState, useEffect, useRef } from "react";
import "./Category.css";
import * as XLSX from "xlsx";
import { BACKEND_URL } from "../utils/Url";

const Category = () => {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [testNo, setTestNo] = useState("");
  const [categories, setCategories] = useState([
    "Lab Tests",
    "Radiology Tests",
    "Special Tests",
    "Expert care Package",
  ]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/categories`);
      const data = await response.json();
      if (response.ok) {
        setCategoriesList(data.data);
      } else {
        setError("Failed to fetch categories");
      }
    } catch (err) {
      setError("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage({ file, preview: imageUrl });
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim() !== "" && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !category || !testNo) {
      alert("Please fill all fields before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("testNo", testNo);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    if (image?.file) {
      formData.append("image", image.file);
    }

    try {
      const url =
        editIndex !== null
          ? `${BACKEND_URL}/api/categories/${categoriesList[editIndex]._id}`
          : `${BACKEND_URL}/api/categories`;

      const method = editIndex !== null ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        alert(
          editIndex !== null
            ? "Category updated successfully!"
            : "Category created successfully!"
        );
        fetchCategories();
        resetForm();
      } else {
        alert(data.error || "Failed to submit category");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit category");
    }
  };

  const handleEdit = (index) => {
    const selectedRow = categoriesList[index];
    setTestNo(selectedRow.testNo);
    setTitle(selectedRow.title);
    setDescription(selectedRow.description);
    setCategory(selectedRow.category);
    setImage({
      preview: selectedRow.image
        ? `${BACKEND_URL}/uploads/${selectedRow.image}`
        : null,
    });
    setEditIndex(index);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleDelete = async (index) => {
    const categoryId = categoriesList[index]._id;
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/categories/${categoryId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("Category deleted successfully!");
        fetchCategories();
      } else {
        alert("Failed to delete category");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete category");
    }
  };

  const resetForm = () => {
    setImage(null);
    setTitle("");
    setDescription("");
    setCategory("");
    setNewCategory("");
    setTestNo("");
    setEditIndex(null);
  };

  const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredCategories = categoriesList.filter((item) => {
    const search = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search) ||
      item.testNo.toLowerCase().includes(search)
    );
  });

  const handleExportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(categoriesList);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Categories");
    XLSX.writeFile(wb, "categories.xlsx");
  };

  return (
    <div className="ServiceList-main1">
      <div className="service-list-box1" ref={formRef}>
        <h1 className="service-titles">Category List Form</h1>

        <div className="service-input-box1">
          <div className="service-input-row">
            <div className="service-input-group">
              <label>Test No:</label>
              <input
                name="testNo"
                className="service-input-section"
                type="text"
                value={testNo}
                onChange={(e) => setTestNo(e.target.value)}
                placeholder="Enter Test No"
              />
            </div>
          </div>

          <div className="service-input-row ">
            <div className="service-input-group">
              <label>Category:</label>
              <select
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Category</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="service-input-group">
              <label>Add Category:</label>
              <input
                name="addcategory"
                className="service-input-section"
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter new category"
              />
            </div>
            <div className="service-input-group">
              <label>Add Button:</label>
              <button className="add-button" onClick={handleAddCategory}>
                + Add
              </button>
            </div>
          </div>

          <div className="service-input-row ">
            <div className="service-input-group">
              <label>Upload Image:</label>
              <input
                name="uploadimage"
                className="service-input-section"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <div className="service-input-group">
              <label>Test Name:</label>
              <input
                name="title"
                className="service-input-section"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter Test Name:"
              />
            </div>
          </div>

          <div className="service-input-row">
            <div className="service-input-group">
              <label>Description:</label>
              <textarea
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
              ></textarea>
            </div>
          </div>

          <div className="submit-container">
            <button className="submit-button" onClick={handleSubmit}>
              {editIndex !== null ? "Update" : "Submit"}
            </button>
          </div>
        </div>
      </div>

      <div className="ServiceList-box2">
        <div className="ServiceList-fetch-container">
          <div className="ServiceList-fetch-title">Categories List</div>

          <div className="ServiceList-search-container">
            <input
              type="text"
              placeholder="Search by Name, Category, or Test No"
              value={searchQuery}
              onChange={handleSearchQueryChange}
              className="search-input"
            />

            <button className="excel-button" onClick={handleExportToExcel}>
              Export to Excel
            </button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <div className="ServiceList-table-container">
              <table className="ServiceList-fetch-table">
                <thead>
                  <tr>
                    <th>Test No</th>
                    <th>Image</th>
                    <th>Category</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((item, index) => (
                    <tr key={index}>
                      <td>{item.testNo}</td>
                      <td>
                        {item.image ? (
                          <img
                            src={`${BACKEND_URL}/uploads/${item.image}`}
                            alt="Uploaded Preview"
                            className="category-image"
                          />
                        ) : (
                          "No image"
                        )}
                      </td>
                      <td>{item.category}</td>
                      <td>{item.title}</td>
                      <td>{item.description}</td>
                      <td>
                        <div className="actions-container">
                          <button
                            className="edit-button"
                            onClick={() => handleEdit(index)}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-button"
                            onClick={() => handleDelete(index)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Category;
