let carrito = [];
let categoriaActiva = "Todo";
let descuentoAplicado = 0;
let codigoUsado = "";

// Estado Modal Variantes
let productoActivo = null;
let opcionSeleccionada = null;
let cantidadSeleccionada = 1;

document.addEventListener("DOMContentLoaded", () => {
  renderCategorias();
  renderProductos();
  renderZonas();
  renderPagos();
  document.getElementById("buscador")?.addEventListener("input", buscar);
});

// ── CATEGORÍAS ──
function renderCategorias() {
  const cont = document.getElementById("categorias");
  if (!cont) return;
  cont.innerHTML = "";
  const todas = [{ id: "Todo", nombre: "Todo" }, ...CONFIG.categorias];
  todas.forEach(cat => {
    const activa = cat.id === categoriaActiva
      ? "bg-dorado text-black"
      : "bg-transparent text-doradoClaro border-dorado/40";
    cont.innerHTML += `
      <button onclick="filtrar('${cat.id}')"
        class="flex-shrink-0 px-5 py-2 rounded-full border text-sm font-bold transition-colors ${activa}">
        ${cat.nombre}
      </button>`;
  });
}

function filtrar(id) {
  categoriaActiva = id;
  renderCategorias();
  renderProductos();
}

// ── RENDER PRODUCTOS POR SECCIÓN ──
// function renderProductos(lista = CONFIG.productos) {
//   const cont = document.getElementById("productos");
//   if (!cont) return;
//   cont.innerHTML = "";

//   const texto = document.getElementById("buscador")?.value.trim().toLowerCase() || "";
//   let filtrados = lista;

//   if (texto !== "") {
//     filtrados = lista.filter(p =>
//       p.nombre.toLowerCase().includes(texto) ||
//       (p.descripcion && p.descripcion.toLowerCase().includes(texto))
//     );
//   } else if (categoriaActiva !== "Todo") {
//     filtrados = lista.filter(p => p.categoria === categoriaActiva);
//   }

//   // Ahora se incluyen las 4 secciones
//   const secciones = ["Por Kilo", "Por Docena", "Minorista", "Mayorista"];

//   secciones.forEach(secNombre => {
//     const prods = filtrados.filter(p => p.categoria === secNombre);
//     if (prods.length === 0) return;

//     const divSec = document.createElement("div");
//     divSec.className = "mt-8";
//     divSec.innerHTML = `
//       <h2 class="font-playfair text-2xl text-dorado font-bold uppercase tracking-wider mb-4 border-b border-dorado/20 pb-1">
//         ${secNombre}
//       </h2>
//       <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
//         ${prods.map(p => {
//           const badgeNew = p.isNew
//             ? `<span class="absolute top-3 right-3 bg-blue-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-md z-10">NEW</span>`
//             : "";

//           return `
//             <div class="bg-[#142A13] rounded-2xl overflow-hidden border border-dorado/20 shadow-lg flex flex-col relative">
//               <div class="w-full h-36 overflow-hidden relative">
//                 <img src="${p.imagen}" alt="${p.nombre}" class="w-full h-full object-cover">
//                 ${badgeNew}
//               </div>
//               <div class="p-4 flex flex-col flex-1 justify-between">
//                 <div>
//                   <h3 class="font-bold text-base text-white mb-1">${p.nombre}</h3>
//                   <p class="text-xs text-crema/70 line-clamp-2 mb-3">${p.descripcion}</p>
//                 </div>
//                 <div class="flex justify-between items-center mt-2 pt-2 border-t border-white/10">
//                   <span class="text-doradoClaro font-bold text-xs uppercase">Elegir opción</span>
//                   <button onclick="abrirModalVariantes('${p.id}')"
//                     class="w-10 h-10 rounded-full bg-dorado hover:bg-doradoClaro text-black font-black flex items-center justify-center shadow-md active:scale-90 transition">
//                     <i class="fa-solid fa-plus"></i>
//                   </button>
//                 </div>
//               </div>
//             </div>`;
//         }).join("")}
//       </div>`;
//     cont.appendChild(divSec);
//   });
// }

