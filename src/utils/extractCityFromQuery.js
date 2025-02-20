import diacritics from 'diacritics';

export const extractCityFromQuery = query => {
  const cities = [
    // 🇦🇷 Argentina
    'Buenos Aires', 'Córdoba', 'Bariloche', 'Rosario', 'Mendoza', 'Mar del Plata',
    'Salta', 'Tucumán', 'La Plata', 'San Juan', 'San Luis', 'San Miguel de Tucumán',
    'San Carlos de Bariloche', 'Villa Carlos Paz', 'Ushuaia', 'Neuquén', 'Corrientes',
    'Santa Fe', 'Bahía Blanca', 'Jujuy', 'Posadas', 'Trelew',

    // 🇧🇷 Brasil
    'São Paulo', 'Rio de Janeiro', 'Brasilia', 'Salvador', 'Belo Horizonte', 'Fortaleza',
    'Curitiba', 'Manaus', 'Recife', 'Porto Alegre', 'Belém', 'Goiânia', 'Florianópolis',
    'Natal', 'Campo Grande', 'São Luís', 'Maceió', 'João Pessoa', 'Aracaju', 'Cuiabá',
    'Teresina', 'Vitória', 'Sorocaba', 'Blumenau', 'Joinville',

    // 🇨🇴 Colombia
    'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga',
    'Pereira', 'Manizales', 'Cúcuta', 'Ibagué', 'Santa Marta', 'Pasto',
    'Villavicencio', 'Armenia', 'Neiva', 'Montería', 'Valledupar', 'Popayán',
    'Sincelejo', 'Tunja'
  ];

  // Convertir a minúsculas y eliminar tildes
  const normalizedQuery = diacritics.remove(query.toLowerCase());

  return cities.find(city =>
    normalizedQuery.includes(diacritics.remove(city.toLowerCase()))
  ) || null;
};
