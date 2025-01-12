import React from "react";

const Sidebar = ({ activeComponent, setActiveComponent, setShowSidebar }) => {
  const menuItems = [
    { name: "Add Volunteer" },
    { name: "Generate ID Cards" },
    { name: "Add Stalls" },
    { name: "View Volunteers" },
    { name: "View Profile" },
  ];

  return (
    <div className="flex flex-col justify-center items-center overflow-y-auto lg:block hidden"
         style={{
           width: `calc(30% - 2cm)`,
           height: `100%`,
           margin: "1cm",
           padding: "1cm",
           boxSizing: "border-box",
         }}>
      <ul className="space-y-6 text-white w-full">
        {menuItems.map((item) => (
          <li key={item.name}>
            <button
              className={`w-full py-2 px-3 rounded-lg text-lg ${
                activeComponent === item.name ? "shadow-lg shadow-blue-500/50" : ""
              } bg-white/20 backdrop-blur-md hover:bg-blue-500/40 transition-all`}
              onClick={() => {
                setActiveComponent(item.name);
                if (setShowSidebar) setShowSidebar(false); // Handle for small devices
              }}
            >
              {item.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
