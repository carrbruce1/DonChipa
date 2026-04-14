const CONFIG = {

  nombre:   "Don Chipá",
  telefono: "NUMERO_ACA", // sin + ni espacios

  moneda: "$",

  pagos: {
    efectivo: true,
    transferencia: true,
    alias: "ALIAS_ACA"
  },

  zonas: [
    { nombre: "Centro",     costo: 0    },
    { nombre: "Zona Norte", costo: 2000 },
    { nombre: "Zona Sur",   costo: 2000 },
    { nombre: "Zona Oeste", costo: 3000 },
    { nombre: "Afueras",    costo: 5000 },
  ],

  // ────────────────
  // MINORISTA
  // ────────────────
  minoristaOpciones: [
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