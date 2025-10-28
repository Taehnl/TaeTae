export default function SearchBar({ search, setSearch }) {
  return (
    <input
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="요리 이름 검색..."
      className="w-full md:w-80 p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
    />
  );
}
