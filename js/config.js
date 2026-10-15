// Los productos, boxes y cupones ahora se cargan desde Supabase (panel de admin).
const CONFIG = {
  nombre: "Pachipá",
  telefono: "5493454175555",
  telefonoPromo: "5491168531675",
  moneda: "$",
  pagos: {
    efectivo: true,
    transferencia: true,
    alias: "pachipas"
  },
  zonas: [
    { nombre: "Take away: Palermo", costo: 0 },
    { nombre: "Take away: Saavedra", costo: 0 },
    { nombre: "Take away: San Isidro", costo: "Con cargo" },
    { nombre: "Take away: Obelisco", costo: 0 },
    { nombre: "Otras zonas", costo: "Con cargo" }
  ]
};