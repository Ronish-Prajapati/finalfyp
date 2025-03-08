import React, { useState, useEffect  } from "react";
import UserService from '../components/service/UserService'; // Import your UserService

import { useNavigate } from "react-router-dom";

// import "bootstrap/dist/css/bootstrap.min.css";

const CategoryForm = ({ token }) => {
    const [category, setCategory] = useState({ categoryTitle: "", categoryDescription: "" });
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState("");
    const [authToken, setAuthToken] = useState(token);
    const [editingCategory, setEditingCategory] = useState(null);
    
    useEffect(() => {
        if (!authToken) {
            const storedToken = localStorage.getItem("token");
            setAuthToken(storedToken);
        }
        fetchCategories();
    }, [authToken]);

    const fetchCategories = async () => {
        try {
            const data = await UserService.getAllCategories(authToken);
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleChange = (e) => {
        setCategory({ ...category, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!authToken) {
                setMessage("Authentication token is missing. Please log in again.");
                return;
            }
            if (editingCategory) {
                await UserService.updateCategory(editingCategory.id, category, authToken);
                setMessage("Category updated successfully!");
                setEditingCategory(null);
            } else {
                const response = await UserService.createCategory(category, authToken);
                if (response.status === 201) {
                    setMessage("Category created successfully!");
                } else {
                    setMessage("Failed to create category. Please check your permissions.");
                }
            }
            setCategory({ categoryTitle: "", categoryDescription: "" });
            fetchCategories();
        } catch (error) {
            setMessage("Failed to process request.");
        }
    };
    const navigate = useNavigate();
    const handleEdit = (cat) => {
        navigate(`/category/edit/${cat.categoryId}`);
        console.log(cat);
        setEditingCategory(cat);
        setCategory({ categoryTitle: cat.categoryTitle, categoryDescription: cat.categoryDescription });
    };

    

    return (
        <div className="container mt-4">
            <h2 className="mb-3">{editingCategory ? "Edit Category" : "Create Category"}</h2>
            {message && <div className="alert alert-info">{message}</div>}
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="mb-3">
                    <input
                        type="text"
                        name="categoryTitle"
                        className="form-control"
                        placeholder="Category Name"
                        value={category.categoryTitle}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        name="categoryDescription"
                        className="form-control"
                        placeholder="Category Description"
                        value={category.categoryDescription}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">{editingCategory ? "Update" : "Create"}</button>
                {editingCategory && <button className="btn btn-secondary ms-2" onClick={() => { setEditingCategory(null); setCategory({ categoryTitle: "", categoryDescription: "" }); }}>Cancel</button>}
            </form>

            <h3>Categories</h3>
            <table className="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Description</th>
                       
                    </tr>
                </thead>
                <tbody>
                    {categories.map((cat) => (
                        <tr key={cat.id}>
                            <td>{cat.id}</td>
                            <td>{cat.categoryTitle}</td>
                            <td>{cat.categoryDescription}</td>
                            
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CategoryForm;
