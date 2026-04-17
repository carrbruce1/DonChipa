let carrito = [];
let categoriaActiva = "Todo";
let seleccionPendiente = null;
let descuentoAplicado = 0;
let codigoUsado = "";

document.addEventListener("DOMContentLoaded", () => {
  renderCategorias();
  renderProductos();
  renderZonas();
  renderPagos();
  document.getElementById("buscador").addEventListener("input", buscar);
});

// ── CATEGORIAS ──
function renderCategorias() {
  const cont = document.getElementById("categorias");
  if (!cont) return;
  cont.innerHTML = "";
  const todas = [{ id: "Todo", nombre: "Todo" }, ...CONFIG.categorias];
  todas.forEach(cat => {
    const activa = cat.id === categoriaActiva
      ? "bg-dorado text-white"
      : "bg-transparent text-doradoClaro";
    cont.innerHTML += `
      <button onclick="filtrar('${cat.id}')"
        class="flex-shrink-0 px-5 py-2 rounded-full border border-dorado text-sm font-bold transition-colors ${activa}">
        ${cat.nombre}
      </button>`;
  });
}

function filtrar(id) {
  categoriaActiva = id;
  renderCategorias();
  renderProductos();
}

// ── ZONAS ──
function renderZonas() {
  const select = document.getElementById("zona");
  if (!select) return;
  select.innerHTML = "";
  CONFIG.zonas.forEach(z => {
    const label = z.costo === 0
      ? `${z.nombre} (Gratis)`
      : `${z.nombre} — ${z.costo}`;
    select.innerHTML += `<option value="${z.costo}">${label}</option>`;
  });
}

// ── PAGOS ──
function renderPagos() {
  const cont = document.getElementById("metodosPago");
  if (!cont) return;
  let html = "";
  if (CONFIG.pagos.efectivo) {
    html += `
      <label class="flex items-center gap-2 cursor-pointer">
        <input type="radio" name="pago" value="Efectivo" checked class="accent-verde">
        <span class="text-gray-700 text-sm font-medium">💵 Efectivo</span>
      </label>`;
  }
  if (CONFIG.pagos.transferencia) {
    html += `
      <label class="flex items-center gap-2 cursor-pointer mt-2">
        <input type="radio" name="pago" value="Transferencia" class="accent-verde">
        <span class="text-gray-700 text-sm font-medium">📲 Transferencia</span>
      </label>`;
  }
  cont.innerHTML = html;
  cont.querySelectorAll('input[name="pago"]').forEach(radio => {
    radio.addEventListener("change", () => {
      const aliasInfo  = document.getElementById("aliasInfo");
      const aliasTexto = document.getElementById("aliasTexto");
      if (radio.value === "Transferencia" && radio.checked) {
        if (aliasTexto) aliasTexto.innerText = CONFIG.pagos.alias;
        if (aliasInfo)  aliasInfo.classList.remove("hidden");
      } else {
        if (aliasInfo) aliasInfo.classList.add("hidden");
      }
    });
  });
}

// ── TOGGLE DELIVERY/RETIRO ──
function toggleDelivery() {
  const t = document.getElementById("tipo").value;
  document.getElementById("seccionDelivery")?.classList.toggle("hidden", t !== "Delivery");
  document.getElementById("seccionRetiro")?.classList.toggle("hidden", t === "Delivery");
}

