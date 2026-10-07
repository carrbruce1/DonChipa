const SUPABASE_URL = "https://fyemmozlzywnfcsyamqn.supabase.co"; 
const SUPABASE_ANON_KEY = "sb_publishable_Ik5Atc6ct15a3RsmxblRDg_OrqDhqjC";  

const supabaseClient = window.supabase
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// State Global
let carrito = [];
let categoriaActiva = "Todo";
let descuentoAplicado = 0;
let codigoUsado = "";

// Estado Modal Variantes
let productoActivo = null;
let opcionSeleccionada = null;
let cantidadSeleccionada = 1;

document.addEventListener("DOMContentLoaded", async () => {
  renderCategorias();
  await renderProductos();
  renderZonas();
  renderPagos();
  document.getElementById("buscador")?.addEventListener("input", buscar);
});

// ==========================================
// CONTROL DE CUPOS EN SUPABASE
// ==========================================
async function obtenerCuposRestantes() {
  if (!supabaseClient) return CONFIG.preventaMama?.cuposTotales || 10;
  try {
    const { data, error } = await supabaseClient
      .from("promociones")
      .select("cupos")
      .eq("id", "combo-mama")
      .single();

    if (error || !data) {
      console.error("Error al obtener cupos desde Supabase:", error);
      return CONFIG.preventaMama?.cuposTotales || 10;
    }
    return data.cupos;
  } catch (err) {
    console.error("Error de conexión con Supabase:", err);
    return CONFIG.preventaMama?.cuposTotales || 10;
  }
}

async function descontarCupoPreventa() {
  if (!supabaseClient) return;
  try {
    const cuposActuales = await obtenerCuposRestantes();
    if (cuposActuales > 0) {
      const { error } = await supabaseClient
        .from("promociones")
        .update({ cupos: cuposActuales - 1 })
        .eq("id", "combo-mama")
        .select();

      if (error) {
        console.error("Error de permisos/update en Supabase:", error.message);
      }
    }
  } catch (err) {
    console.error("Error al descontar cupo:", err);
  }
}

// ==========================================
// CATEGORÍAS
// ==========================================
function renderCategorias() {
  const cont = document.getElementById("categorias");
  if (!cont) return;
  cont.innerHTML = "";
  const todas = [{ id: "Todo", nombre: "Todo" }, ...CONFIG.categorias];
  todas.forEach(cat => {
    const activa = cat.id === categoriaActiva
      ? "bg-dorado text-black font-extrabold"
      : "bg-transparent text-doradoClaro border-dorado/40";
    cont.innerHTML += `
      <button onclick="filtrar('${cat.id}')"
        class="flex-shrink-0 px-5 py-2 rounded-full border text-sm transition-colors ${activa}">
        ${cat.nombre}
      </button>`;
  });
}

function filtrar(id) {
  categoriaActiva = id;
  renderCategorias();
  renderProductos();
}

