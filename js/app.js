const SUPABASE_URL = "https://fyemmozlzywnfcsyamqn.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Ik5Atc6ct15a3RsmxblRDg_OrqDhqjC";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const SECCIONES = ["Por Kilo", "Por Docena", "Minorista", "Mayorista"];
let productos = [], boxes = [], carrito = [];
let categoriaActiva = "Todo", descuentoAplicado = 0, codigoUsado = "";
let productoActivo = null, opcionSeleccionada = null, cantidadSeleccionada = 1;

const fmt = n => "$" + Number(n || 0).toLocaleString("es-AR");
function toast(msg, tipo = "ok") {
  let c = document.getElementById("toasts");
  if (!c) { c = document.createElement("div"); c.id = "toasts"; c.className = "fixed top-4 inset-x-0 z-[500] flex flex-col items-center gap-2 px-4 pointer-events-none"; document.body.appendChild(c); }
  const e = { ok: ["✓", "bg-verde text-white", "border-verde"], error: ["!", "bg-red-500 text-white", "border-red-500"], info: ["i", "bg-dorado text-black", "border-dorado"] }[tipo];
  const el = document.createElement("div");
  el.className = `pointer-events-auto flex items-center gap-3 bg-white rounded-2xl shadow-xl px-4 py-3 w-full max-w-sm border-2 ${e[2]} transition-all duration-300 opacity-0 -translate-y-3`;
  el.innerHTML = `<span class="w-7 h-7 rounded-full ${e[1]} flex items-center justify-center text-sm font-black flex-shrink-0">${e[0]}</span><p class="text-sm font-bold text-gray-800 flex-1"></p>`;
  el.querySelector("p").textContent = msg;
  c.appendChild(el);
  requestAnimationFrame(() => el.classList.remove("opacity-0", "-translate-y-3"));
  setTimeout(() => { el.classList.add("opacity-0", "-translate-y-3"); setTimeout(() => el.remove(), 300); }, 3000);
}
function avisar(msg, campoId) { // error + marca el campo que falta
  toast(msg, "error");
  const el = campoId && document.getElementById(campoId);
  if (el) { el.focus(); el.classList.add("border-red-500", "ring-2", "ring-red-200"); setTimeout(() => el.classList.remove("border-red-500", "ring-2", "ring-red-200"), 2500); }
}
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

document.addEventListener("DOMContentLoaded", async () => {
  renderZonas();
  renderPagos();
  document.getElementById("buscador")?.addEventListener("input", renderProductos);
  await cargarDatos();
  renderCategorias();
  renderProductos();
});

// ========== DATOS DESDE SUPABASE ==========
async function cargarDatos() {
  const [p, b] = await Promise.all([
    supabaseClient.from("productos").select("*").eq("activo", true).order("created_at"),
    supabaseClient.from("boxes").select("*").eq("activo", true).order("created_at", { ascending: false })
  ]);
  if (p.error) console.error("productos:", p.error.message);
  if (b.error) console.error("boxes:", b.error.message);
  productos = p.data || [];
  boxes = b.data || [];
}

// ========== CATEGORÍAS ==========
function renderCategorias() {
  const cont = document.getElementById("categorias");
  if (!cont) return;
  const cats = ["Todo", ...(boxes.length ? ["Boxes"] : []), ...SECCIONES];
  cont.innerHTML = cats.map(c => `
    <button onclick="filtrar('${c}')" class="flex-shrink-0 px-5 py-2 rounded-full border text-sm transition-colors ${c === categoriaActiva ? "bg-dorado text-black font-extrabold" : ""}">${c}</button>`).join("");
}
function filtrar(id) { categoriaActiva = id; renderCategorias(); renderProductos(); }

