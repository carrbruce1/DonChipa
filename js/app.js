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
  const todas = [{ id: "Todo", nombre: "Todo" }, ...CONFIG.categorias];

  todas.forEach(cat => {
    const activa = cat.id === categoriaActiva ? "bg-dorado text-white" : "bg-transparent text-doradoClaro";
    cont.innerHTML += `
      <button onclick="filtrar('${cat.id}')"
        class="flex-shrink-0 px-5 py-2 rounded-full border border-dorado text-sm font-bold transition-colors ${activa}">
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
  if(!cont) return;
  cont.innerHTML = "";
  if (CONFIG.pagos.efectivo) {
    cont.innerHTML += `<label class="flex items-center gap-2"><input type="radio" name="pago" value="Efectivo" checked> <span class="text-sm text-white">💵 Efectivo</span></label>`;
  }
  if (CONFIG.pagos.transferencia) {
    cont.innerHTML += `<label class="flex items-center gap-2 mt-2"><input type="radio" name="pago" value="Transferencia"> <span class="text-sm text-white">📲 Transferencia</span></label>`;
  }
}

// ── PRODUCTOS (FOTO DISTINTA POR CATEGORÍA) ──
function renderProductos(lista = CONFIG.productos) {
  const cont = document.getElementById("productos");
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
    seccion.innerHTML = `
      <h2 class="font-playfair text-2xl text-doradoClaro mb-4">${catId}</h2>
      <div class="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-2 lg:grid-cols-3">
        ${productos.map(p => {
          const accion = p.categoria === "Minorista" ? `abrirModalMinorista()` : `abrirModalMayorista()`;
          
          // Lógica de imagen: Minorista vs Mayorista
          let rutaImagen = p.categoria === "Minorista" ? "img/chipa.jpeg" : "img/congelados.jpeg";
          
          const mediaHTML = `<img src="${rutaImagen}" class="w-full h-full object-cover" alt="${p.nombre}" onerror="this.parentElement.innerHTML='<i class=\\'${p.icon} text-doradoClaro text-2xl\\'></i>'">`;

          return `
            <div class="flex-shrink-0 w-52 md:w-full bg-[#0f1f0f] rounded-2xl overflow-hidden border border-dorado/20 shadow-lg">
              <div class="w-full h-32 flex items-center justify-center bg-verdeClaro overflow-hidden">
                ${mediaHTML}
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
            </div>
          `;
        }).join("")}
      </div>
    `;
    cont.appendChild(seccion);
  });
}

// ── BUSCADOR ──
function buscar() { renderProductos(); }

// ── MODALES ──
function abrirModalMinorista() {
  const cont = document.getElementById("opcionesMinorista");
  cont.innerHTML = "";
  CONFIG.minoristaOpciones.forEach(op => {
    cont.innerHTML += `
      <button onclick="seleccionarMinorista('${op.id}', '${op.label}', ${op.precio})"
        class="flex justify-between items-center bg-[#1a2e1a] text-white px-4 py-3 rounded-xl w-full mb-2 border border-dorado/10">
        <div class="flex items-center gap-3">
          <i class="${op.icon} text-doradoClaro"></i>
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

function seleccionarMinorista(id, label, precio) {
  seleccionPendiente = { label, precio };
  document.getElementById("modalMinorista").classList.add("hidden");
  document.getElementById("tipoTitulo").innerText = label;
  document.getElementById("modalTipo").classList.remove("hidden");
}

function confirmarTipo(tipo) {
  carrito.push({ nombre: `Chipá ${seleccionPendiente.label} (${tipo})`, precio: seleccionPendiente.precio });
  actualizarContador();
  document.getElementById("modalTipo").classList.add("hidden");
}

function abrirModalMayorista() { document.getElementById("modalMayorista").classList.remove("hidden"); }

function agregarMayorista(id, label, precio) {
  carrito.push({ nombre: `Mayorista ${label}`, precio: precio });
  actualizarContador();
  document.getElementById("modalMayorista").classList.add("hidden");
}

// ── CARRITO (CON ELIMINAR) ──
function actualizarContador() { document.getElementById("contador").innerText = carrito.length; }

function abrirCarrito() {
  const lista = document.getElementById("listaCarrito");
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
        <button onclick="eliminarItem(${i})" class="w-8 h-8 rounded-full bg-red-500/10 text-red-500">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>`;
  });
  document.getElementById("totalCarrito").innerText = "$" + total.toLocaleString();
  document.getElementById("modalCarrito").classList.remove("hidden");
}

function eliminarItem(i) {
  carrito.splice(i, 1);
  actualizarContador();
  if (carrito.length === 0) document.getElementById("modalCarrito").classList.add("hidden");
  else abrirCarrito();
}

// ── FINALIZAR ──
function cerrarCarritoYFormulario() {
  document.getElementById("modalCarrito").classList.add("hidden");
  document.getElementById("modal").classList.remove("hidden");
}

function enviarPedido() {
  const n = document.getElementById("nombre").value;
  const a = document.getElementById("apellido").value;
  const d = document.getElementById("direccion").value;
  const t = document.getElementById("tipo").value;
  const p = document.querySelector('input[name="pago"]:checked').value;
  
  let sub = 0; carrito.forEach(x => sub += x.precio);
  let mensaje = `*Don Chipá - Nuevo Pedido*%0A*Cliente:* ${n} ${a}%0A*Metodo:* ${t}%0A*Pago:* ${p}%0A`;
  if(t==="Delivery") mensaje += `*Dirección:* ${d}%0A`;
  mensaje += `%0A*Productos:*%0A`;
  carrito.forEach(x => mensaje += `- ${x.nombre}%0A`);
  mensaje += `%0A*Total: $${sub.toLocaleString()}*`;
  
  window.open(`https://wa.me/${CONFIG.telefono}?text=${mensaje}`);
}

function toggleDelivery() {
  const t = document.getElementById("tipo").value;
  document.getElementById("seccionDelivery").classList.toggle("hidden", t !== "Delivery");
}