  import React, { useEffect, useState } from "react";
  import axios from "axios";
  import "../styles/Event.css";
  import { useNavigate } from "react-router-dom";
import { BE_URL } from "../utils/Constant";

  interface Category {
    id: number;
    service_id: number;
    name: string;
    description: string;
  }

  interface Service {
    id: number;
    name: string;
  }

  const Services: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [newServiceName, setNewServiceName] = useState<string>("");
    const [newCategory, setNewCategory] = useState({ name: "", description: "", service_id: "" });
    const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);
    const [itemToDelete, setItemToDelete] = useState<{ id: number; type: "service" | "category" } | null>(null);
    const [showServiceModal, setShowServiceModal] = useState<boolean>(false);
    const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
    const navigate = useNavigate();

    // Fetch services and categories
    useEffect(() => {
      axios.get(`${BE_URL}/services`, { withCredentials: true })
        .then((response) => {
          setServices(response.data);
        })
        .catch((error) => {
          console.error("Error fetching services:", error);
        });

      axios.get(`${BE_URL}/services/categories`, { withCredentials: true })
        .then((response) => {
          setCategories(response.data);
        })
        .catch((error) => {
          console.error("Error fetching categories:", error);
        });
    }, []);

    const handleAddService = () => {
      if (!newServiceName.trim()) {
        alert("Service name cannot be empty!");
        return;
      }

      axios.post(`${BE_URL}/services/create`, { name: newServiceName }, { withCredentials: true })
        .then((response) => {
          setServices([...services, response.data.service]);
          setNewServiceName("");
          setShowServiceModal(false);
          window.location.reload();// Navigate to the same page
        })
        .catch((error) => console.error("Error adding service:", error));
    };

    const handleAddCategory = () => {
      if (!newCategory.name.trim() || !newCategory.service_id.trim()) {
        alert("Category name and Service ID are required!");
        return;
      }

      axios.post(`${BE_URL}/services/addcategory`, {
        name: newCategory.name,
        description: newCategory.description,
        service_id: Number(newCategory.service_id),
      }, { withCredentials: true })
        .then((response) => {
          setCategories([...categories, response.data.category]);
          setNewCategory({ name: "", description: "", service_id: "" });
          window.location.reload();// Navigate to the same page
        })
        .catch((error) => console.error("Error adding category:", error));
    };

    const handleDelete = () => {
      if (itemToDelete) {
        const { id, type } = itemToDelete;
        if (type === "service") {
          axios.delete(`${BE_URL}/services/serdelete/${id}`, { withCredentials: true })
            .then(() => {
              setServices(services.filter(service => service.id !== id));
              setShowConfirmDelete(false);
              navigate("/events"); // Navigate to the same page
            })
            .catch((error) => {
              console.error("Error deleting service:", error);
              setShowConfirmDelete(false);
            });
        } else if (type === "category") {
          axios.delete(`${BE_URL}/services/catdelete/${id}`, { withCredentials: true })
            .then(() => {
              setCategories(categories.filter(category => category.id !== id));
              setShowConfirmDelete(false);
              navigate("/events"); // Navigate to the same page
            })
            .catch((error) => {
              console.error("Error deleting category:", error);
              setShowConfirmDelete(false);
            });
        }
      }
    };

    const handleCancelDelete = () => {
      setShowConfirmDelete(false);
      setItemToDelete(null);
    };

    const requestDelete = (id: number, type: "service" | "category") => {
      setItemToDelete({ id, type });
      setShowConfirmDelete(true);
    };

    return (
      <div className="content">
        <h2>Services & Categories</h2>

        <div className="btn-group">
        <button className="add-button" onClick={() => setShowServiceModal(true)}>+ Add Service</button>
        <button className="add-button" onClick={() => setShowCategoryModal(true)}>+ Add Category</button>
        </div>

         {showServiceModal && (
        <div className="modal-overlay">
           <div className="modal">
             <h3>Add Service</h3>
             <input
               type="text"
               placeholder="Enter service name"
               value={newServiceName}
               onChange={(e) => setNewServiceName(e.target.value)}
             />
             <button className="add-btn" onClick={handleAddService}>Add</button>
             <button className="cancel-btn" onClick={() => setShowServiceModal(false)}>Cancel</button>
           </div>
         </div>
      )}
      
        <h3>Services</h3>
        <table className="event-table ">
          <thead>
            <tr>
              <th>ID</th>
              <th>Service Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id}>
                <td>{service.id}</td>
                <td>{service.name}</td>
                <td><button className="delete-button" onClick={() => requestDelete(service.id, "service")}>Hide</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {showCategoryModal && (
         <div className="modal-overlay">
           <div className="modal">
             <h3>Add Category</h3>
             <input
               type="text"
               placeholder="Enter category name"
               value={newCategory.name}
               onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
             />
             <input
              type="text"
               placeholder="Enter description"
               value={newCategory.description}
               onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
             />
            <input
               type="number"
               placeholder="Enter Service ID"
               value={newCategory.service_id}
               onChange={(e) => setNewCategory({ ...newCategory, service_id: e.target.value })}
            />
             <button className="add-btn" onClick={handleAddCategory}>Add</button>
             <button className="cancel-btn" onClick={() => setShowCategoryModal(false)}>Cancel</button>
          </div>
       </div>
      )}
      
        <h3>Categories</h3>
        <table className="event-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Category Name</th>
              <th>Description</th>
              <th>Service ID</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td>{category.service_id}</td>
                <td><button className="delete-button" onClick={() => requestDelete(category.id, "category")}>Hide</button></td>
              </tr>
            ))}
          </tbody>
        </table>


        {showConfirmDelete && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Are you sure you want to delete this {itemToDelete?.type}?</h3>
              <div className="modal-actions">
                <button className="modal-button cancel" onClick={handleCancelDelete}>Cancel</button>
                <button className="modal-button confirm" onClick={handleDelete}>Confirm</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  export default Services;