const CONFIG = {

  nombre:   "Don Chipá",
  telefono: "5493454175555",

  moneda: "$",

  pagos: {
    efectivo:      true,
    transferencia: true,
    alias:         "Donmateochipa"
  },

  // ─────────────────────────────────────────
  //  CUPONES
  //  "CODIGO": porcentaje de descuento
  //  Para desactivar uno, poné active: false
  //  Para agregar uno nuevo, copiá una línea
  // ─────────────────────────────────────────
  cupones: {
    "MOREIRA TV":   { descuento: 10, active: true  },
    "BOCAHIJO": {descuento: 50, active: true },
    // "INFLUENCER10": { descuento: 10, active: true  },
    // "PROMO5":       { descuento: 5,  active: true  },
    // "VERANO15":  { descuento: 15, active: false },  ← ejemplo desactivado
  },

  zonas: [
    { nombre: "Villa Urquiza y Alrededores", costo: 0           },
    { nombre: "Afueras",                     costo: "Consultar" },
  ],

  // ────────────────
  //  MINORISTA
  // ────────────────
  minoristaOpciones: [
    { id: "2kg",    label: "2 KG",   precio: 40000, personas: "8 a 9 personas" },
    { id: "1kg",    label: "1 KG",   precio: 20000, personas: "4 a 5 personas" },
    { id: "medio",  label: "1/2 KG", precio: 12000, personas: "2 a 3 personas" },
    { id: "cuarto", label: "1/4 KG", precio: 7000,  personas: "1 a 2 personas" },
  ],

  // ────────────────
  //  MAYORISTA
  // ────────────────
  mayoristaOpciones: [
    { id: "3kg",  label: "3 KG",  precio: 49500  },
    { id: "5kg",  label: "5 KG",  precio: 82500  },
    { id: "10kg", label: "10 KG", precio: 165000 },
  ],

  categorias: [
    { id: "Minorista", nombre: "Minorista", emoji: "🛍️" },
    { id: "Mayorista", nombre: "Mayorista", emoji: "📦"  },
  ],

  productos: [
    {
      nombre:      "Chipá",
      descripcion: "Sabor tradicional del litoral. Disponible horneado o congelado.",
      precio:      7000,
      categoria:   "Minorista",
    },
    {
      nombre:      "Chipá Mayorista",
      descripcion: "Solo congelado. Pedido mínimo 3 KG. Ideal para cafeterías y reventa.",
      precio:      49500,
      categoria:   "Mayorista",
    },
  ]
};