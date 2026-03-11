import React, { useState } from "react";
import "./App.css";

const tables = [
  { id: 1, seats: 2 },
  { id: 2, seats: 4 },
  { id: 3, seats: 6 },
  { id: 4, seats: 4 },
  { id: 5, seats: 2 },
  { id: 6, seats: 8 }
];

export default function App() {
  const [reservations, setReservations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [name, setName] = useState("");

  const reserve = () => {
    if (!name || !selected) return alert("Enter name and select table");

    setReservations([...reservations, { table: selected, name }]);
    setSelected(null);
    setName("");
  };

  const cancel = (tableId) => {
    setReservations(reservations.filter(r => r.table !== tableId));
  };

  const reservedTables = reservations.map(r => r.table);

  return (
    <div className="app">

      <h1 className="title">🍽 Restaurant Table Reservation</h1>

      <div className="layout">

        {/* TABLE GRID */}

        <div className="tables">

          {tables.map(t => (
            <div
              key={t.id}
              className={`table 
              ${reservedTables.includes(t.id) ? "reserved" : ""}
              ${selected === t.id ? "selected" : ""}`}
              onClick={() =>
                !reservedTables.includes(t.id) && setSelected(t.id)
              }
            >
              <h3>Table {t.id}</h3>
              <p>{t.seats} Seats</p>
            </div>
          ))}

        </div>

        {/* BOOKING PANEL */}

        <div className="panel">

          <h2>Reserve Table</h2>

          <input
            placeholder="Customer Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button onClick={reserve}>Book Table</button>

          <h2>Reservations</h2>

          {reservations.map((r, i) => (
            <div className="reservation" key={i}>
              Table {r.table} — {r.name}
              <button onClick={() => cancel(r.table)}>Cancel</button>
            </div>
          ))}

        </div>

      </div>

    </div>
  );
}