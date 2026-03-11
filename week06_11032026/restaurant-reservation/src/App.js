import React, { useState, useEffect } from "react";
import "./App.css";

const initialTables = [
  { id: 1, seats: 2 },
  { id: 2, seats: 4 },
  { id: 3, seats: 6 },
  { id: 4, seats: 4 },
  { id: 5, seats: 2 },
  { id: 6, seats: 8 }
];

function App() {
  const [tables] = useState(initialTables);
  const [selectedTable, setSelectedTable] = useState(null);
  const [name, setName] = useState("");
  const [guests, setGuests] = useState("");
  const [time, setTime] = useState("");
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("reservations"));
    if (saved) setReservations(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("reservations", JSON.stringify(reservations));
  }, [reservations]);

  const reserveTable = () => {
    if (!selectedTable || !name || !guests || !time) {
      alert("Please fill all fields");
      return;
    }

    const newReservation = {
      table: selectedTable,
      name,
      guests,
      time
    };

    setReservations([...reservations, newReservation]);
    setSelectedTable(null);
    setName("");
    setGuests("");
    setTime("");
  };

  const cancelReservation = (tableId) => {
    const updated = reservations.filter(r => r.table !== tableId);
    setReservations(updated);
  };

  const isReserved = (tableId) => {
    return reservations.some(r => r.table === tableId);
  };

  return (
    <div className="container">
      <h1>🍽 Restaurant Table Reservation</h1>

      <div className="form">
        <input
          placeholder="Customer Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Guests"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
        />

        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <button onClick={reserveTable}>Reserve Table</button>
      </div>

      <h2>Select a Table</h2>

      <div className="tables">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`table ${
              isReserved(table.id) ? "reserved" : ""
            } ${selectedTable === table.id ? "selected" : ""}`}
            onClick={() =>
              !isReserved(table.id) && setSelectedTable(table.id)
            }
          >
            <h3>Table {table.id}</h3>
            <p>{table.seats} Seats</p>
          </div>
        ))}
      </div>

      <h2>Reservations</h2>

      <ul className="reservation-list">
        {reservations.map((r, index) => (
          <li key={index}>
            Table {r.table} — {r.name} — {r.guests} Guests — {r.time}
            <button onClick={() => cancelReservation(r.table)}>
              Cancel
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;