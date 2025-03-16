// import { useEffect, useState } from "react";
// import axios from "axios";
// import "../styles/Event.css";  
// import { BE_URL } from "../utils/Constant";

// interface Booking {
//   id: number;
//   username: string;
//   telephone_number: string;
//   service_name: string;
//   category_name: string;
//   event_date: string;
// }

// const Book: React.FC = () => {
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);
//   const [itemToDelete, setItemToDelete] = useState<{ id: number } | null>(null);

//   // Get bookings
//   useEffect(() => {
//     axios
//       .get(`${BE_URL}/bookings/get`,{withCredentials:true},
        
//       )
//       .then((response) => {
//         // bookings order
//         const sortedBookings = response.data.sort((a: Booking, b: Booking) => a.id - b.id);
//         setBookings(sortedBookings);
//       })
//       .catch((error) => console.error("Error fetching data:", error));
//   }, []);

//   // Delete a booking
//   const deleteBooking = async () => {
//     if (itemToDelete) {
//       try {
//         await axios.delete(`${BE_URL}/bookings/delete/${itemToDelete.id}`,{withCredentials:true});
//         setBookings((prevBookings) => prevBookings.filter((booking) => booking.id !== itemToDelete.id));
//         setShowConfirmDelete(false);
//         setItemToDelete(null);
//         alert("Booking deleted successfully");
//       } catch (error) {
//         console.error("Error deleting booking:", error);
//         alert("Error deleting booking");
//         setShowConfirmDelete(false);
//       }
//     }
//   };

//   const requestDelete = (id: number) => {
//     setItemToDelete({ id });
//     setShowConfirmDelete(true);
//   };

//   const handleCancelDelete = () => {
//     setShowConfirmDelete(false);
//     setItemToDelete(null);
//   };

//   return (
//     <div className="content">
//       <h2>Admin Dashboard</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Username</th>
//             <th>Telephone</th>
//             <th>Service Name</th>
//             <th>Category Name</th>
//             <th>Event Date</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {bookings.map((booking) => (
//             <tr key={booking.id}>
//               <td>{booking.id}</td>
//               <td>{booking.username}</td>
//               <td>{booking.telephone_number}</td>
//               <td>{booking.service_name}</td>
//               <td>{booking.category_name}</td>
//               <td>{booking.event_date}</td>
//               <td>
//                 <button className="delete-button" onClick={() => requestDelete(booking.id)}>Hide </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

  
//       {showConfirmDelete && (
//         <div className="modal-overlay">
//           <div className="modal">
//             <h3>Are you sure you want to delete this booking?</h3>
//             <div className="modal-actions">
//               <button className="modal-button cancel" onClick={handleCancelDelete}>Cancel</button>
//               <button className="modal-button confirm" onClick={deleteBooking}> Confirm</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Book;


import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Booking.css";  
import { BE_URL } from "../utils/Constant";

interface Booking {
  id: number;
  username: string;
  telephone_number: string;
  service_name: string;
  category_name: string;
  event_date: string;
}

const Book: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: number } | null>(null);


  const [currentPage, setCurrentPage] = useState<number>(1);
  const [bookingsPerPage] = useState<number>(10); 
  const [totalBookings, setTotalBookings] = useState<number>(0);


  useEffect(() => {
    const fetchBookings = async () => {
      try {
        
        const response = await axios.get(`${BE_URL}/bookings/get`, {
          withCredentials: true
        });
        
      
        if (response.data && response.data.length > 0) {
          const sortedBookings = response.data.sort((a: Booking, b: Booking) => a.id - b.id);
          setBookings(sortedBookings); 
          setTotalBookings(sortedBookings.length); 
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchBookings();
  }, []); 

  
  const deleteBooking = async () => {
    if (itemToDelete) {
      try {
        await axios.delete(`${BE_URL}/bookings/delete/${itemToDelete.id}`, { withCredentials: true });
        setBookings((prevBookings) => prevBookings.filter((booking) => booking.id !== itemToDelete.id));
        setShowConfirmDelete(false);
        setItemToDelete(null);
        alert("Booking deleted successfully");
      } catch (error) {
        console.error("Error deleting booking:", error);
        alert("Error deleting booking");
        setShowConfirmDelete(false);
      }
    }
  };

  const requestDelete = (id: number) => {
    setItemToDelete({ id });
    setShowConfirmDelete(true);
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
    setItemToDelete(null);
  };


  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);

  
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalBookings / bookingsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="content">
      <h2>Booking List</h2>
      
      <div className="table-container">
        <table className="booking-table ">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Telephone</th>
              <th>Service Name</th>
              <th>Category Name</th>
              <th>Event Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentBookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.username}</td>
                <td>{booking.telephone_number}</td>
                <td>{booking.service_name}</td>
                <td>{booking.category_name}</td>
                <td>{booking.event_date}</td>
                <td>
                  <button className="delete-button" onClick={() => requestDelete(booking.id)}>Hide</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

<div className="pagination">
  {pageNumbers.map((number) => (
    <button
      key={number}
      onClick={() => paginate(number)}
      className={`page-button ${currentPage === number ? 'active' : ''}`} 
      disabled={currentPage === number} 
    >
      {number}
    </button>
  ))}
</div>


      {showConfirmDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Are you sure you want to delete this booking?</h3>
            <div className="modal-actions">
              <button className="modal-button cancel" onClick={handleCancelDelete}>Cancel</button>
              <button className="modal-button confirm" onClick={deleteBooking}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Book;


