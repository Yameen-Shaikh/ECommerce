import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-4 mt-8">
      <div className="container mx-auto text-center">
        <p>Copyright &copy; {new Date().getFullYear()} E-Commerce</p>
      </div>
    </footer>
  );
};

export default Footer;