// ==========================================
// CARDS DE PRODUCTO Y RENDER
// ==========================================
function crearCardProducto(p, cuposRestantes = 10) {
  if (p.esComboMama || p.telefonoWhatsApp) {
    const tieneCupos = cuposRestantes > 0;
    const precioPreventa = CONFIG.preventaMama?.precioPreventa;
    const precioRegular = CONFIG.preventaMama?.precioRegular;

    const badgeCupos = tieneCupos
      ? `<span class="text-[10px] font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full">🔥 Quedan ${cuposRestantes} cupos con descuento</span>`
      : `<span class="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">❌ Cupos agotados (Precio regular)</span>`;

    const badgeSuperior = tieneCupos
      ? `<span class="absolute top-2 left-2 text-[10px] font-bold bg-pink-500 text-white px-2 py-0.5 rounded-full z-10 shadow-sm">Preventa OFF</span>`
      : `<span class="absolute top-2 left-2 text-[10px] font-bold bg-gray-600 text-white px-2 py-0.5 rounded-full z-10 shadow-sm">Precio Regular</span>`;

    const textoPrecios = (precioPreventa && precioRegular) 
      ? (tieneCupos 
          ? `<div class="mt-1 flex items-center gap-2">
               <span class="text-sm font-extrabold text-pink-600">$${precioPreventa.toLocaleString()}</span>
               <span class="text-xs text-gray-400 line-through">$${precioRegular.toLocaleString()}</span>
             </div>`
          : `<div class="mt-1">
               <span class="text-sm font-extrabold text-gray-800">$${precioRegular.toLocaleString()}</span>
             </div>`)
      : "";

    return `
      <div class="flex-none w-[260px] sm:w-[280px] snap-start bg-white rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between border border-gray-100 p-3 relative">
        <div class="w-full h-44 bg-slate-50 rounded-xl overflow-hidden relative">
          ${badgeSuperior}
          <img src="${p.imagen}" alt="${p.nombre}" class="w-full h-full object-cover">
        </div>

        <div class="mt-3 flex flex-col gap-1 px-1">
          <h3 class="font-bold text-gray-900 text-base uppercase tracking-wide leading-tight">${p.nombre}</h3>
          <p class="text-xs text-gray-500 line-clamp-2 leading-snug">${p.descripcion || 'Edición especial'}</p>
          
          ${textoPrecios}

          <div class="mt-2 flex items-center justify-between">
            ${badgeCupos}
          </div>
        </div>

        <button onclick="pedirBoxDirectoWhatsApp('${p.id}')"
          class="mt-4 w-full py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition active:scale-95 flex items-center justify-center gap-2 shadow-sm">
          <i class="fa-brands fa-whatsapp text-sm"></i> PEDIR BOX POR WHATSAPP
        </button>
      </div>`;
  }

  const badgesVariantes = p.variantes && p.variantes.length > 0 
    ? p.variantes.map(v => `<span class="text-[10px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">${v.label}</span>`).join(" ")
    : "";

  return `
    <div class="flex-none w-[260px] sm:w-[280px] snap-start bg-white rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between border border-gray-100 p-3">
      <div class="w-full h-44 bg-slate-50 rounded-xl overflow-hidden">
        <img src="${p.imagen}" alt="${p.nombre}" class="w-full h-full object-cover">
      </div>

      <div class="mt-3 flex flex-col gap-1 px-1">
        <h3 class="font-bold text-gray-900 text-base uppercase tracking-wide leading-tight">${p.nombre}</h3>
        <p class="text-xs text-gray-500 line-clamp-2 leading-snug">${p.descripcion || 'Sabor tradicional del litoral con blend de quesos.'}</p>

        ${badgesVariantes ? `
          <div class="mt-2 flex flex-wrap gap-1">
            <span class="text-[9px] uppercase font-bold text-gray-400 w-full">Opciones disponibles:</span>
            ${badgesVariantes}
          </div>
        ` : ""}
      </div>

      <button onclick="abrirModalVariantes('${p.id}')"
        class="mt-4 w-full py-2.5 bg-amber-400 hover:bg-amber-500 text-gray-900 rounded-xl text-xs font-black uppercase tracking-wider transition active:scale-95 flex items-center justify-center gap-1.5 shadow-sm">
        <i class="fa-solid fa-cart-shopping"></i> ELEGIR OPCIONES
      </button>
    </div>`;
}

async function renderProductos(lista = CONFIG.productos) {
  const cont = document.getElementById("productos");
  if (!cont) return;
  cont.innerHTML = "";

  const cuposGlobales = await obtenerCuposRestantes();

  const texto = document.getElementById("buscador")?.value.trim().toLowerCase() || "";
  let filtrados = lista;

  if (categoriaActiva !== "Todo") {
    filtrados = filtrados.filter(p => p.categoria === categoriaActiva);
  }

  if (texto !== "") {
    filtrados = filtrados.filter(p =>
      p.nombre.toLowerCase().includes(texto) ||
      (p.descripcion && p.descripcion.toLowerCase().includes(texto))
    );
  }

  const secciones = ["Especial Mama", "Combos Especiales", "Por Kilo", "Por Docena", "Minorista", "Mayorista"];

  secciones.forEach(secNombre => {
    const prods = filtrados.filter(p => p.categoria === secNombre);
    if (prods.length === 0) return;

    const cardsHtml = prods.map(p => crearCardProducto(p, cuposGlobales)).join("");

    const divSec = document.createElement("div");
    divSec.className = "mt-8";
    divSec.innerHTML = `
      <h2 class="font-playfair text-2xl text-dorado font-bold uppercase tracking-wider mb-4 border-b border-dorado/20 pb-1 px-1">
        ${secNombre === "Especial Mama" ? "Especial Día de la Madre" : secNombre}
      </h2>
      <div class="flex gap-6 overflow-x-auto hide-scrollbar pb-6 pt-2 snap-x snap-mandatory">
        ${cardsHtml}
      </div>`;
    cont.appendChild(divSec);
  });
}

