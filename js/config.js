const CONFIG = {
  nombre: "Pachipá",
  telefono: "5493454175555",
  moneda: "$",
  telefonoPromo: 5491168531675,
  pagos: {
    efectivo: true,
    transferencia: true,
    alias: "pachipas"
  },

  cupones: {
    "MOREIRA TV": { descuento: 10, active: true },
    "MOREIRATV": { descuento: 10, active: true },
    "BOCAHIJO": { descuento: 50, active: true }
  },

  zonas: [
    { nombre: "Take away: Palermo", costo: 0 },
    { nombre: "Take away: Saavedra", costo: 0 },
    { nombre: "Take away: San Isidro", costo: "Con cargo"},
    { nombre: "Take away: Obelisco", costo: 0 },
    { nombre: "Otras zonas ", costo: "Con cargo" }
  ],

  categorias: [
    { id: "Por Kilo", nombre: "Por Kilo", emoji: "⚖️" },
    { id: "Por Docena", nombre: "Por Docena", emoji: "🥐" },
    { id: "Minorista", nombre: "Minorista", emoji: "🛍️" },
    { id: "Mayorista", nombre: "Mayorista", emoji: "📦" },
    {id: "combo", nombre: "Combos"}
  ],
 preventaMama: {
    cuposTotales: 10,
    precioPreventa: 35000,
    precioRegular: 40000,
    fechaLimite: "Jueves 15 de Octubre"
  },

  productos: [
    // ── SECCIÓN: POR KILO ──
    {
      id: "chipa-tradicional",
      nombre: "Chipá Tradicional",
      descripcion: "Sabor tradicional del litoral con blend de quesos.",
      categoria: "Por Kilo",
      imagen: "img/chipas/chipat.jpeg",
      isNew: false,
      variantes: [
        { id: "cuarto", label: "1/4 KG", precio: 7000 },
        { id: "medio",  label: "1/2 KG", precio: 12000 },
        { id: "1kg",    label: "1 KG",   precio: 20000 }
      ]
    },
    {
      id: "chipa-cubo",
      nombre: "Chipá Cubo",
      descripcion: "Presentación en cubos super crocantes por fuera.",
      categoria: "Por Kilo",
      imagen: "img/chipas/chipac.jpeg",
      isNew: false,
      variantes: [
        { id: "cuarto", label: "1/4 KG", precio: 8000 },
        { id: "medio",  label: "1/2 KG", precio: 13000 },
        { id: "1kg",    label: "1 KG",   precio: 23000 }
      ]
    },
    {
      id: "chipa-roquefort",
      nombre: "Chipá & Roquefort",
      descripcion: "Intenso sabor a queso azul para los más exigentes.",
      categoria: "Por Kilo",
      imagen: "img/chipas/chipar.jpg",
      isNew: false,
      variantes: [
        { id: "cuarto", label: "1/4 KG", precio: 8000 },
        { id: "medio",  label: "1/2 KG", precio: 15000 },
        { id: "1kg",    label: "1 KG",   precio: 27000 }
      ]
    },

    // ── SECCIÓN: POR DOCENA ──
    {
      id: "chipa-baston",
      nombre: "Chipá Bastón",
      descripcion: "Formato alargado, suave por dentro.",
      categoria: "Por Docena",
      imagen: "img/chipas/chipab.png",
      isNew: false,
      variantes: [
        { id: "1u",  label: "1 Unidad",    precio: 2500 },
        { id: "6u",  label: "6 Unidades",  precio: 12000 },
        { id: "12u", label: "12 Unidades", precio: 20000 }
      ]
    },
    {
      id: "chipa-palillo",
      nombre: "Chipá Palillo",
      descripcion: "Bocado fino e ideal para acompañar el mate.",
      categoria: "Por Docena",
      imagen: "img/chipas/palillo.png",
      isNew: false,
      variantes: [
        { id: "1u",  label: "1 Unidad",    precio: 2000 },
        { id: "6u",  label: "6 Unidades",  precio: 10000 },
        { id: "12u", label: "12 Unidades", precio: 18000 }
      ]
    },
    {
      id: "chipanwich",
      nombre: "Chipánwich",
      descripcion: "Nuestro exclusivo sándwich con tapas de chipá.",
      categoria: "Por Docena",
      imagen: "img/chisan.jpeg",
      isNew: false,
      variantes: [
        { id: "1u",  label: "1 Unidad",    precio: 4000 },
        { id: "6u",  label: "6 Unidades",  precio: 21000 },
        { id: "12u", label: "12 Unidades", precio: 36000 }
      ]
    },
    // Combo: dia de la madre
    {
      id: "combo-dia-madre",
      nombre: "Combo Día de la Madre 💐",
      descripcion: "Incluye: 5 Chipá Tradicional, 5 Chipá Queso Azul, 4 Bastones, 2 Chipánwich, Jugo de naranja exprimido, Tarjeta personalizada y Presentación especial Pachipá.",
      categoria: "Especial Mama",
      imagen: "img/productos/combom.png",
      isNew: true,
      esComboMama: true,
    },

    // ── SECCIÓN: MINORISTA ──
    {
      id: "combo-minorista-classic",
      nombre: "Pack Minorista Clásico",
      descripcion: "Bolsitas individuales para consumo personal.",
      categoria: "Minorista",
      imagen: "img/chipas/chipaminorista.jpeg",
      isNew: false,
      variantes: [
        { id: "pack-1", label: "Bolsa 2kg", precio: 40000 },
        { id: "pack-2", label: "Bolsa 1kg", precio: 20000 },
        { id: "pack-3", label: "Bolsa 1/2kg", precio: 12000 },
        { id: "pack-4", label: "Bolsa 1/4kg", precio: 7000 }
      ]
    },

    // ── SECCIÓN: MAYORISTA ──
    {
      id: "caja-mayorista-crudo",
      nombre: "Caja Chipá Congelado",
      descripcion: "Cajas por mayor listos para hornear en locales o eventos.",
      categoria: "Mayorista",
      imagen: "img/chipas/chipafrio.jpeg",
      isNew: false,
      variantes: [
        { id: "caja-3kg",  label: "3 KG Congelado",  precio: 54000 },
        { id: "caja-6kg",  label: "6 KG Congelado",  precio: 105000 },
        { id: "caja-9kg",  label: "9 KG Congelado",  precio: 158000 },
        { id: "caja-12kg", label: "12 KG Congelado", precio: 210000 },
        { id: "caja-15kg", label: "15 KG Congelado", precio: 262500 },
        { id: "caja-20kg", label: "20 KG Congelado", precio: 340000 },
        { 
          id: "caja-21kg", 
          label: "21 KG o Más Congelado", 
          sublabel: "$17000 por cada kilo extra", 
          precio: 17000 
        }
      ]
    }
  ]
};