export const MenuIcon = ({height, width, className, onClick}) => {
  return (
    <svg onClick={onClick} className={className} stroke="currentColor" fill="currentColor" strokeWidth="0" version="1.1" viewBox="0 0 512 512" height={height || "1em"} width={width || "1em"} xmlns="http://www.w3.org/2000/svg"><path d="M32 96v64h448V96H32zm0 128v64h448v-64H32zm0 128v64h448v-64H32z"></path></svg>
  );
}


