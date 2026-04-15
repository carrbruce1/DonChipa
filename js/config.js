const CONFIG = {

  nombre:   "Don Chipá",
  telefono: "5493454175555", // sin + ni espacios

  moneda: "",

  pagos: {
    efectivo: true,
    transferencia: true,
    alias: "Donmateochipa"
  },

  zonas: [
    { nombre: "Villa Urquiza y Alrededores",  costo: 0    },
    { nombre: "Afueras",    costo: 'Consultar precio' },
  ],

  // ────────────────
  // MINORISTA
  // ────────────────
  minoristaOpciones: [
     {
      id: "2kg",
      label: "2 KG",
      precio: 40000,
      personas: "8 a 9 personas",
      icon: "fa-solid fa-basket-shopping"
    },
    {
      id: "1kg",
      label: "1 KG",
      precio: 20000,
      personas: "4 a 5 personas",
      icon: "fa-solid fa-basket-shopping"
    },
    {
      id: "medio",
      label: "1/2 KG",
      precio: 12000,
      personas: "2 a 3 personas",
      icon: "fa-solid fa-scale-balanced"
    },
    {
      id: "cuarto",
      label: "1/4 KG",
      precio: 7000,
      personas: "1 a 2 personas",
      icon: "fa-solid fa-box"
    },
  ],

  // ────────────────
  // MAYORISTA
  // ────────────────
  mayoristaOpciones: [
    {
      id: "3kg",
      label: "3 KG",
      precio: 49500,
      icon: "fa-solid fa-boxes-stacked"
    },
    {
      id: "5kg",
      label: "5 KG",
      precio: 82500,
      icon: "fa-solid fa-warehouse"
    },
    {
      id: "10kg",
      label: "10 KG",
      precio: 165000,
      icon: "fa-solid fa-truck"
    },
  ],

  categorias: [
    {
      id: "Minorista",
      nombre: "Minorista",
      emoji: "🛍️" // esto lo podés dejar, es decorativo
    },
    {
      id: "Mayorista",
      nombre: "Mayorista",
      emoji: "📦"
      
    },
  ],

  // PRODUCTOS
  productos: [

    {
      nombre: "Chipá",
      descripcion: "Sabor tradicional del litoral. Disponible horneado o congelado.",
      precio: 7000,
      categoria: "Minorista",
      icon: "fa-solid fa-cheese"
    },

    {
      nombre: "Chipá Mayorista",
      descripcion: "Solo congelado. Pedido mínimo 3 KG. Ideal para cafeterías y reventa.",
      precio: 49500,
      categoria: "Mayorista",
      icon: "fa-solid fa-boxes-stacked"
    },

  ]
};