// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import '../styles/Users.css'
// import { BE_URL } from "../utils/Constant";

// interface User {
//   id: number;
//   username: string;
//   email: string;
// }

// const Users: React.FC = () => {     
//   const [users, setUsers] = useState<User[]>([]);
//   const [showModal, setShowModal] = useState<boolean>(false); 
//   const [userIdToDelete, setUserIdToDelete] = useState<number | null>(null); 

//   useEffect(() => {
    
//     axios
//       .get(`${BE_URL}/users/get`) 
//       .then((response) => {
//         setUsers(response.data.sort((a: User, b: User) => a.id - b.id));
//       })
//       .catch((error) => console.error("Error fetching users:", error));
//   }, []);

//   const handleDelete = (id: number) => {
//     setUserIdToDelete(id);
//     setShowModal(true); 
//   };

//   const confirmDelete = () => {
//     if (userIdToDelete !== null) { 
//       axios .delete(`${BE_URL}/users/get/${userIdToDelete}`)
//         .then(() => {
//           setUsers((prevUsers) => prevUsers.filter(user => user.id !== userIdToDelete));    
//           setShowModal(false);
//         })
//         .catch((error) => {
//           console.error("Error deleting user:", error);
//           setShowModal(false);
//         });
//     }
//   };

//   const cancelDelete = () => setShowModal(false);

//   return (
//     <div className="content">
//       <h2>User List</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((user) => (
//             <tr key={user.id}>
//               <td>{user.id}</td>
//               <td>{user.username}</td>
//               <td>{user.email}</td>
//               <td>
//                 <button className="delete-button" onClick={() => handleDelete(user.id)}>Hide</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {showModal && (
//         <div className="modal-overlay">
//           <div className="modal">
//             <h3>Are you sure you want to delete this user?</h3>
//             <div className="modal-actions">
//               <button className="modal-button cancel" onClick={cancelDelete}>Cancel</button>
//               <button className="modal-button confirm" onClick={confirmDelete}>Confirm</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Users;


import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Users.css";
import { BE_URL } from "../utils/Constant";

interface User {
  id: number;
  username: string;
  email: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [userIdToDelete, setUserIdToDelete] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [usersPerPage] = useState<number>(10);

  useEffect(() => {
    axios
      .get(`${BE_URL}/users/get`)
      .then((response) => {
        setUsers(response.data.sort((a: User, b: User) => a.id - b.id));
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleDelete = (id: number) => {
    setUserIdToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (userIdToDelete !== null) {
      axios
        .delete(`${BE_URL}/users/get/${userIdToDelete}`)
        .then(() => {
          setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userIdToDelete));
          setShowModal(false);
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
          setShowModal(false);
        });
    }
  };

  const cancelDelete = () => setShowModal(false);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="content">
      <h2>User List</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <button className="delete-button" onClick={() => handleDelete(user.id)}>
                  Hide
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: Math.ceil(users.length / usersPerPage) }, (_, i) => i + 1).map((number) => (
          <button
            key={number}
            className={`pagination-button ${currentPage === number ? "active" : ""}`}
            onClick={() => paginate(number)}
          >
            {number}
          </button>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Are you sure you want to delete this user?</h3>
            <div className="modal-actions">
              <button className="modal-button cancel" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="modal-button confirm" onClick={confirmDelete}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