function buscar() { renderProductos(); }

// ==========================================
// REDIRECCIÓN DIRECTA A WHATSAPP
// ==========================================
async function pedirBoxDirectoWhatsApp(prodId) {
  const prod = CONFIG.productos.find(p => p.id === prodId);
  if (!prod) return;

  // 1. Abrimos la ventana inmediatamente al hacer clic (evita bloqueo de pop-ups en celulares)
  const win = window.open("", "_blank");

  const cuposRestantes = await obtenerCuposRestantes();
  const tieneCupos = cuposRestantes > 0;

  // 2. Descontamos el cupo en Supabase
  if (prod.esComboMama && tieneCupos) {
    await descontarCupoPreventa();
  }

  // 3. Armamos el mensaje
  const telefonoDestino = prod.telefonoWhatsApp || CONFIG.telefonoPromo || CONFIG.telefono;
  const textoBase = prod.mensajePredeterminado || "Quiero pedir mi box";
  const estadoPrecio = tieneCupos ? "(Aprovechando precio preventa)" : "(Precio regular)";

  const mensaje = `Hola! ${textoBase}: *${prod.nombre}* ${estadoPrecio}`;
  const textoEncoded = encodeURIComponent(mensaje);
  const urlWhatsApp = `https://wa.me/${telefonoDestino}?text=${textoEncoded}`;

  // 4. Redirigimos la ventana previamente abierta a WhatsApp
  if (win) {
    win.location.href = urlWhatsApp;
  } else {
    window.location.href = urlWhatsApp;
  }

  // 5. Re-renderizamos los productos para actualizar el contador en pantalla
  await renderProductos();
}

// ==========================================
// MODAL VARIANTES
// ==========================================
function abrirModalVariantes(prodId) {
  const prod = CONFIG.productos.find(p => p.id === prodId);
  if (!prod) return;

  productoActivo = prod;
  opcionSeleccionada = null;
  cantidadSeleccionada = 1;

  document.getElementById("variantesTitulo").innerText = prod.nombre;
  document.getElementById("cantidadVarianteSeccion").classList.add("hidden");

  renderOpcionesModal();
  document.getElementById("modalVariantes").classList.remove("hidden");
}

