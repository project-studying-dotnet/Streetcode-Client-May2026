// Виносимо за межі Dictionary!
const CustomSortIcon = ({ sortOrder }: { sortOrder?: "ascend" | "descend" | null }) => {
  const color = "#1D1F23";

  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.5 7.25L12.5 7.25L6.5 0.5L0.5 7.25Z"
        fill={sortOrder === "ascend" ? color : "transparent"}
        stroke={color}
        strokeLinejoin="round"
      />
      <path
        d="M0.5 10.75L12.5 10.75L6.5 17.5L0.5 10.75Z"
        fill={sortOrder === "descend" ? color : "transparent"}
        stroke={color}
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CustomSortIcon;
