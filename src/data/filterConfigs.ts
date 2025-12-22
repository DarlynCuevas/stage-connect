import { cities, countries, genres } from "./mockData";

export const managerFilterConfig = [
  {
    key: 'query',
    label: 'Nombre',
    type: 'text',
    placeholder: 'Buscar managers por nombre...'
  },
  {
    key: 'country',
    label: 'País',
    type: 'select',
    options: countries
  },
  {
    key: 'city',
    label: 'Ciudad',
    type: 'select',
    options: [] // debe calcularse dinámicamente según el país seleccionado
  },
  // Puedes agregar aquí más filtros específicos de managers si los necesitas
];

export const artistFilterConfig = [
  {
    key: 'query',
    label: 'Nombre o alias',
    type: 'text',
    placeholder: 'Buscar artistas por nombre...'
  },
  {
    key: 'genre',
    label: 'Género musical',
    type: 'multi-select',
    options: genres
  },
  {
    key: 'country',
    label: 'País',
    type: 'select',
    options: countries
  },
  {
    key: 'city',
    label: 'Ciudad',
    type: 'select',
    options: [] // debe calcularse dinámicamente según el país seleccionado
  },
  {
    key: 'price',
    label: 'Rango de precio (€)',
    type: 'range',
    min: 0,
    max: 50000
  },
  {
    key: 'date',
    label: 'Fecha disponible',
    type: 'date'
  }
];