// ========== CARDS ==========
function crearCardBox(b) {
  const cupos = Math.max(0, b.cupos_totales - b.vendidos), hay = cupos > 0;
  const precio = hay ? b.precio_oferta : b.precio_regular;
  return `
  <div class="flex-none w-[260px] sm:w-[280px] snap-start bg-white rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between border border-gray-100 p-3 relative">
    <div class="w-full h-44 bg-slate-50 rounded-xl overflow-hidden relative">
      <span class="absolute top-2 left-2 text-[10px] font-bold ${hay ? "bg-pink-500" : "bg-gray-600"} text-white px-2 py-0.5 rounded-full z-10 shadow-sm">${hay ? esc(b.evento || "Oferta") : "Precio Regular"}</span>
      ${b.imagen ? `<img src="${esc(b.imagen)}" alt="${esc(b.nombre)}" class="w-full h-full object-cover">` : `<div class="w-full h-full flex items-center justify-center text-5xl">🎁</div>`}
    </div>
    <div class="mt-3 flex flex-col gap-1 px-1">
      <h3 class="font-bold text-gray-900 text-base uppercase tracking-wide leading-tight">${esc(b.nombre)}</h3>
      <p class="text-xs text-gray-500 leading-snug">${esc(b.contenido)}</p>
      <div class="mt-1 flex items-center gap-2">
        <span class="text-sm font-extrabold ${hay ? "text-pink-600" : "text-gray-800"}">${fmt(precio)}</span>
        ${hay ? `<span class="text-xs text-gray-400 line-through">${fmt(b.precio_regular)}</span>` : ""}
      </div>
      <span class="text-[10px] font-bold ${hay ? "text-pink-600 bg-pink-50" : "text-gray-500 bg-gray-100"} px-2 py-0.5 rounded-full w-fit">${hay ? `🔥 Quedan ${cupos} cupos con descuento` : "❌ Cupos agotados (Precio regular)"}</span>
    </div>
    <button onclick="pedirBox(${b.id})" class="mt-4 w-full py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition active:scale-95 flex items-center justify-center gap-2 shadow-sm">
      <i class="fa-brands fa-whatsapp text-sm"></i> PEDIR BOX POR WHATSAPP
    </button>
  </div>`;
}

function crearCardProducto(p) {
  const vars = p.variantes || [];
  const badges = vars.map(v => `<span class="text-[10px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">${esc(v.label)}</span>`).join(" ");
  return `
  <div class="flex-none w-[260px] sm:w-[280px] snap-start bg-white rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between border border-gray-100 p-3">
    <div class="w-full h-44 bg-slate-50 rounded-xl overflow-hidden">
      <img src="${esc(p.imagen)}" alt="${esc(p.nombre)}" class="w-full h-full object-cover">
    </div>
    <div class="mt-3 flex flex-col gap-1 px-1">
      <h3 class="font-bold text-gray-900 text-base uppercase tracking-wide leading-tight">${esc(p.nombre)}</h3>
      <p class="text-xs text-gray-500 line-clamp-2 leading-snug">${esc(p.descripcion || "Sabor tradicional del litoral con blend de quesos.")}</p>
      ${badges ? `<div class="mt-2 flex flex-wrap gap-1"><span class="text-[9px] uppercase font-bold text-gray-400 w-full">Opciones disponibles:</span>${badges}</div>` : ""}
    </div>
    <button onclick="abrirModalVariantes('${esc(p.id)}')" class="mt-4 w-full py-2.5 bg-amber-400 hover:bg-amber-500 text-gray-900 rounded-xl text-xs font-black uppercase tracking-wider transition active:scale-95 flex items-center justify-center gap-1.5 shadow-sm">
      <i class="fa-solid fa-cart-shopping"></i> ELEGIR OPCIONES
    </button>
  </div>`;
}

function seccionHTML(titulo, cards) {
  return `<div class="mt-8">
    <h2 class="font-playfair text-2xl text-dorado font-bold uppercase tracking-wider mb-4 border-b border-dorado/20 pb-1 px-1">${titulo}</h2>
    <div class="flex gap-6 overflow-x-auto hide-scrollbar pb-6 pt-2 snap-x snap-mandatory">${cards}</div></div>`;
}

function renderProductos() {
  const cont = document.getElementById("productos");
  if (!cont) return;
  const texto = document.getElementById("buscador")?.value.trim().toLowerCase() || "";
  const coincide = (...campos) => !texto || campos.some(c => (c || "").toLowerCase().includes(texto));
  let html = "";

  if (categoriaActiva === "Todo" || categoriaActiva === "Boxes") {
    const bx = boxes.filter(b => coincide(b.nombre, b.contenido, b.evento));
    if (bx.length) html += seccionHTML("Boxes y Cajas Especiales", bx.map(crearCardBox).join(""));
  }
  SECCIONES.forEach(sec => {
    if (categoriaActiva !== "Todo" && categoriaActiva !== sec) return;
    const ps = productos.filter(p => p.categoria === sec && coincide(p.nombre, p.descripcion));
    if (ps.length) html += seccionHTML(sec, ps.map(crearCardProducto).join(""));
  });
  cont.innerHTML = html || `<p class="text-center text-sm mt-10">No hay productos para mostrar.</p>`;
}

