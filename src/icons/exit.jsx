export const ExitIcon = ({ height, width, className, onClick }) => {
  return (
    <svg onClick={onClick} className={className} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height={height || "1em"} width={width || "1em"} xmlns="http://www.w3.org/2000/svg"><path d="M12 10v-2h-5v-2h5v-2l3 3zM11 9v4h-5v3l-6-3v-13h11v5h-1v-4h-8l4 2v9h4v-3z"></path></svg>
  );
}