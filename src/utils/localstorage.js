export const setWithExpiry = (key, value, ttl) => {
  const now = new Date();
  // ttl est en secondes, convertir en millisecondes et ajouter à l'heure actuelle
  const item = {
    value: value,
    expiry: now.getTime() + ttl * 1000, // Expiry est un timestamp en millisecondes
  };
  localStorage.setItem(key, JSON.stringify(item));
};

export const getWithExpiry = (key) => {
  const itemStr = localStorage.getItem(key);

  // Si l'élément n'existe pas, retourner null
  if (!itemStr) {
    return null;
  }

  const item = JSON.parse(itemStr);
  const now = new Date();

  // Comparer le timestamp d'expiration avec l'heure actuelle
  if (now.getTime() > item.expiry) {
    // Si l'élément a expiré, le supprimer du stockage et retourner null
    localStorage.removeItem(key);
    return null;
  }

  return item.value;
};