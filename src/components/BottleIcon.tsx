const BottleIcon = ({ fill = "#e0e0e0" }) => (
  <svg
    width="100"
    height="250"
    viewBox="0 0 100 250"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#8b8b8b", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#e0e0e0", stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <g fill="none" stroke="black" strokeWidth="2">
      {/* Cuerpo de la botella */}
      <path
        d="M50 10 
               C30 10, 10 60, 10 120 
               C10 170, 30 220, 50 220 
               C70 220, 90 170, 90 120 
               C90 60, 70 10, 50 10 
               Z"
        fill={fill}
      />
      {/* Cuello de la botella */}
      <path d="M40 0 H60 V10 H40 Z" fill={fill} />
      {/* Etiqueta de la botella */}
      <path
        d="M35 115 
               C30 110, 30 130, 35 125 
               L65 125 
               C70 130, 70 110, 65 115 
               Z"
        fill="#fff"
        stroke="black"
        strokeWidth="1"
      />
    </g>
  </svg>
);

export default BottleIcon;
