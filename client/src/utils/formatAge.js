export const formatAge = (date_of_birth) => {
  const today = new Date();
  const birthDate = new Date(date_of_birth);
  return today.getFullYear() - birthDate.getFullYear();
};
