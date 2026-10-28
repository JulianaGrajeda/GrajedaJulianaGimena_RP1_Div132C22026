const productosJSON = `[
  { "id": 1, "nombre": "Cheeseburger", "descripcion": "Medallón de carne, cheddar, pepinos y ketchup", "categoria": "Clásicas", "precio": 7500, "stock": 10, "imagen": "img/1.jpg" },
  { "id": 2, "nombre": "Clásica Completa", "descripcion": "Carne, lechuga, tomate y cebolla", "categoria": "Clásicas", "precio": 8200, "stock": 8, "imagen": "img/2.jpg" },
  { "id": 3, "nombre": "Cuarto de Libra", "descripcion": "Carne de 200 g, cheddar, cebolla y tomate", "categoria": "Clásicas", "precio": 9900, "stock": 0, "imagen": "img/3.jpg" },
  { "id": 4, "nombre": "Bacon BBQ", "descripcion": "Carne, panceta crocante, cheddar y salsa barbacoa", "categoria": "Especiales", "precio": 12500, "stock": 5, "imagen": "img/4.jpg" },
  { "id": 5, "nombre": "Provoleta", "descripcion": "Carne, provoleta fundida y cebolla caramelizada", "categoria": "Especiales", "precio": 13200, "stock": 4, "imagen": "img/5.jpg" },
  { "id": 6, "nombre": "Doble Cheddar", "descripcion": "Doble carne, doble cheddar, cebolla y lechuga", "categoria": "Especiales", "precio": 14000, "stock": 3, "imagen": "img/6.jpg" },
  { "id": 7, "nombre": "Combo Clásico", "descripcion": "Hamburguesa completa con papas fritas", "categoria": "Combos", "precio": 15900, "stock": 6, "imagen": "img/7.jpg" },
  { "id": 8, "nombre": "Combo Crispy", "descripcion": "Pollo crispy, coleslaw y papas fritas", "categoria": "Combos", "precio": 16500, "stock": 2, "imagen": "img/8.jpg" },
  { "id": 9, "nombre": "Combo Onion", "descripcion": "Carne, aros de cebolla, cheddar y papas fritas", "categoria": "Combos", "precio": 17800, "stock": 1, "imagen": "img/9.jpg" }
]`;

// EJERCICIO I y II
// const productos = JSON.parse(productosJSON);
// localStorage.setItem("productos", JSON.stringify(productos));

// EJERCICIO III
const productos = JSON.parse(localStorage.getItem("productos"));
console.table(productos);

// RENDERIZACIÓN DE PRODUCTOS

function renderizarProductos(lista){
  const contenedor = document.getElementById("productsContainer");

  // Verificamos si existe el contenedor
  if( !contenedor){
    return;
  }

  contenedor.innerHTML = "";

  // Verificamos la lista
  if (!lista || lista.length === 0){
    contenedor.innerHTML = "<p class='aviso'> No hay productos para mostrar</p>";
    return;
  }

  lista.forEach( (elemento) => {
    const div = document.createElement("div");
    div.className = "card-element";

    div.innerHTML = `
      <img src="${elemento.imagen ?? "https://placehold.co/300x250"}" alt="imagen">
      <div class="info-card">
        <h3>${elemento.nombre || ''}</h3>
        <p class="descripcion">${elemento.descripcion || ''}</p>
        <p class="precio">$${elemento.precio ?? "0.00"}</p>
      </div>
    `;

    if(elemento.stock === 0){
      div.insertAdjacentHTML("beforeend", "<button class='btn-sin-stock' disabled>SIN STOCK</button>");
    }
    else{
      div.insertAdjacentHTML("beforeend", "<button class='btn-agregar' data-id='${elemento.id}'>AGREGAR AL CARRITO</button>");
    }

    contenedor.appendChild(div);

  });

}

// FILTROS PARA PRODUCTOS

let filterStatus = "Todas";

function buscarProductos(){
  const buscador = document.getElementById("searchInput");

  const productosGuardados = JSON.parse(localStorage.getItem("productos"));

  if(!productosGuardados){
    renderizarProductos([]);
    return;
  }

  buscador.addEventListener("keyup", (evento) => {
    const texto = evento.target.value.toLowerCase().trim();

    let productosFiltrados = productosGuardados;

    // FILTRAMOS PRODUCTOS POR CATEGORÍA.
    if (filterStatus === "Clasicas"){
      productosFiltrados = productosFiltrados.filter(
          producto => producto.categoria === "Clásicas"
      );
    }

    if (filterStatus === "Especiales"){
        productosFiltrados = productosFiltrados.filter(
            producto => producto.categoria === "Especiales"
        );
    }

    if (filterStatus === "Combos"){
        productosFiltrados = productosFiltrados.filter(
            producto => producto.categoria === "Combos"
        );
    }

    // REALIZAMOS EL FILTRADO POR TEXTO.
    productosFiltrados = productosFiltrados.filter( producto =>
        producto.nombre.toLowerCase().includes(texto) ||
        producto.descripcion.toLowerCase().includes(texto)
    );

    renderizarProductos(productosFiltrados);
  });

}

function filtrarPrecio(){
  const seleccion = document.getElementById("opciones");
  const productosGuardados = JSON.parse(localStorage.getItem("productos"));

  if (!productosGuardados) {
      renderizarProductos([]);
      return;
  }

  let productosFiltrados = [...productosGuardados];

  if (seleccion.value === "ordenMenor") {
      productosFiltrados.sort((a, b) => a.precio - b.precio);
  }

  if (seleccion.value === "ordenMayor") {
      productosFiltrados.sort((a, b) => b.precio - a.precio);
  }

  renderizarProductos(productosFiltrados);

}

// FUNCION DEL CARRITO

const productosAgregados = []

function actualizarContadorCarrito(){
    let contador = document.getElementById("contador-carrito");

    if(!contador){
      return;
    }

    const productos = productosAgregados.length;
    contador.textContent = productos;

}

function agregarCarrito(){
  const contenedor = document.getElementById("productsContainer");
  
  contenedor.addEventListener("click", (e) => {

      if(e.target.classList.contains("btn-agregar")){

        const idProdActual = Number(e.target.dataset.id);

        console.log("AGREGADO!")

        const productosGuardados = JSON.parse(localStorage.getItem("productos")) || [];

        const producto = productosGuardados.find(
          item => item.id === idProdActual
        );
        
        if (producto) {
          productosAgregados.push(producto);
          actualizarContadorCarrito();

          console.log("Productos agregados:", productosAgregados);
        }
      }
  });

}


function clickearMenu(){
  const titulo = document.querySelector(".header-container h1");

  if (titulo){
    titulo.addEventListener("click", () => {

      const productos = JSON.parse(localStorage.getItem("productos"));
      renderizarProductos(productos);
      console.log("Se han renderizado los productos al hacer click.");

    });
  }

}

// CAMBIAR A CLICKEAR MENU
function init(){
  // clickearMenu();
  const productosGuardados = JSON.parse(localStorage.getItem("productos"));
  renderizarProductos(productosGuardados);

  buscarProductos();

  // QUE SE EJECUTE CADA VEZ QUE SELECCIONE OTRA OPCIÓN
  const seleccion = document.getElementById("opciones");
    seleccion.addEventListener("change", filtrarPrecio);

  agregarCarrito();
}

window.addEventListener("DOMContentLoaded", init);