// ========== BOX -> WHATSAPP ==========
async function pedirBox(id) {
  const b = boxes.find(x => x.id === id);
  if (!b) return;
  const win = window.open("", "_blank"); // evita bloqueo de pop-ups en celular
  const { data: huboCupo } = await supabaseClient.rpc("reservar_box", { p_id: id });
  const precio = huboCupo ? b.precio_oferta : b.precio_regular;
  const mensaje = `Hola! Quiero pedir mi box: *${b.nombre}* ${huboCupo ? "(Precio oferta)" : "(Precio regular)"} — ${fmt(precio)}`;

  await supabaseClient.from("pedidos").insert({
    cliente_nombre: "Box por WhatsApp", tipo: "Box", items: [{ nombre: b.nombre, precio, categoria: "Box" }], total: precio
  });

  const url = `https://wa.me/${CONFIG.telefonoPromo || CONFIG.telefono}?text=${encodeURIComponent(mensaje)}`;
  if (win) win.location.href = url; else window.location.href = url;
  await cargarDatos();
  renderCategorias();
  renderProductos();
}

// ========== MODAL VARIANTES ==========
function abrirModalVariantes(prodId) {
  const prod = productos.find(p => p.id === prodId);
  if (!prod) return;
  productoActivo = prod; opcionSeleccionada = null; cantidadSeleccionada = 1;
  document.getElementById("variantesTitulo").innerText = prod.nombre;
  document.getElementById("cantidadVarianteSeccion").classList.add("hidden");
  renderOpcionesModal();
  document.getElementById("modalVariantes").classList.remove("hidden");
}

function renderOpcionesModal() {
  const cont = document.getElementById("opcionesVariantes");
  if (!cont || !productoActivo) return;
  cont.innerHTML = (productoActivo.variantes || []).map(op => {
    const sel = opcionSeleccionada && opcionSeleccionada.id === op.id;
    const clases = sel ? "bg-verdeClaro text-white border-verdeClaro" : "bg-[#142A13] text-white border-dorado/20 hover:bg-verdeClaro/50";
    return `<button onclick="seleccionarOpcionModal('${esc(op.id)}')" class="flex justify-between items-center px-4 py-3 rounded-xl w-full border text-left transition-colors ${clases}">
      <div><span class="font-bold text-sm block">${esc(op.label)}</span>
      ${op.sublabel ? `<span class="block text-xs text-dorado font-normal mt-0.5">${esc(op.sublabel)}</span>` : ""}</div>
      <span class="text-dorado font-extrabold text-sm ml-2">${fmt(op.precio)}</span></button>`;
  }).join("");
}

function seleccionarOpcionModal(opId) {
  if (!productoActivo) return;
  opcionSeleccionada = productoActivo.variantes.find(o => o.id === opId) || null;
  cantidadSeleccionada = 1;
  renderOpcionesModal();
  if (opcionSeleccionada) {
    actualizarResumenModal();
    document.getElementById("cantidadVarianteSeccion").classList.remove("hidden");
  }
}
function cambiarCantidadModal(d) {
  if (!opcionSeleccionada) return;
  cantidadSeleccionada = Math.max(1, cantidadSeleccionada + d);
  actualizarResumenModal();
}
function actualizarResumenModal() {
  document.getElementById("cantidadVarianteTexto").innerText = cantidadSeleccionada;
  document.getElementById("totalVariante").innerText = fmt(opcionSeleccionada.precio * cantidadSeleccionada);
}
function confirmarVariante() {
  if (!opcionSeleccionada || !productoActivo) return;
  carrito.push({
    nombre: `${productoActivo.nombre} (${opcionSeleccionada.label}) x${cantidadSeleccionada}`,
    precio: opcionSeleccionada.precio * cantidadSeleccionada,
    categoria: productoActivo.categoria
  });
  actualizarContador();
  cerrarModalVariantes();
  toast("Agregado al carrito 🛒");
}
function cerrarModalVariantes() {
  document.getElementById("modalVariantes").classList.add("hidden");
  productoActivo = null; opcionSeleccionada = null; cantidadSeleccionada = 1;
}

