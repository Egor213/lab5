import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Подключаем Bootstrap

export function Router() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a href="/brokers" className="nav-link">Брокеры</a>
          </li>
          <li className="nav-item">
            <a href="/acrions" className="nav-link">Акции</a>
          </li>
          <li className="nav-item">
            <a href="/bidding" className="nav-link">Торги</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
