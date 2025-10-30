import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import "./SubCategory.css";
import { BACKEND_URL } from "../utils/Url";

const SubCategory = () => {
  const [image, setImage] = useState(null);
  const [expertSerialTestNo, setExpertSerialTestNo] = useState("");
  const [testNo, setTestNo] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [contrastPrice, setContrastPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [homeCollection, setHomeCollection] = useState("");
  const [categories, setCategories] = useState([
    "Lab Tests",
    "Radiology Tests",
    "Special Tests",
    "Expert care Package",
  ]);
  const [subcategories, setSubCategories] = useState([
    "MRI",
    "Ultrasonography",
    "CT-Scan",
    "X-Ray",
    "ECG",
    "ECHO",
    "TMT",
    "EEG",
    "ENMG",
    "MRI-Mammography",
    "Mammography",
    "Bone Density Test",
    "Pulmonary Function Test",
  ]);
  const [subCategoriesList, setSubCategoriesList] = useState([]);
  const [noResult, setNoResult] = useState(false);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/subcategories`);
        const data = await response.json();
        if (response.ok) {
          setSubCategoriesList(data.data);
          setFilteredSubCategories(data.data);
        } else {
          setError(data.error || "Failed to fetch subcategories");
        }
      } catch (err) {
        setError("Failed to fetch subcategories");
      }
    };
    fetchSubCategories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage({ file, preview: imageUrl });
    }
  };

  useEffect(() => {
    const savedSubCategories = JSON.parse(localStorage.getItem("subcategories"));
    if (savedSubCategories) {
      setSubCategories(savedSubCategories);
    }
  }, []);

  const handleAddCategory = () => {
    if (newCategory.trim() !== "" && !subcategories.includes(newCategory)) {
      const updatedSubCategories = [...subcategories, newCategory];
      setSubCategories(updatedSubCategories);
      localStorage.setItem("subcategories", JSON.stringify(updatedSubCategories));
      setNewCategory("");
    } else {
      alert("Subcategory already exists or is empty!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (
      !expertSerialTestNo ||
      !testNo ||
      !title ||
      !description ||
      !category ||
      !subCategory ||
      !oldPrice ||
      !discountedPrice ||
      !contrastPrice ||
      !homeCollection
    ) {
      alert("Please fill all fields before submitting.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("expertSerialTestNo", expertSerialTestNo);
    formData.append("testNo", testNo);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("subCategory", subCategory);
    formData.append("oldPrice", oldPrice);
    formData.append("discountedPrice", discountedPrice);
    formData.append("contrastPrice", contrastPrice);
    formData.append("homeCollection", homeCollection);
    if (image?.file) {
      formData.append("image", image.file);
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/subcategories`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create SubCategory");
      }

      const data = await response.json();
      alert("SubCategory created successfully!");

      // ✅ UPDATED HERE — update state instantly
      const newList = [data.data, ...subCategoriesList];
      setSubCategoriesList(newList);
      setFilteredSubCategories(newList);

      // Reset form
      setExpertSerialTestNo("");
      setTestNo("");
      setTitle("");
      setDescription("");
      setCategory("");
      setSubCategory("");
      setOldPrice("");
      setDiscountedPrice("");
      setContrastPrice("");
      setHomeCollection("");
      setImage(null);
    } catch (err) {
      alert(err.message || "Failed to create SubCategory");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index) => {
    const selectedRowFromFiltered = filteredSubCategories[index];
    const originalIndex = subCategoriesList.findIndex(
      (item) => item._id === selectedRowFromFiltered._id
    );
    const selectedRow = subCategoriesList[originalIndex];
    setExpertSerialTestNo(selectedRow.expertSerialTestNo);
    setTestNo(selectedRow.testNo);
    setTitle(selectedRow.title);
    setDescription(selectedRow.description);
    setCategory(selectedRow.category);
    setSubCategory(selectedRow.subCategory);
    setOldPrice(selectedRow.oldPrice);
    setDiscountedPrice(selectedRow.discountedPrice);
    setContrastPrice(selectedRow.contrastPrice);
    setHomeCollection(selectedRow.homeCollection);
    setImage({
      preview: selectedRow.image,
      file: null,
    });
    setEditIndex(originalIndex);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (
      !expertSerialTestNo ||
      !testNo ||
      !title ||
      !description ||
      !category ||
      !subCategory ||
      !oldPrice ||
      !discountedPrice ||
      !contrastPrice ||
      !homeCollection
    ) {
      alert("Please fill all fields before updating.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("expertSerialTestNo", expertSerialTestNo);
    formData.append("testNo", testNo);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("subCategory", subCategory);
    formData.append("oldPrice", oldPrice);
    formData.append("discountedPrice", discountedPrice);
    formData.append("contrastPrice", contrastPrice);
    formData.append("homeCollection", homeCollection);
    if (image?.file) {
      formData.append("image", image.file);
    }

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/subcategories/${subCategoriesList[editIndex]._id}`,
        {
          method: "PUT",
          body: formData,
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert("SubCategory updated successfully!");

        // ✅ UPDATED HERE — update list instantly
        const updatedList = [...subCategoriesList];
        updatedList[editIndex] = data.data;
        setSubCategoriesList(updatedList);
        setFilteredSubCategories(updatedList);

        // reset form
        setImage(null);
        setExpertSerialTestNo("");
        setTitle("");
        setDescription("");
        setCategory("");
        setSubCategory("");
        setNewCategory("");
        setTestNo("");
        setOldPrice("");
        setDiscountedPrice("");
        setContrastPrice("");
        setHomeCollection("");
        setEditIndex(null);
      } else {
        alert(data.error || "Failed to update SubCategory");
      }
    } catch (err) {
      alert("Failed to update SubCategory");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (index) => {
    setLoading(true);
    setError("");
    const selectedRowFromFiltered = filteredSubCategories[index];
    const originalIndex = subCategoriesList.findIndex(
      (item) => item._id === selectedRowFromFiltered._id
    );

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/subcategories/${subCategoriesList[originalIndex]._id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        alert("SubCategory deleted successfully!");

        // ✅ UPDATED HERE — remove instantly
        const updatedList = subCategoriesList.filter(
          (item) => item._id !== subCategoriesList[originalIndex]._id
        );
        setSubCategoriesList(updatedList);
        setFilteredSubCategories(updatedList);
      } else {
        alert("Failed to delete SubCategory");
      }
    } catch (err) {
      alert("Failed to delete SubCategory");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (searchQuery.trim() === "") {
        setFilteredSubCategories(subCategoriesList);
        setNoResult(false);
        return;
      }

      const filtered = subCategoriesList.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (filtered.length > 0) {
        setFilteredSubCategories(filtered);
        setNoResult(false);
      } else {
        setFilteredSubCategories([]);
        setNoResult(true);
      }
    }
  };

  const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setFilteredSubCategories(subCategoriesList);
    setNoResult(false);
  };

  const handleDateFilterChange = (e) => {
    setDateFilter(e.target.value);
  };

  const handleExportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(subCategoriesList);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SubCategories");
    XLSX.writeFile(wb, "subCategories.xlsx");
  };


  return (
    <div className="SubCategory-main1">
      <div className="SubCategory-list-box1" ref={formRef}>
        <h1 className="SubCategory-titles">Sub-Category List Form</h1>

        <div className="SubCategory-input-box1">
          <div className="SubCategory-input-row">
            <div className="SubCategory-input-group">
              <label>Expert Serial Test No:</label>
              <input
                name="expertSerialTestNo"
                className="SubCategory-input-section"
                type="text"
                value={expertSerialTestNo}
                onChange={(e) => setExpertSerialTestNo(e.target.value)}
                placeholder="Enter Expert Serial Test No"
              />
            </div>
            <div className="SubCategory-input-group">
              <label>Test No:</label>
              <input
                name="testNo"
                className="SubCategory-input-section"
                type="text"
                value={testNo}
                onChange={(e) => setTestNo(e.target.value)}
                placeholder="Enter Test No"
              />
            </div>
          </div>

          {/* <div className="SubCategory-input-row">
            
          </div> */}

          <div className="SubCategory-input-row ">
            <div className="SubCategory-input-group">
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
            <div className="SubCategory-input-group">
              <label>Home Collection:</label>
              <select
                name="homecollection"
                value={homeCollection}
                onChange={(e) => setHomeCollection(e.target.value)}
              >
                <option value="">Availability</option>
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>
          </div>

          <div className="SubCategory-input-row ">
            <div className="SubCategory-input-group">
              <label>Sub Category:</label>
              <select
                name="subcategory"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
              >
                <option value="">Sub Category</option>
                {subcategories.map((subCat, index) => (
                  <option key={index} value={subCat}>
                    {subCat}
                  </option>
                ))}
              </select>
            </div>

            <div className="SubCategory-input-group">
              <label>Add Sub Category:</label>
              <input
                name="addcategory"
                className="SubCategory-input-section"
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter new sub-category"
              />
            </div>
            <div className="SubCategory-input-group">
              <label>Add Button:</label>
              <button className="add-button" onClick={handleAddCategory}>
                + Add
              </button>
            </div>
          </div>

          <div className="SubCategory-input-row ">
            <div className="SubCategory-input-group">
              <label>Upload Image:</label>
              <input
                name="uploadimage"
                className="SubCategory-input-section"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <div className="SubCategory-input-group">
              <label>Test Name:</label>
              <input
                name="title"
                className="SubCategory-input-section"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter Test Name"
              />
            </div>
          </div>

          <div className="SubCategory-input-row ">
            <div className="SubCategory-input-group">
              <label>Old Price:</label>
              <input
                name="oldprice"
                className="SubCategory-input-section"
                type="text"
                value={oldPrice}
                onChange={(e) => setOldPrice(e.target.value)}
                placeholder="Enter Old Price"
              />
            </div>
            <div className="SubCategory-input-group">
              <label>Discounted Price:</label>
              <input
                name="discountedPrice"
                className="SubCategory-input-section"
                type="text"
                value={discountedPrice}
                onChange={(e) => setDiscountedPrice(e.target.value)}
                placeholder="Enter Discounted Price"
              />
            </div>
          </div>

          <div className="SubCategory-input-row ">
            <div className="SubCategory-input-group">
              <label>Contrast Price:</label>
              <input
                name="contrastPrice"
                className="SubCategory-input-section"
                type="text"
                value={contrastPrice}
                onChange={(e) => setContrastPrice(e.target.value)}
                placeholder="Enter Contrast Price"
              />
            </div>
          </div>

          <div className="SubCategory-input-row ">
            <div className="SubCategory-input-group">
              <label>Description:</label>
              <textarea
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
              ></textarea>
            </div>
          </div>

          <div className="SubCategory-submit-container">
            <button
              className="SubCategory-submit-button"
              onClick={editIndex !== null ? handleUpdate : handleSubmit}
            >
              {editIndex !== null ? "Update" : "Submit"}
            </button>
          </div>
        </div>
      </div>
      <div className="SubCategory-box2">
        <div className="SubCategory-fetch-container">
          <div className="SubCategory-fetch-title">Sub-Categories List</div>

          <div className="SubCategory-filter-container">
            {/* <input
              type="date"
              id="dateFilter"
              value={dateFilter}
              onChange={handleDateFilterChange}
              className="date-filter"
            /> */}
          </div>

          <div className="SubCategory-search-container">
            <div className="SubCategory-search-left">
              <input
                type="text"
                placeholder="Search by Test Name and press Enter"
                value={searchQuery}
                onChange={handleSearchQueryChange}
                onKeyDown={handleSearchKeyDown}
                className="search-input"
              />
              <button
                onClick={handleClearSearch}
                className="excel-button clear-btn"
              >
                Clear
              </button>
            </div>

            <button className="excel-button" onClick={handleExportToExcel}>
              Export to Excel
            </button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : noResult ? (
            <p style={{ color: "red", textAlign: "center", marginTop: "20px" }}>
              ❌ Test not found!
            </p>
          ) : (
            <table className="SubCategory-fetch-table">
              <thead>
                <tr>
                  <th>Expert Serial No</th>
                  <th>Test No</th>
                  <th>Image</th>
                  <th>Category</th>
                  <th>Sub-Category</th>
                  <th>Home Collection</th>
                  <th>Test Name</th>
                  <th>Old Price</th>
                  <th>Discounted Price</th>
                  <th>Contrast Price</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubCategories.map((subCategoryInput, index) => (
                  <tr key={index}>
                    <td>{subCategoryInput.expertSerialTestNo}</td>
                    <td>{subCategoryInput.testNo}</td>
                    <td>
                      {subCategoryInput.image ? (
                        <img
                          src={`${BACKEND_URL}/uploads/${subCategoryInput.image}`}
                          alt="Uploaded Preview"
                          className="category-image"
                        />
                      ) : (
                        "No image"
                      )}
                    </td>
                    <td>{subCategoryInput.category}</td>
                    <td>{subCategoryInput.subCategory}</td>
                    <td>{subCategoryInput.homeCollection}</td>
                    <td>{subCategoryInput.title}</td>
                    <td>{subCategoryInput.oldPrice}</td>
                    <td>{subCategoryInput.discountedPrice}</td>
                    <td>{subCategoryInput.contrastPrice}</td>
                    <td>{subCategoryInput.description}</td>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default SubCategory;