// ── RENDER PRODUCTOS EN CARRUSEL HORIZONTAL POR SECCIÓN ──
function renderProductos(lista = CONFIG.productos) {
  const cont = document.getElementById("productos");
  if (!cont) return;
  cont.innerHTML = "";

  const texto = document.getElementById("buscador")?.value.trim().toLowerCase() || "";
  let filtrados = lista;

  if (texto !== "") {
    filtrados = lista.filter(p =>
      p.nombre.toLowerCase().includes(texto) ||
      (p.descripcion && p.descripcion.toLowerCase().includes(texto))
    );
  } else if (categoriaActiva !== "Todo") {
    filtrados = lista.filter(p => p.categoria === categoriaActiva);
  }

  const secciones = ["Por Kilo", "Por Docena", "Minorista", "Mayorista"];

  secciones.forEach(secNombre => {
    const prods = filtrados.filter(p => p.categoria === secNombre);
    if (prods.length === 0) return;

    const divSec = document.createElement("div");
    divSec.className = "mt-8";
    divSec.innerHTML = `
      <h2 class="font-playfair text-2xl text-dorado font-bold uppercase tracking-wider mb-4 border-b border-dorado/20 pb-1 px-1">
        ${secNombre}
      </h2>
      <!-- Contenedor con scroll horizontal táctil y suave -->
      <div class="flex gap-4 overflow-x-auto hide-scrollbar pb-4 pt-1 snap-x snap-mandatory">
        ${prods.map(p => {
          const badgeNew = p.isNew
            ? `<span class="absolute top-3 right-3 bg-blue-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-md z-10">NEW</span>`
            : "";

          return `
            <div class="flex-none w-[260px] sm:w-[280px] snap-start bg-[#142A13] rounded-2xl overflow-hidden border border-dorado/20 shadow-lg flex flex-col relative">
              <div class="w-full h-36 overflow-hidden relative">
                <img src="${p.imagen}" alt="${p.nombre}" class="w-full h-full object-cover">
                ${badgeNew}
              </div>
              <div class="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <h3 class="font-bold text-base text-white mb-1">${p.nombre}</h3>
                  <p class="text-xs text-crema/70 line-clamp-2 mb-3">${p.descripcion}</p>
                </div>
                <div class="flex justify-between items-center mt-2 pt-2 border-t border-white/10">
                  <span class="text-doradoClaro font-bold text-xs uppercase">Elegir opción</span>
                  <button onclick="abrirModalVariantes('${p.id}')"
                    class="w-10 h-10 rounded-full bg-dorado hover:bg-doradoClaro text-black font-black flex items-center justify-center shadow-md active:scale-90 transition">
                    <i class="fa-solid fa-plus"></i>
                  </button>
                </div>
              </div>
            </div>`;
        }).join("")}
      </div>`;
    cont.appendChild(divSec);
  });
}

function buscar() { renderProductos(); }

// ── MODAL VARIANTES ──
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
  
  carrito.push({
    nombre: `${productoActivo.nombre} (${opcionSeleccionada.label}) x${cantidadSeleccionada}`,
    precio: opcionSeleccionada.precio * cantidadSeleccionada
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

// ── ZONAS Y PAGOS ──
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

// ── CARRITO Y CHECKOUT ──
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
      <div class="flex justify-between items-center py-3 border-b border-white/10">
        <div>
          <div class="text-white font-bold text-sm">${p.nombre}</div>
          <div class="text-dorado text-xs font-bold">$${p.precio.toLocaleString()}</div>
        </div>
        <button onclick="eliminarItem(${i})" class="w-8 h-8 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30">
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
  document.getElementById("modal").classList.remove("hidden");
}

function cerrarFormulario() {
  document.getElementById("modal").classList.add("hidden");
}

function aplicarCupon() {
  const input = document.getElementById("cupon").value.trim().toUpperCase();
  const mensaje = document.getElementById("mensajeCupon");
  const resumen = document.getElementById("resumenDescuento");
  mensaje.classList.remove("hidden");

  const cupon = CONFIG.cupones[input];

  if (cupon && cupon.active) {
    descuentoAplicado = cupon.descuento;
    codigoUsado = input;

    let subtotal = 0;
    carrito.forEach(p => subtotal += p.precio);
    const monto = Math.round(subtotal * descuentoAplicado / 100);
    const totalFinal = subtotal - monto;

    mensaje.innerText = `✅ Cupón aplicado — ${descuentoAplicado}% OFF`;
    mensaje.className = "text-xs mt-2 font-bold text-green-600";

    document.getElementById("subtotalSinDesc").innerText = `$${subtotal.toLocaleString()}`;
    document.getElementById("labelDescuento").innerText = `Descuento ${descuentoAplicado}%`;
    document.getElementById("montoDescuento").innerText = `-$${monto.toLocaleString()}`;
    document.getElementById("totalConDesc").innerText = `$${totalFinal.toLocaleString()}`;
    resumen.classList.remove("hidden");
  } else {
    descuentoAplicado = 0;
    codigoUsado = "";
    mensaje.innerText = "❌ Código inválido o expirado";
    mensaje.className = "text-xs mt-2 font-bold text-red-500";
    resumen.classList.add("hidden");
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

  let mensaje = `*Pachipá - Nuevo Pedido*%0A━━━━━━━━━━━━━━━%0A`;
  mensaje += `👤 *Cliente:* ${nombre} ${apellido}%0A`;
  mensaje += `📦 *Método:* ${tipo}%0A`;
  mensaje += `💳 *Pago:* ${pago}%0A`;

  if (tipo === "Delivery") {
    mensaje += `📍 *Dirección:* ${direccion}%0A`;
    mensaje += `🗺️ *Zona:* ${zonaTexto}%0A`;
  } else {
    mensaje += `🏠 *Retiro en local (Blanco Encalada)*%0A`;
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

  mensaje += `💰 *Total Final: $${totalFinal.toLocaleString()}*`;

  window.open(`https://wa.me/${CONFIG.telefono}?text=${mensaje}`);
  setTimeout(() => { location.reload(); }, 500);
}