// ========== ZONAS Y PAGOS ==========
function renderZonas() {
  const select = document.getElementById("zona");
  if (!select) return;
  select.innerHTML = CONFIG.zonas.map(z => {
    const label = typeof z.costo === "number" ? (z.costo === 0 ? `${z.nombre} (Gratis)` : `${z.nombre} — $${z.costo}`) : `${z.nombre} — ${z.costo}`;
    return `<option value="${esc(z.nombre)}">${esc(label)}</option>`;
  }).join("");
}

function renderPagos() {
  const cont = document.getElementById("metodosPago");
  if (!cont) return;
  let html = "";
  if (CONFIG.pagos.efectivo) html += `<label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="pago" value="Efectivo" checked class="accent-verdeClaro"><span class="text-gray-700 text-sm font-medium">💵 Efectivo</span></label>`;
  if (CONFIG.pagos.transferencia) html += `<label class="flex items-center gap-2 cursor-pointer mt-2"><input type="radio" name="pago" value="Transferencia" class="accent-verdeClaro"><span class="text-gray-700 text-sm font-medium">📲 Transferencia</span></label>`;
  cont.innerHTML = html;
  cont.querySelectorAll('input[name="pago"]').forEach(radio => {
    radio.addEventListener("change", () => {
      const info = document.getElementById("aliasInfo");
      if (radio.value === "Transferencia" && radio.checked) {
        document.getElementById("aliasTexto").innerText = CONFIG.pagos.alias;
        info?.classList.remove("hidden");
      } else info?.classList.add("hidden");
    });
  });
}

function toggleDelivery() {
  const t = document.getElementById("tipo").value;
  document.getElementById("seccionDelivery")?.classList.toggle("hidden", t !== "Delivery");
  document.getElementById("seccionRetiro")?.classList.toggle("hidden", t === "Delivery");
}

// ========== CARRITO Y CHECKOUT ==========
function actualizarContador() { document.getElementById("contador").innerText = carrito.length; }

function abrirCarrito() {
  if (carrito.length === 0) { toast("Todavía no agregaste productos 🛒", "info"); return; }
  const total = carrito.reduce((a, p) => a + p.precio, 0);
  document.getElementById("listaCarrito").innerHTML = carrito.map((p, i) => `
    <div class="flex justify-between items-center py-3 border-b border-gray-100 gap-3">
      <div class="flex-1 min-w-0">
        <p class="text-gray-900 font-bold text-sm leading-snug break-words">${esc(p.nombre)}</p>
        <p class="text-amber-600 font-extrabold text-xs mt-0.5">${fmt(p.precio)}</p>
      </div>
      <button onclick="eliminarItem(${i})" class="w-8 h-8 rounded-full bg-red-100 text-red-500 hover:bg-red-200 flex items-center justify-center flex-shrink-0 transition"><i class="fa-solid fa-trash-can text-xs"></i></button>
    </div>`).join("");
  document.getElementById("totalCarrito").innerText = fmt(total);
  document.getElementById("modalCarrito").classList.remove("hidden");
}

function eliminarItem(i) {
  carrito.splice(i, 1);
  actualizarContador();
  if (codigoUsado) aplicarCupon();
  carrito.length === 0 ? cerrarCarrito() : abrirCarrito();
}
function cerrarCarrito() { document.getElementById("modalCarrito").classList.add("hidden"); }
function cerrarCarritoYFormulario() {
  cerrarCarrito();
  descuentoAplicado = 0; codigoUsado = "";
  document.getElementById("modal").classList.remove("hidden");
}
function cerrarFormulario() { document.getElementById("modal").classList.add("hidden"); }