// ── PRODUCTOS ──
function renderProductos(lista = CONFIG.productos) {
  const cont = document.getElementById("productos");
  if (!cont) return;
  cont.innerHTML = "";

  const textoBusqueda = document.getElementById("buscador").value.trim().toLowerCase();
  let filtrados = lista;

  if (textoBusqueda !== "") {
    filtrados = lista.filter(p =>
      p.nombre.toLowerCase().includes(textoBusqueda) ||
      p.descripcion.toLowerCase().includes(textoBusqueda)
    );
  } else if (categoriaActiva !== "Todo") {
    filtrados = lista.filter(p => p.categoria === categoriaActiva);
  }

  const grupos = {};
  CONFIG.categorias.forEach(c => grupos[c.id] = []);
  filtrados.forEach(p => { if (grupos[p.categoria]) grupos[p.categoria].push(p); });

  Object.entries(grupos).forEach(([catId, productos]) => {
    if (productos.length === 0) return;

    const seccion = document.createElement("div");
    seccion.className = "mt-8";
    seccion.innerHTML = `
      <h2 class="font-playfair text-2xl text-doradoClaro mb-4">${catId}</h2>
      <div class="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
        ${productos.map(p => {
          const accion = p.categoria === "Minorista"
            ? `abrirModalMinorista()`
            : `abrirModalMayorista()`;
          const rutaImagen = p.categoria === "Minorista"
            ? "img/chipa.jpeg"
            : "img/congelados.jpeg";
          return `
            <div class="flex-shrink-0 w-52 bg-[#0f1f0f] rounded-2xl overflow-hidden border border-dorado/20 shadow-lg flex flex-col">
              <div class="w-full h-32 overflow-hidden">
                <img src="${rutaImagen}" class="w-full h-full object-cover">
              </div>
              <div class="p-4 flex flex-col flex-1">
                <div class="font-extrabold text-sm mb-1 text-white">${p.nombre}</div>
                <div class="text-xs text-dorado/50 mb-3 flex-1">${p.descripcion}</div>
                <div class="flex justify-end mt-auto">
                  <button onclick="${accion}"
                    class="w-10 h-10 rounded-full bg-dorado text-white shadow-md active:scale-90 transition">
                    <i class="fa-solid fa-plus"></i>
                  </button>
                </div>
              </div>
            </div>`;
        }).join("")}
      </div>`;
    cont.appendChild(seccion);
  });
}

function buscar() { renderProductos(); }

// ── MODAL MINORISTA ──
function abrirModalMinorista() {
  const cont = document.getElementById("opcionesMinorista");
  if (!cont) return;
  cont.innerHTML = "";
  CONFIG.minoristaOpciones.forEach(op => {
    cont.innerHTML += `
      <button onclick="seleccionarMinorista('${op.id}', '${op.label}', ${op.precio})"
        class="flex justify-between items-center bg-[#1a2e1a] text-white px-4 py-3 rounded-xl w-full border border-dorado/10 hover:bg-verdeClaro transition-colors">
        <div class="flex items-center gap-3">
          <img src="img/iconoChipa.jpeg" class="w-10 h-10 rounded-full object-cover border border-dorado/30">
          <div class="text-left">
            <div class="font-bold">${op.label}</div>
            <div class="text-[10px] text-gray-400">${op.personas}</div>
          </div>
        </div>
        <span class="text-doradoClaro font-bold">$${op.precio.toLocaleString()}</span>
      </button>`;
  });
  document.getElementById("modalMinorista").classList.remove("hidden");
}

function cerrarModalMinorista() {
  document.getElementById("modalMinorista").classList.add("hidden");
}

function seleccionarMinorista(id, label, precio) {
  seleccionPendiente = { label, precio };
  cerrarModalMinorista();
  document.getElementById("tipoTitulo").innerText = `Chipá ${label}`;
  document.getElementById("modalTipo").classList.remove("hidden");
}

function cerrarModalTipo() {
  document.getElementById("modalTipo").classList.add("hidden");
  seleccionPendiente = null;
}

function confirmarTipo(tipo) {
  if (!seleccionPendiente) return;
  carrito.push({
    nombre: `Chipá ${seleccionPendiente.label} ${tipo}`,
    precio: seleccionPendiente.precio
  });
  actualizarContador();
  document.getElementById("modalTipo").classList.add("hidden");
  seleccionPendiente = null;
}

