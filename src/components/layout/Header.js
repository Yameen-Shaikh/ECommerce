import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Header = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);

  const guestLinks = (
    <>
      <li>
        <Link to="/login">Login</Link>
      </li>
      <li>
        <Link to="/register">Register</Link>
      </li>
    </>
  );

  const authLinks = (
    <>
      <li>
        <button onClick={logout} className="hover:text-gray-300">
          Logout
        </button>
      </li>
    </>
  );

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link to="/">E-Commerce</Link>
        </h1>

        {/* Hello message in the middle */}
        {isAuthenticated && user && (
          <div className="hidden md:block text-lg font-medium text-blue-300">
            Hello, {user.username}
          </div>
        )}

        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/products">Products</Link>
            </li>
            <li>
              <Link to="/cart">Cart</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
            {isAuthenticated && (
              <li>
                <button onClick={logout} className="hover:text-gray-300">
                  Logout
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
