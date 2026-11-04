export const handleBuyBook = (title: string, author: string) => {
  const searchQuery = encodeURIComponent(`${title} ${author}`);
  const coupangUrl = `https://www.coupang.com/np/search?q=${searchQuery}`;
  window.open(coupangUrl, "_blank");
};