// Cupones (el bloque HTML del cupón está comentado en index.html: descomentalo para usarlo)
async function aplicarCupon() {
  const input = document.getElementById("cupon");
  if (!input) return;
  const codigo = input.value.trim().toUpperCase() || codigoUsado;
  const msg = document.getElementById("mensajeCupon"), resumen = document.getElementById("resumenDescuento");
  msg?.classList.remove("hidden");
  const { data: pct } = await supabaseClient.rpc("validar_cupon", { p_codigo: codigo });

  if (pct) {
    descuentoAplicado = pct; codigoUsado = codigo;
    const subtotal = carrito.reduce((a, p) => a + p.precio, 0);
    const monto = Math.round(subtotal * pct / 100);
    if (msg) { msg.innerText = `✅ Cupón aplicado — ${pct}% OFF`; msg.className = "text-xs mt-2 font-bold text-green-600"; }
    document.getElementById("subtotalSinDesc").innerText = fmt(subtotal);
    document.getElementById("labelDescuento").innerText = `Descuento ${pct}%`;
    document.getElementById("montoDescuento").innerText = `-${fmt(monto)}`;
    document.getElementById("totalConDesc").innerText = fmt(subtotal - monto);
    resumen?.classList.remove("hidden");
  } else {
    descuentoAplicado = 0; codigoUsado = "";
    if (msg) { msg.innerText = "❌ Código inválido o expirado"; msg.className = "text-xs mt-2 font-bold text-red-500"; }
    resumen?.classList.add("hidden");
  }
}

async function enviarPedido() {
  const nombre = document.getElementById("nombre").value.trim();
  const apellido = document.getElementById("apellido").value.trim();
  const direccion = document.getElementById("direccion").value.trim();
  const tipo = document.getElementById("tipo").value;
  const pago = document.querySelector('input[name="pago"]:checked')?.value;
  const selZona = document.getElementById("zona");
  const zonaTexto = selZona?.options[selZona.selectedIndex]?.text || "";

  if (!nombre || !apellido) { avisar("Completá tu nombre y apellido.", !nombre ? "nombre" : "apellido"); return; }
  if (tipo === "Delivery" && !direccion) { avisar("Ingresá tu dirección para el envío.", "direccion"); return; }
  if (!pago) { avisar("Seleccioná un método de pago."); return; }
  if (carrito.length === 0) { toast("El carrito está vacío.", "info"); return; }

  const win = window.open("", "_blank");
  const subtotal = carrito.reduce((a, x) => a + x.precio, 0);
  const monto = Math.round(subtotal * descuentoAplicado / 100);
  const totalFinal = subtotal - monto;

  // Guardar el pedido para que aparezca en el panel
  const { error } = await supabaseClient.from("pedidos").insert({
    cliente_nombre: `${nombre} ${apellido}`, tipo, pago,
    direccion: tipo === "Delivery" ? direccion : null,
    zona: tipo === "Delivery" ? zonaTexto : null,
    items: carrito.map(x => ({ nombre: x.nombre, precio: x.precio, categoria: x.categoria })),
    total: totalFinal
  });
  if (error) console.error("No se pudo guardar el pedido:", error.message);

  let m = `*Pachipá - Nuevo Pedido*\n━━━━━━━━━━━━━━━\n👤 *Cliente:* ${nombre} ${apellido}\n📦 *Método:* ${tipo}\n💳 *Pago:* ${pago}\n`;
  if (pago === "Transferencia" && CONFIG.pagos.alias) m += `📌 *Alias para transferir:* ${CONFIG.pagos.alias}\n`;
  m += tipo === "Delivery" ? `📍 *Dirección:* ${direccion}\n🗺️ *Zona:* ${zonaTexto}\n` : `🏠 *Retiro en local*\n`;
  m += `\n🍴 *Productos:*\n` + carrito.map(x => `• ${x.nombre} — ${fmt(x.precio)}\n`).join("");
  m += `\n━━━━━━━━━━━━━━━\n🧾 *Subtotal:* ${fmt(subtotal)}\n`;
  if (descuentoAplicado > 0) m += `🎟️ *Cupón (${codigoUsado}):* -${fmt(monto)} (${descuentoAplicado}% off)\n`;
  m += `💰 *Total Final: ${fmt(totalFinal)}*`;

  const url = `https://wa.me/${CONFIG.telefono}?text=${encodeURIComponent(m)}`;
  if (win) win.location.href = url; else window.location.href = url;
  setTimeout(() => location.reload(), 500);
}