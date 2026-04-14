let carrito = [];
let categoriaActiva = "Todo";
let seleccionPendiente = null;

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
  cont.innerHTML = "";

  const todas = [
    { id: "Todo", nombre: "Todo", emoji: "🫓" },
    ...CONFIG.categorias
  ];

  todas.forEach(cat => {
    const activa = cat.id === categoriaActiva
      ? "bg-dorado text-white"
      : "bg-transparent text-doradoClaro";

    cont.innerHTML += `
      <button onclick="filtrar('${cat.id}')"
        class="flex-shrink-0 flex items-center gap-1.5 px-5 py-2 rounded-full
               border border-dorado text-sm font-bold transition-colors ${activa}">
        <span>${cat.nombre}</span>
      </button>
    `;
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
  select.innerHTML = "";
  CONFIG.zonas.forEach(z => {
    const label = z.costo === 0
      ? `${z.nombre} — Envío gratis`
      : `${z.nombre} — +${CONFIG.moneda}${z.costo.toLocaleString()}`;
    select.innerHTML += `<option value="${z.costo}">${label}</option>`;
  });
}

// ── PAGOS ──
function renderPagos() {
  const cont = document.getElementById("metodosPago");
  cont.innerHTML = "";

  if (CONFIG.pagos.efectivo) {
    cont.innerHTML += `
      <label class="flex items-center gap-2 cursor-pointer">
        <input type="radio" name="pago" value="Efectivo" checked>
        <span class="text-sm">💵 Efectivo</span>
      </label>
    `;
  }

  if (CONFIG.pagos.transferencia) {
    cont.innerHTML += `
      <label class="flex items-center gap-2 cursor-pointer">
        <input type="radio" name="pago" value="Transferencia"
          ${!CONFIG.pagos.efectivo ? "checked" : ""}>
        <span class="text-sm">📲 Transferencia</span>
      </label>
    `;
  }

  cont.querySelectorAll('input[name="pago"]').forEach(radio => {
    radio.addEventListener("change", () => {
      const aliasInfo  = document.getElementById("aliasInfo");
      const aliasTexto = document.getElementById("aliasTexto");
      if (radio.value === "Transferencia" && radio.checked) {
        aliasTexto.innerText = CONFIG.pagos.alias;
        aliasInfo.classList.remove("hidden");
      } else {
        aliasInfo.classList.add("hidden");
      }
    });
  });
}

// ── PRODUCTOS ──
function renderProductos(lista = CONFIG.productos) {
  const cont = document.getElementById("productos");
  cont.innerHTML = "";

  const buscando = document.getElementById("buscador").value.trim() !== "";

  // BUSCADOR
  if (buscando) {
    if (lista.length === 0) {
      cont.innerHTML = `<p class="text-center text-dorado/50 mt-10">No encontramos ese producto</p>`;
      return;
    }

    lista.forEach(p => {
      const accion = p.categoria === "Minorista"
        ? `abrirModalMinorista()`
        : `abrirModalMayorista()`;

      cont.innerHTML += `
        <div class="flex items-center gap-4 py-4 border-b border-dorado/10">

          <div class="w-14 h-14 rounded-xl bg-verdeClaro flex items-center justify-center">
            <i class="${p.icon} text-doradoClaro text-xl"></i>
          </div>

          <div class="flex-1">
            <div class="font-extrabold text-sm text-white">${p.nombre}</div>
            <div class="text-xs text-dorado/50 mt-1 mb-1">${p.descripcion}</div>
            <div class="text-doradoClaro font-extrabold text-sm">
              ${CONFIG.moneda}${p.precio.toLocaleString()}
            </div>
          </div>

          <button onclick="${accion}"
            class="w-9 h-9 rounded-full bg-dorado text-white flex items-center justify-center">
            <i class="fa-solid fa-plus text-sm"></i>
          </button>
        </div>
      `;
    });

    return;
  }

  let filtrados = lista;
  if (categoriaActiva !== "Todo") {
    filtrados = lista.filter(p => p.categoria === categoriaActiva);
  }

  const orden = CONFIG.categorias.map(c => c.id);
  const grupos = {};
  orden.forEach(id => grupos[id] = []);

  filtrados.forEach(p => {
    if (grupos[p.categoria]) grupos[p.categoria].push(p);
  });

  Object.entries(grupos).forEach(([catId, productos]) => {
    if (productos.length === 0) return;

    const catInfo = CONFIG.categorias.find(c => c.id === catId);

    const seccion = document.createElement("div");
    seccion.className = "mt-8";

    seccion.innerHTML = `
      <h2 class="font-playfair text-2xl text-doradoClaro mb-4">
        ${catInfo.nombre}
      </h2>

      <div class="flex gap-4 overflow-x-auto pb-2
                  md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:overflow-visible">

        ${productos.map(p => {
          const accion = p.categoria === "Minorista"
            ? `abrirModalMinorista()`
            : `abrirModalMayorista()`;

          return `
            <div class="flex-shrink-0 w-52 md:w-full bg-[#0f1f0f] rounded-2xl overflow-hidden
                        border border-dorado/20 hover:scale-105 transition">

              <div class="w-full h-32 flex items-center justify-center bg-verdeClaro">
                <div class="w-14 h-14 rounded-xl bg-[#0f1f0f] flex items-center justify-center">
                  <i class="${p.icon} text-doradoClaro text-2xl"></i>
                </div>
              </div>

              <div class="p-4">
                <div class="font-extrabold text-sm mb-1 text-white">
                  ${p.nombre}
                </div>

                <div class="text-xs text-dorado/50 mb-3">
                  ${p.descripcion}
                </div>

                <div class="flex justify-between items-center">
                  <div class="text-doradoClaro font-bold">
                    ${CONFIG.moneda}${p.precio.toLocaleString()}
                  </div>

                  <button onclick="${accion}"
                    class="w-9 h-9 rounded-full bg-dorado text-white flex items-center justify-center">
                    <i class="fa-solid fa-plus"></i>
                  </button>
                </div>
              </div>

            </div>
          `;
        }).join("")}

      </div>
    `;

    cont.appendChild(seccion);
  });
}

// ── BUSCAR ──
function buscar(e) {
  const texto = e.target.value.toLowerCase();
  const filtrados = CONFIG.productos.filter(p =>
    p.nombre.toLowerCase().includes(texto) ||
    p.descripcion.toLowerCase().includes(texto)
  );
  renderProductos(filtrados);
}

// ── MODAL MINORISTA ──
function abrirModalMinorista() {
  const cont = document.getElementById("opcionesMinorista");
  cont.innerHTML = "";

  CONFIG.minoristaOpciones.forEach(op => {
    cont.innerHTML += `
      <button onclick="seleccionarMinorista('${op.id}', '${op.label}', ${op.precio})"
        class="flex justify-between items-center bg-[#1a2e1a] text-white px-4 py-3 rounded-xl">
        
        <div class="flex items-center gap-3">
          <i class="${op.icon} text-doradoClaro"></i>
          <div>
            <div class="font-bold">${op.label}</div>
            <div class="text-xs text-gray-400">${op.personas}</div>
          </div>
        </div>

        <span class="text-doradoClaro font-bold">
          ${CONFIG.moneda}${op.precio.toLocaleString()}
        </span>
      </button>
    `;
  });

  document.getElementById("modalMinorista").classList.remove("hidden");
}

function cerrarModalMinorista() {
  document.getElementById("modalMinorista").classList.add("hidden");
}

function seleccionarMinorista(id, label, precio) {
  seleccionPendiente = { label, precio };
  cerrarModalMinorista();
  document.getElementById("tipoTitulo").innerText = label;
  document.getElementById("modalTipo").classList.remove("hidden");
}

// ── TIPO ──
function confirmarTipo(tipo) {
  if (!seleccionPendiente) return;

  const nombre = `${seleccionPendiente.label} (${tipo})`;

  carrito.push({
    nombre,
    precio: seleccionPendiente.precio
  });

  actualizarContador();

  document.getElementById("modalTipo").classList.add("hidden");
  seleccionPendiente = null;
}

// ── MAYORISTA ──
function abrirModalMayorista() {
  document.getElementById("modalMayorista").classList.remove("hidden");
}

function cerrarModalMayorista() {
  document.getElementById("modalMayorista").classList.add("hidden");
}

function agregarMayorista(id, label, precio) {
  carrito.push({
    nombre: `Mayorista ${label}`,
    precio
  });

  actualizarContador();
  cerrarModalMayorista();
}

// ── CARRITO ──
function agregar(nombre, precio) {
  carrito.push({ nombre, precio });
  actualizarContador();
  const btn = document.getElementById("btnCarrito");
  btn.classList.add("scale-125");
  setTimeout(() => btn.classList.remove("scale-125"), 200);
}

function actualizarContador() {
  document.getElementById("contador").innerText = carrito.length;
}

function abrirCarrito() {
  if (carrito.length === 0) {
    alert("Todavía no agregaste nada 🛒");
    return;
  }

  const lista = document.getElementById("listaCarrito");
  lista.innerHTML = "";
  let total = 0;

  carrito.forEach((p, i) => {
    total += p.precio;
    lista.innerHTML += `
      <div class="flex justify-between items-center py-3">
        <span class="font-bold text-sm">${p.nombre}</span>
        <div class="flex items-center gap-3">
          <span class="text-verde font-extrabold">${CONFIG.moneda}${p.precio.toLocaleString()}</span>
          <button onclick="eliminarItem(${i})"
            class="text-red-400 text-xs px-2 py-1 hover:text-red-300">✕</button>
        </div>
      </div>
    `;
  });

  document.getElementById("totalCarrito").innerText = `${CONFIG.moneda}${total.toLocaleString()}`;
  document.getElementById("modalCarrito").classList.remove("hidden");
}

function eliminarItem(i) {
  carrito.splice(i, 1);
  actualizarContador();
  carrito.length === 0 ? cerrarCarrito() : abrirCarrito();
}

function abrirCarrito() {
  if (carrito.length === 0) {
    alert("Carrito vacío 🛒");
    return;
  }

  const lista = document.getElementById("listaCarrito");
  lista.innerHTML = "";

  let total = 0;

  carrito.forEach((p, i) => {
    total += p.precio;

    lista.innerHTML += `
      <div class="flex justify-between py-2">
        <span>${p.nombre}</span>
        <span>${CONFIG.moneda}${p.precio.toLocaleString()}</span>
      </div>
    `;
  });

  document.getElementById("totalCarrito").innerText =
    CONFIG.moneda + total.toLocaleString();

  document.getElementById("modalCarrito").classList.remove("hidden");
}

function cerrarCarrito() {
  document.getElementById("modalCarrito").classList.add("hidden");
}

function cerrarCarritoYFormulario() {
  cerrarCarrito();
  abrirFormulario();
}

// ── FORM ──
function abrirFormulario() {
  document.getElementById("modal").classList.remove("hidden");
}

function cerrarFormulario() {
  document.getElementById("modal").classList.add("hidden");
}

// ── ENVIAR POR WHATSAPP ──
function enviarPedido() {
  const nombre    = document.getElementById("nombre").value.trim();
  const apellido  = document.getElementById("apellido").value.trim();
  const direccion = document.getElementById("direccion").value.trim();
  const tipo      = document.getElementById("tipo").value;
  const pago      = document.querySelector('input[name="pago"]:checked')?.value || "No especificado";

  if (!nombre || !apellido) {
    alert("Completá al menos nombre y apellido");
    return;
  }

  let costoDelivery = 0;
  let zonaNombre    = "";
  if (tipo === "Delivery") {
    if (!direccion) {
      alert("Ingresá tu dirección para el delivery");
      return;
    }
    const zonaSelect = document.getElementById("zona");
    costoDelivery    = parseInt(zonaSelect.value);
    zonaNombre       = zonaSelect.options[zonaSelect.selectedIndex].text;
  }

  let subtotal = 0;
  carrito.forEach(p => subtotal += p.precio);
  const total = subtotal + costoDelivery;

  let mensaje = `🛵 *Nuevo Pedido*%0A`;
  mensaje += `━━━━━━━━━━━━━━━%0A`;
  mensaje += `👤 *Cliente:* ${nombre} ${apellido}%0A`;
  mensaje += `📦 *Tipo:* ${tipo}%0A`;

  if (tipo === "Delivery") {
    mensaje += `📍 *Dirección:* ${direccion}%0A`;
    mensaje += `🗺️ *Zona:* ${zonaNombre}%0A`;
  }

  mensaje += `💳 *Pago:* ${pago}`;
  if (pago === "Transferencia") mensaje += ` (Alias: ${CONFIG.pagos.alias})`;

  mensaje += `%0A%0A🍽️ *Productos:*%0A`;
  carrito.forEach(p => {
    mensaje += `• ${p.nombre} — ${CONFIG.moneda}${p.precio.toLocaleString()}%0A`;
  });

  mensaje += `%0A━━━━━━━━━━━━━━━%0A`;
  mensaje += `🧾 *Subtotal:* ${CONFIG.moneda}${subtotal.toLocaleString()}%0A`;

  if (tipo === "Delivery") {
    mensaje += costoDelivery > 0
      ? `🚗 *Delivery:* ${CONFIG.moneda}${costoDelivery.toLocaleString()}%0A`
      : `🚗 *Delivery:* Gratis%0A`;
  }

  mensaje += `💰 *Total: ${CONFIG.moneda}${total.toLocaleString()}*`;

  window.open(`https://wa.me/${CONFIG.telefono}?text=${mensaje}`, "_blank");

  carrito = [];
  actualizarContador();
  cerrarFormulario();
  document.getElementById("nombre").value    = "";
  document.getElementById("apellido").value  = "";
  document.getElementById("direccion").value = "";
}