// ── MODAL MAYORISTA ──
function abrirModalMayorista() {
  const cont = document.getElementById("opcionesMayorista");
  if (!cont) return;
  cont.innerHTML = "";
  CONFIG.mayoristaOpciones.forEach(op => {
    cont.innerHTML += `
      <button onclick="agregarMayorista('${op.id}', '${op.label}', ${op.precio})"
        class="flex items-center gap-4 bg-[#1a2e1a] text-white px-4 py-3 rounded-xl w-full border border-dorado/10 hover:bg-verdeClaro transition-colors mb-2">
        <img src="img/iconoChipa.jpeg" class="w-10 h-10 rounded-full object-cover border border-dorado/30">
        <div class="flex-1 text-left">
          <div class="font-bold">${op.label}  Congelado</div>
          <div class="text-xs text-doradoClaro font-bold">$${op.precio.toLocaleString()}</div>
        </div>
      </button>`;
  });
  document.getElementById("modalMayorista").classList.remove("hidden");
}

function cerrarModalMayorista() {
  document.getElementById("modalMayorista").classList.add("hidden");
}

function agregarMayorista(id, label, precio) {
  carrito.push({ nombre: `Mayorista ${label}  Congelado`, precio });
  actualizarContador();
  cerrarModalMayorista();
}

// ── CARRITO ──
function actualizarContador() {
  document.getElementById("contador").innerText = carrito.length;
}

