export default function NotificationCard({ author, category, content, title, tags }) {
  const handleCardClick = (e) => {
    if (e.target.classList.contains('close-btn')) return;

    const formattedTitle = encodeURIComponent(title);
    const articleUrl = `http://localhost:3000/articlepage/${formattedTitle}`;

    window.open(articleUrl, '_blank');
  };

  const truncateContent = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const stripHtmlTags = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '');
  };

  return (
    <div
      className="bg-white border-l-4 border-[#a9222f] p-4 rounded-md shadow-md max-w-md transition-all duration-300 hover:shadow-lg cursor-pointer relative"
      onClick={handleCardClick}
    >
      <button className="p-2 close-btn absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-lg leading-none">
        ×
      </button>

      <div className="font-semibold text-gray-800 mb-1">
        📰 New article by <span className="text-blue-700">{author}</span>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
        <span>Category: <em className="text-indigo-500">{category}</em></span>
      </div>

      <div className="font-medium text-gray-900 mb-1 truncate">
        {title}
      </div>

      <div className="text-sm text-gray-700 mb-2">
        {truncateContent(stripHtmlTags(content))}
      </div>

      {tags && (
        <div className="flex flex-wrap gap-1 mb-2">
          {tags.split('|').slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              #{tag.trim()}
            </span>
          ))}
        </div>
      )}

      <div className="text-xs text-blue-500 mt-2">
        🔗 Click to read full article
      </div>
    </div>
  );
}