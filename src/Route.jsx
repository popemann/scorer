const Route = ({ path, component, currentPath }) => {
  return currentPath === path ? component : null
}

export default Route