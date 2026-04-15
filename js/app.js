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
  if(!cont) return;
  cont.innerHTML = "";
  const todas = [{ id: "Todo", nombre: "Todo" }, ...CONFIG.categorias];
  todas.forEach(cat => {
    const activa = cat.id === categoriaActiva ? "bg-dorado text-white" : "bg-transparent text-doradoClaro";
    cont.innerHTML += `<button onclick="filtrar('${cat.id}')" class="flex-shrink-0 px-5 py-2 rounded-full border border-dorado text-sm font-bold transition-colors ${activa}"><span>${cat.nombre}</span></button>`;
  });
}

function filtrar(id) {
  categoriaActiva = id;
  renderCategorias();
  renderProductos();
}

// ── ZONAS Y PAGOS ──
function renderZonas() {
  const select = document.getElementById("zona");
  if(!select) return;
  select.innerHTML = "";
  CONFIG.zonas.forEach(z => {
    select.innerHTML += `<option value="${z.costo}">${z.nombre} ${z.costo === 0 ? '(Gratis)' : ''}</option>`;
  });
}

function renderPagos() {
  const cont = document.getElementById("metodosPago");
  if (!cont) return;
  let htmlContenido = "";
  if (CONFIG.pagos.efectivo) {
    htmlContenido += `
      <label class="flex items-center gap-2 cursor-pointer">
        <input type="radio" name="pago" value="Efectivo" checked class="accent-verde">
        <span class="text-gray-700 text-sm font-medium">💵 Efectivo</span>
      </label>`;
  }
  if (CONFIG.pagos.transferencia) {
    htmlContenido += `
      <label class="flex items-center gap-2 cursor-pointer mt-2">
        <input type="radio" name="pago" value="Transferencia" class="accent-verde">
        <span class="text-gray-700 text-sm font-medium">📲 Transferencia</span>
      </label>`;
  }
  cont.innerHTML = htmlContenido;
  const radios = cont.querySelectorAll('input[name="pago"]');
  radios.forEach(radio => {
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

// ── PRODUCTOS ──
function renderProductos(lista = CONFIG.productos) {
  const cont = document.getElementById("productos");
  if(!cont) return;
  cont.innerHTML = "";
  const textoBusqueda = document.getElementById("buscador").value.trim().toLowerCase();
  let filtrados = lista;
  if (textoBusqueda !== "") {
    filtrados = lista.filter(p => p.nombre.toLowerCase().includes(textoBusqueda) || p.descripcion.toLowerCase().includes(textoBusqueda));
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
    seccion.innerHTML = `<h2 class="font-playfair text-2xl text-doradoClaro mb-4">${catId}</h2><div class="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-2 lg:grid-cols-3">
    ${productos.map(p => {
      const accion = p.categoria === "Minorista" ? `abrirModalMinorista()` : `abrirModalMayorista()`;
      let rutaImagen = p.categoria === "Minorista" ? "img/chipa.jpeg" : "img/congelados.jpeg";
      return `<div class="flex-shrink-0 w-52 md:w-full bg-[#0f1f0f] rounded-2xl overflow-hidden border border-dorado/20 shadow-lg">
        <div class="w-full h-32 flex items-center justify-center bg-verdeClaro overflow-hidden">
          <img src="${rutaImagen}" class="w-full h-full object-cover">
        </div>
        <div class="p-4">
          <div class="font-extrabold text-sm mb-1 text-white">${p.nombre}</div>
          <div class="text-xs text-dorado/50 mb-3 h-8 overflow-hidden">${p.descripcion}</div>
          <div class="flex justify-end">
            <button onclick="${accion}" class="w-10 h-10 rounded-full bg-dorado text-white shadow-md active:scale-90 transition">
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>
        </div>
      </div>`;
    }).join("")}</div>`;
    cont.appendChild(seccion);
  });
}

function buscar() { renderProductos(); }

// ── MODALES CON IMAGEN ──
function abrirModalMinorista() {
  const cont = document.getElementById("opcionesMinorista");
  if(cont) {
    cont.innerHTML = "";
    CONFIG.minoristaOpciones.forEach(op => {
      cont.innerHTML += `
        <button onclick="seleccionarMinorista('${op.id}', '${op.label}', ${op.precio})" 
                class="flex justify-between items-center bg-[#1a2e1a] text-white px-4 py-3 rounded-xl w-full mb-2 border border-dorado/10">
          <div class="flex items-center gap-3">
            <img src="img/iconoChipa.jpeg" class="w-10 h-10 rounded-full object-cover border border-dorado/30 shadow-sm">
            <div class="text-left">
              <div class="font-bold">${op.label}</div>
              <div class="text-[10px] text-gray-400">${op.personas}</div>
            </div>
          </div>
          <span class="text-doradoClaro font-bold">$${op.precio.toLocaleString()}</span>
        </button>`;
    });
  }
  document.getElementById("modalMinorista").classList.remove("hidden");
}

function abrirModalMayorista() {
  const modalM = document.getElementById("modalMayorista");
  const contenedorOpciones = modalM.querySelector("#opcionesMayorista");
  if(contenedorOpciones) {
    contenedorOpciones.innerHTML = "";
    CONFIG.mayoristaOpciones.forEach(op => {
      contenedorOpciones.innerHTML += `
        <button onclick="agregarMayorista('${op.id}','${op.label}',${op.precio})" 
                class="flex items-center gap-4 bg-green-900 text-white px-4 py-3 rounded-xl w-full border border-white/10 mb-2">
          <img src="img/iconoChipa.jpeg" class="w-10 h-10 rounded-full object-cover border border-dorado/30 shadow-sm">
          <div class="flex-1 text-left">
            <div class="font-bold">${op.label}</div>
            <div class="text-xs text-white/60">$${op.precio.toLocaleString()}</div>
          </div>
        </button>`;
    });
  }
  modalM.classList.remove("hidden");
}

function cerrarModalMinorista() { document.getElementById("modalMinorista").classList.add("hidden"); }
function cerrarModalMayorista() { document.getElementById("modalMayorista").classList.add("hidden"); }

function seleccionarMinorista(id, label, precio) {
  seleccionPendiente = { label, precio };
  cerrarModalMinorista();
  document.getElementById("tipoTitulo").innerText = label;
  document.getElementById("modalTipo").classList.remove("hidden");
}

function confirmarTipo(tipo) {
  carrito.push({ nombre: `Chipá ${seleccionPendiente.label} (${tipo})`, precio: seleccionPendiente.precio });
  actualizarContador();
  document.getElementById("modalTipo").classList.add("hidden");
}

function agregarMayorista(id, label, precio) {
  carrito.push({ nombre: `Mayorista ${label}`, precio: precio });
  actualizarContador();
  cerrarModalMayorista();
}

// ── CARRITO ──
function actualizarContador() { document.getElementById("contador").innerText = carrito.length; }

function abrirCarrito() {
  const lista = document.getElementById("listaCarrito");
  if(!lista) return;
  lista.innerHTML = "";
  let total = 0;
  carrito.forEach((p, i) => {
    total += p.precio;
    lista.innerHTML += `<div class="flex justify-between items-center py-3 border-b border-white/5"><div><div class="text-white font-bold text-sm">${p.nombre}</div><div class="text-doradoClaro text-xs">$${p.precio.toLocaleString()}</div></div><button onclick="eliminarItem(${i})" class="w-8 h-8 rounded-full bg-red-500/10 text-red-500"><i class="fa-solid fa-trash-can"></i></button></div>`;
  });
  document.getElementById("totalCarrito").innerText = "$" + total.toLocaleString();
  document.getElementById("modalCarrito").classList.remove("hidden");
}

function cerrarCarrito() { document.getElementById("modalCarrito").classList.add("hidden"); }

function eliminarItem(i) {
  carrito.splice(i, 1);
  actualizarContador();
  if (carrito.length === 0) cerrarCarrito();
  else abrirCarrito();
}

function cerrarCarritoYFormulario() {
  cerrarCarrito();
  document.getElementById("modal").classList.remove("hidden");
}

function cerrarFormulario() { document.getElementById("modal").classList.add("hidden"); }

function enviarPedido() {
  const n = document.getElementById("nombre").value.trim();
  const a = document.getElementById("apellido").value.trim();
  const d = document.getElementById("direccion").value.trim();
  const t = document.getElementById("tipo").value;
  const p = document.querySelector('input[name="pago"]:checked')?.value;
  const selectZona = document.getElementById("zona");
  const zonaTexto = selectZona.options[selectZona.selectedIndex]?.text || "No especificada";
  if (!n || !a) { alert("Che, faltan el nombre y apellido."); return; }
  if (t === "Delivery" && !d) { alert("Poné la dirección para el delivery."); return; }
  if (!p) { alert("Elegí un método de pago."); return; }
  let sub = 0; 
  carrito.forEach(x => sub += x.precio);
  let mensaje = `*Don Chipá - Nuevo Pedido*%0A━━━━━━━━━━━━━━━%0A👤 *Cliente:* ${n} ${a}%0A📦 *Método:* ${t}%0A💳 *Pago:* ${p}%0A`;
  if(t === "Delivery") {
    mensaje += `📍 *Dirección:* ${d}%0A🗺️ *Zona:* ${zonaTexto}%0A`;
  } else {
    mensaje += `📍 *Retira en local (Blanco Escalada)*%0A`;
  }
  mensaje += `%0A🍴 *Productos:*%0A`;
  carrito.forEach(x => { mensaje += `• ${x.nombre} - $${x.precio.toLocaleString()}%0A`; });
  mensaje += `%0A💰 *Total: $${sub.toLocaleString()}*`;
  window.open(`https://wa.me/${CONFIG.telefono}?text=${mensaje}`);
  setTimeout(() => { location.reload(); }, 500); 
}

function toggleDelivery() {
  const t = document.getElementById("tipo").value;
  const seccionDelivery = document.getElementById("seccionDelivery");
  const seccionRetiro = document.getElementById("seccionRetiro");
  if(seccionDelivery) seccionDelivery.classList.toggle("hidden", t !== "Delivery");
  if(seccionRetiro) seccionRetiro.classList.toggle("hidden", t === "Delivery");
}