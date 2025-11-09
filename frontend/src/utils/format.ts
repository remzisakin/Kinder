export const formatDate = (value: string) => {
  const date = new Date(value);
  return date.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'short',
  });
};