function abrirCarrito() {
  if (carrito.length === 0) {
    alert("Todavía no agregaste nada 🛒");
    return;
  }
  const lista = document.getElementById("listaCarrito");
  if (!lista) return;
  lista.innerHTML = "";
  let total = 0;
  carrito.forEach((p, i) => {
    total += p.precio;
    lista.innerHTML += `
      <div class="flex justify-between items-center py-3 border-b border-white/5">
        <div>
          <div class="text-white font-bold text-sm">${p.nombre}</div>
          <div class="text-doradoClaro text-xs">$${p.precio.toLocaleString()}</div>
        </div>
        <button onclick="eliminarItem(${i})"
          class="w-8 h-8 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20">
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
  carrito.length === 0 ? cerrarCarrito() : abrirCarrito();
}

function cerrarCarrito() {
  document.getElementById("modalCarrito").classList.add("hidden");
}

function cerrarCarritoYFormulario() {
  cerrarCarrito();
  descuentoAplicado = 0;
  codigoUsado = "";
  const inp = document.getElementById("cupon");
  const msg = document.getElementById("mensajeCupon");
  const res = document.getElementById("resumenDescuento");
  if (inp) inp.value = "";
  if (msg) { msg.innerText = ""; msg.classList.add("hidden"); }
  if (res) res.classList.add("hidden");

  document.getElementById("modal").classList.remove("hidden");
}

function cerrarFormulario() {
  document.getElementById("modal").classList.add("hidden");
}

// ── CUPÓN ──
function aplicarCupon() {
  const input   = document.getElementById("cupon").value.trim().toUpperCase();
  const mensaje = document.getElementById("mensajeCupon");
  const resumen = document.getElementById("resumenDescuento");

  mensaje.classList.remove("hidden");

  const cupon = CONFIG.cupones[input];

  if (cupon && cupon.active) {
    descuentoAplicado = cupon.descuento;
    codigoUsado = input;

    let subtotal = 0;
    carrito.forEach(p => subtotal += p.precio);
    const monto      = Math.round(subtotal * descuentoAplicado / 100);
    const totalFinal = subtotal - monto;

    mensaje.innerText = `✅ Cupón aplicado — ${descuentoAplicado}% de descuento`;
    mensaje.className = "text-xs mt-2 font-bold text-green-600";

    document.getElementById("subtotalSinDesc").innerText = `$${subtotal.toLocaleString()}`;
    document.getElementById("labelDescuento").innerText  = `Descuento ${descuentoAplicado}%`;
    document.getElementById("montoDescuento").innerText  = `-$${monto.toLocaleString()}`;
    document.getElementById("totalConDesc").innerText    = `$${totalFinal.toLocaleString()}`;
    resumen.classList.remove("hidden");

  } else if (cupon && !cupon.active) {
    descuentoAplicado = 0;
    codigoUsado = "";
    mensaje.innerText = "❌ Este cupón ya no está disponible";
    mensaje.className = "text-xs mt-2 font-bold text-red-500";
    resumen.classList.add("hidden");
  } else {
    descuentoAplicado = 0;
    codigoUsado = "";
    mensaje.innerText = "❌ Código inválido";
    mensaje.className = "text-xs mt-2 font-bold text-red-500";
    resumen.classList.add("hidden");
  }
}

// ── ENVIAR WHATSAPP ──
function enviarPedido() {
  const nombre   = document.getElementById("nombre").value.trim();
  const apellido = document.getElementById("apellido").value.trim();
  const direccion= document.getElementById("direccion").value.trim();
  const tipo     = document.getElementById("tipo").value;
  const pago     = document.querySelector('input[name="pago"]:checked')?.value;
  const selectZona = document.getElementById("zona");
  const zonaTexto  = selectZona?.options[selectZona.selectedIndex]?.text || "";

  if (!nombre || !apellido) { alert("Faltan nombre y apellido."); return; }
  if (tipo === "Delivery" && !direccion) { alert("Poné la dirección para el delivery."); return; }
  if (!pago) { alert("Elegí un método de pago."); return; }

  let subtotal = 0;
  carrito.forEach(x => subtotal += x.precio);

  const monto      = Math.round(subtotal * descuentoAplicado / 100);
  const totalFinal = subtotal - monto;

  let mensaje = `*Don Chipá - Nuevo Pedido*%0A━━━━━━━━━━━━━━━%0A`;
  mensaje += `👤 *Cliente:* ${nombre} ${apellido}%0A`;
  mensaje += `📦 *Método:* ${tipo}%0A`;
  mensaje += `💳 *Pago:* ${pago}%0A`;

  if (tipo === "Delivery") {
    mensaje += `📍 *Dirección:* ${direccion}%0A`;
    mensaje += `🗺️ *Zona:* ${zonaTexto}%0A`;
  } else {
    mensaje += `📍 *Retira en local (Blanco Escalada)*%0A`;
  }

  mensaje += `%0A🍴 *Productos:*%0A`;
  carrito.forEach(x => {
    mensaje += `• ${x.nombre} — $${x.precio.toLocaleString()}%0A`;
  });

  mensaje += `%0A━━━━━━━━━━━━━━━%0A`;
  mensaje += `🧾 *Subtotal:* $${subtotal.toLocaleString()}%0A`;

  if (descuentoAplicado > 0) {
    mensaje += `🎟️ *Cupón (${codigoUsado}):* -$${monto.toLocaleString()} (${descuentoAplicado}% off)%0A`;
  }

  mensaje += `💰 *Total: $${totalFinal.toLocaleString()}*`;

  window.open(`https://wa.me/${CONFIG.telefono}?text=${mensaje}`);
  setTimeout(() => { location.reload(); }, 500);
}

// ── TEMPORIZADOR ──
function actualizarTemporizador() {
  const ahora     = new Date();
  const diaSemana = ahora.getDay();
  const timerDoc  = document.getElementById("timer");
  const textoDoc  = document.getElementById("texto-promo");
  if (!timerDoc) return;

  let objetivo = new Date();

  if (diaSemana >= 4 && diaSemana <= 6) {
    objetivo.setDate(ahora.getDate() + (7 - diaSemana));
    objetivo.setHours(0, 0, 0, 0);
    textoDoc.innerText = "🔥 ¡PROMO ACTIVA! El envío gratis termina en:";
  } else {
    let diasParaJueves = (4 - diaSemana + 7) % 7;
    if (diasParaJueves === 0) diasParaJueves = 7;
    objetivo.setDate(ahora.getDate() + diasParaJueves);
    objetivo.setHours(0, 0, 0, 0);
    textoDoc.innerText = "🚚 El Envío Gratis comienza en:";
  }

  const diff    = objetivo - ahora;
  const horas   = Math.floor(diff / (1000 * 60 * 60));
  const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const segundos= Math.floor((diff % (1000 * 60)) / 1000);

  timerDoc.innerText =
    `${horas.toString().padStart(2,'0')}:${minutos.toString().padStart(2,'0')}:${segundos.toString().padStart(2,'0')}`;
}

setInterval(actualizarTemporizador, 1000);
actualizarTemporizador();