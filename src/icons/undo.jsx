export const UndoIcon = ({height, width, className, onClick, isDisabled}) => {
  return (
    <svg onClick={onClick} className={className} stroke={isDisabled ? "lightgrey" : "black"} fill={isDisabled ? "lightgrey" : "black"} strokeWidth="0" version="1.1" viewBox="0 0 16 16" height={height || '1rem'} width={width || '1rem'} xmlns="http://www.w3.org/2000/svg"><path d="M11.904 16c1.777-3.219 2.076-8.13-4.904-7.966v3.966l-6-6 6-6v3.881c8.359-0.218 9.29 7.378 4.904 12.119z"></path></svg>
  );
}