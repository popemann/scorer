export const HomeIcon = ({height, width, className, onClick}) => {
  return (
    <svg onClick={onClick} className={className} stroke="currentColor" fill="currentColor" strokeWidth="0" version="1.1" viewBox="0 0 16 16" height={height || "1em"} width={width || "1em"} xmlns="http://www.w3.org/2000/svg">
      <path d="M16 9.226l-8-6.21-8 6.21v-2.532l8-6.21 8 6.21zM14 9v6h-4v-4h-4v4h-4v-6l6-4.5z">
        </path>
    </svg>
  );
}