function renderOpcionesModal() {
  const cont = document.getElementById("opcionesVariantes");
  if (!cont || !productoActivo) return;
  cont.innerHTML = "";

  productoActivo.variantes.forEach(op => {
    const esSel = opcionSeleccionada && opcionSeleccionada.id === op.id;
    const clases = esSel
      ? "bg-verdeClaro text-white border-verdeClaro"
      : "bg-[#142A13] text-white border-dorado/20 hover:bg-verdeClaro/50";

    const htmlSublabel = op.sublabel 
      ? `<span class="block text-xs text-dorado font-normal mt-0.5">${op.sublabel}</span>`
      : "";

    cont.innerHTML += `
      <button onclick="seleccionarOpcionModal('${op.id}')"
        class="flex justify-between items-center px-4 py-3 rounded-xl w-full border text-left transition-colors ${clases}">
        <div>
          <span class="font-bold text-sm block">${op.label}</span>
          ${htmlSublabel}
        </div>
        <span class="text-dorado font-extrabold text-sm ml-2">$${op.precio.toLocaleString()}</span>
      </button>`;
  });
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

function cambiarCantidadModal(delta) {
  if (!opcionSeleccionada) return;
  cantidadSeleccionada = Math.max(1, cantidadSeleccionada + delta);
  actualizarResumenModal();
}

function actualizarResumenModal() {
  if (!opcionSeleccionada) return;
  document.getElementById("cantidadVarianteTexto").innerText = cantidadSeleccionada;
  const total = opcionSeleccionada.precio * cantidadSeleccionada;
  document.getElementById("totalVariante").innerText = "$" + total.toLocaleString();
}

function confirmarVariante() {
  if (!opcionSeleccionada || !productoActivo) return;

  const varianteTexto = opcionSeleccionada.label ? ` (${opcionSeleccionada.label})` : '';
  const itemNombre = `${productoActivo.nombre}${varianteTexto} x${cantidadSeleccionada}`;

  carrito.push({
    nombre: itemNombre,
    precio: opcionSeleccionada.precio * cantidadSeleccionada,
    esComboMama: !!productoActivo.esComboMama
  });

  actualizarContador();
  cerrarModalVariantes();
}

function cerrarModalVariantes() {
  document.getElementById("modalVariantes").classList.add("hidden");
  productoActivo = null;
  opcionSeleccionada = null;
  cantidadSeleccionada = 1;
}

// ==========================================
// ZONAS Y PAGOS
// ==========================================
function renderZonas() {
  const select = document.getElementById("zona");
  if (!select) return;
  select.innerHTML = "";
  CONFIG.zonas.forEach(z => {
    const label = typeof z.costo === "number"
      ? (z.costo === 0 ? `${z.nombre} (Gratis)` : `${z.nombre} — $${z.costo}`)
      : `${z.nombre} — ${z.costo}`;
    select.innerHTML += `<option value="${z.nombre}">${label}</option>`;
  });
}

function renderPagos() {
  const cont = document.getElementById("metodosPago");
  if (!cont) return;
  let html = "";
  if (CONFIG.pagos.efectivo) {
    html += `
      <label class="flex items-center gap-2 cursor-pointer">
        <input type="radio" name="pago" value="Efectivo" checked class="accent-verdeClaro">
        <span class="text-gray-700 text-sm font-medium">💵 Efectivo</span>
      </label>`;
  }
  if (CONFIG.pagos.transferencia) {
    html += `
      <label class="flex items-center gap-2 cursor-pointer mt-2">
        <input type="radio" name="pago" value="Transferencia" class="accent-verdeClaro">
        <span class="text-gray-700 text-sm font-medium">📲 Transferencia</span>
      </label>`;
  }
  cont.innerHTML = html;
  cont.querySelectorAll('input[name="pago"]').forEach(radio => {
    radio.addEventListener("change", () => {
      const aliasInfo = document.getElementById("aliasInfo");
      const aliasTexto = document.getElementById("aliasTexto");
      if (radio.value === "Transferencia" && radio.checked) {
        if (aliasTexto) aliasTexto.innerText = CONFIG.pagos.alias;
        if (aliasInfo) aliasInfo.classList.remove("hidden");
      } else {
        if (aliasInfo) aliasInfo.classList.add("hidden");
      }
    });
  });
}

function toggleDelivery() {
  const t = document.getElementById("tipo").value;
  document.getElementById("seccionDelivery")?.classList.toggle("hidden", t !== "Delivery");
  document.getElementById("seccionRetiro")?.classList.toggle("hidden", t === "Delivery");
}

// ==========================================
// CARRITO Y CHECKOUT
// ==========================================
function actualizarContador() {
  document.getElementById("contador").innerText = carrito.length;
}

function abrirCarrito() {
  if (carrito.length === 0) {
    alert("Todavía no agregaste productos 🛒");
    return;
  }
  const lista = document.getElementById("listaCarrito");
  if (!lista) return;
  lista.innerHTML = "";
  let total = 0;

  carrito.forEach((p, i) => {
    total += p.precio;
    lista.innerHTML += `
      <div class="flex justify-between items-center py-3 border-b border-gray-100 gap-3">
        <div class="flex-1 min-w-0">
          <p class="text-gray-900 font-bold text-sm leading-snug break-words">${p.nombre}</p>
          <p class="text-amber-600 font-extrabold text-xs mt-0.5">$${p.precio.toLocaleString()}</p>
        </div>
        <button onclick="eliminarItem(${i})" class="w-8 h-8 rounded-full bg-red-100 text-red-500 hover:bg-red-200 flex items-center justify-center flex-shrink-0 transition">
          <i class="fa-solid fa-trash-can text-xs"></i>
        </button>
      </div>`;
  });

  document.getElementById("totalCarrito").innerText = "$" + total.toLocaleString();
  document.getElementById("modalCarrito").classList.remove("hidden");
}

function eliminarItem(i) {
  carrito.splice(i, 1);
  actualizarContador();
  if (codigoUsado) {
    aplicarCupon();
  }
  carrito.length === 0 ? cerrarCarrito() : abrirCarrito();
}

function cerrarCarrito() {
  document.getElementById("modalCarrito").classList.add("hidden");
}

function cerrarCarritoYFormulario() {
  cerrarCarrito();
  descuentoAplicado = 0;
  codigoUsado = "";
  document.getElementById("modal").classList.remove("hidden");
}

function cerrarFormulario() {
  document.getElementById("modal").classList.add("hidden");
}

function aplicarCupon() {
  const cuponInput = document.getElementById("cupon");
  if (!cuponInput) return;

  const input = cuponInput.value.trim().toUpperCase();
  const mensaje = document.getElementById("mensajeCupon");
  const resumen = document.getElementById("resumenDescuento");
  if (mensaje) mensaje.classList.remove("hidden");

  const cupon = CONFIG.cupones[input];

  if (cupon && cupon.active) {
    descuentoAplicado = cupon.descuento;
    codigoUsado = input;

    let subtotal = 0;
    carrito.forEach(p => subtotal += p.precio);
    const monto = Math.round(subtotal * descuentoAplicado / 100);
    const totalFinal = subtotal - monto;

    if (mensaje) {
      mensaje.innerText = `✅ Cupón aplicado — ${descuentoAplicado}% OFF`;
      mensaje.className = "text-xs mt-2 font-bold text-green-600";
    }

    document.getElementById("subtotalSinDesc").innerText = `$${subtotal.toLocaleString()}`;
    document.getElementById("labelDescuento").innerText = `Descuento ${descuentoAplicado}%`;
    document.getElementById("montoDescuento").innerText = `-$${monto.toLocaleString()}`;
    document.getElementById("totalConDesc").innerText = `$${totalFinal.toLocaleString()}`;
    if (resumen) resumen.classList.remove("hidden");
  } else {
    descuentoAplicado = 0;
    codigoUsado = "";
    if (mensaje) {
      mensaje.innerText = "❌ Código inválido o expirado";
      mensaje.className = "text-xs mt-2 font-bold text-red-500";
    }
    if (resumen) resumen.classList.add("hidden");
  }
}

function enviarPedido() {
  const nombre = document.getElementById("nombre").value.trim();
  const apellido = document.getElementById("apellido").value.trim();
  const direccion = document.getElementById("direccion").value.trim();
  const tipo = document.getElementById("tipo").value;
  const pago = document.querySelector('input[name="pago"]:checked')?.value;
  const selectZona = document.getElementById("zona");
  const zonaTexto = selectZona?.options[selectZona.selectedIndex]?.text || "";

  if (!nombre || !apellido) { alert("Completá tu nombre y apellido."); return; }
  if (tipo === "Delivery" && !direccion) { alert("Ingresá tu dirección para el envío."); return; }
  if (!pago) { alert("Seleccioná un método de pago."); return; }

  let subtotal = 0;
  carrito.forEach(x => subtotal += x.precio);
  const monto = Math.round(subtotal * descuentoAplicado / 100);
  const totalFinal = subtotal - monto;

  let mensaje = `*Pachipá - Nuevo Pedido*\n━━━━━━━━━━━━━━━\n`;
  mensaje += `👤 *Cliente:* ${nombre} ${apellido}\n`;
  mensaje += `📦 *Método:* ${tipo}\n`;
  mensaje += `💳 *Pago:* ${pago}\n`;

  if (tipo === "Delivery") {
    mensaje += `📍 *Dirección:* ${direccion}\n`;
    mensaje += `🗺️ *Zona:* ${zonaTexto}\n`;
  } else {
    mensaje += `🏠 *Retiro en local*\n`;
  }

  mensaje += `\n🍴 *Productos:*\n`;
  carrito.forEach(x => {
    mensaje += `• ${x.nombre} — $${x.precio.toLocaleString()}\n`;
  });

  mensaje += `\n━━━━━━━━━━━━━━━\n`;
  mensaje += `🧾 *Subtotal:* $${subtotal.toLocaleString()}\n`;

  if (descuentoAplicado > 0) {
    mensaje += `🎟️ *Cupón (${codigoUsado}):* -$${monto.toLocaleString()} (${descuentoAplicado}% off)\n`;
  }

  mensaje += `💰 *Total Final: $${totalFinal.toLocaleString()}*`;

  const textoEncoded = encodeURIComponent(mensaje);

  window.open(`https://wa.me/${CONFIG.telefono}?text=${textoEncoded}`);
  setTimeout(() => { location.reload(); }, 500);
}