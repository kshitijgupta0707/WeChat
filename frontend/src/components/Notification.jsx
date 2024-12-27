import React, { useState, useEffect } from 'react';

const Notification = () => {
 
  return (
    <div>
      {/* Notification component */}
      {isVisible && (
        <div className="z-50 fixed left-[50%] -translate-x-1/2 lg:w-[600px]">
          <div role="alert" className="alert shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-info h-6 w-6 shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <div>
              <h3 className="font-bold">Notification</h3>
              <div className="text-xs">{message}</div>
            </div>
            <button className="btn btn-sm" onClick={() => setIsVisible(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Button to trigger notification */}
      <button
        className="btn btn-primary"
        onClick={() => showNotification('You have 1 unread message!')}
      >
        Show Notification
      </button>
    </div>
  );
};

export default Notification;
