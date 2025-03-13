document.addEventListener("DOMContentLoaded", function () {
    const comentarioForm = document.getElementById("comentarioForm");
    const comentariosLista = document.getElementById("comentarios-lista");
    const adminLoginBtn = document.getElementById("adminLogin");
    const adminLogoutBtn = document.getElementById("adminLogout");

    // Contraseña de administrador (¡Cámbiala!)
    const ADMIN_PASSWORD = "admin123";
    let esAdmin = false;

    // Cargar comentarios
    cargarComentarios();

    // Iniciar sesión como admin
    adminLoginBtn.addEventListener("click", function () {
        const password = prompt("Introduce la contraseña de administrador:");
        if (password === ADMIN_PASSWORD) {
            esAdmin = true;
            actualizarBotones();
        } else {
            alert("Contraseña incorrecta.");
        }
    });

    // Cerrar sesión como admin
    adminLogoutBtn.addEventListener("click", function () {
        esAdmin = false;
        actualizarBotones();
    });

    // Manejar envío del formulario
    comentarioForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const nombre = document.getElementById("nombre").value;
        const comentario = document.getElementById("comentario").value;

        if (nombre.trim() === "" || comentario.trim() === "") {
            alert("Por favor, completa todos los campos.");
            return;
        }

        const nuevoComentario = {
            id: Date.now(),
            nombre,
            comentario,
            fecha: new Date().toLocaleString()
        };

        guardarComentario(nuevoComentario);
        comentarioForm.reset();
    });

    function guardarComentario(comentario) {
        let comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];
        comentarios.push(comentario);
        localStorage.setItem("comentarios", JSON.stringify(comentarios));
        mostrarComentario(comentario);
    }

    function mostrarComentario(comentario) {
        const comentarioElemento = document.createElement("div");
        comentarioElemento.classList.add("comentario");
        comentarioElemento.innerHTML = `
            <p><strong>${comentario.nombre}</strong> <span>(${comentario.fecha})</span></p>
            <p>${comentario.comentario}</p>
            ${esAdmin ? `<button class="eliminar-btn" data-id="${comentario.id}">🗑️ Eliminar</button>` : ""}
        `;
        comentariosLista.prepend(comentarioElemento);

        // Si eres admin, activar botón de eliminar
        if (esAdmin) {
            comentarioElemento.querySelector(".eliminar-btn").addEventListener("click", function () {
                eliminarComentario(comentario.id);
            });
        }
    }

    function eliminarComentario(id) {
        let comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];
        comentarios = comentarios.filter(comentario => comentario.id !== id);
        localStorage.setItem("comentarios", JSON.stringify(comentarios));
        recargarComentarios();
    }

    function cargarComentarios() {
        let comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];
        comentariosLista.innerHTML = "";
        comentarios.forEach(comentario => mostrarComentario(comentario));
    }

    function recargarComentarios() {
        comentariosLista.innerHTML = "";
        cargarComentarios();
    }

    function actualizarBotones() {
        cargarComentarios(); // Recargar los comentarios para actualizar los botones de eliminar
        adminLoginBtn.style.display = esAdmin ? "none" : "inline-block";
        adminLogoutBtn.style.display = esAdmin ? "inline-block" : "none";
    }
});
