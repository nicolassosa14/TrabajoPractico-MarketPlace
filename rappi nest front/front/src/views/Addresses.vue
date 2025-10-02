<template>
  <div class="container">
    <h1>Mis Direcciones</h1>

    <!-- Lista de direcciones -->
    <div v-if="direcciones.length">
      <div v-for="dir in direcciones" :key="dir.id" class="direccion">
        <strong>{{ dir.calle }} {{ dir.altura }}</strong>, {{ dir.ciudad }}, {{ dir.provincia }}, {{ dir.pais }}
        <p>{{ dir.instrucciones_entrega }}</p>
        <button @click="editDireccion(dir)">Editar</button>
        <button @click="deleteDireccion(dir.id)">Eliminar</button>
      </div>
    </div>
    <p v-else>No tenés direcciones cargadas.</p>

    <!-- Formulario crear/editar -->
    <h2>{{ editMode ? 'Editar Dirección' : 'Agregar Dirección' }}</h2>
    <form @submit.prevent="saveDireccion">
      <div>
        <label>Calle:</label>
        <input v-model="form.calle" required />
      </div>
      <div>
        <label>Altura:</label>
        <input v-model="form.altura" type="number" required />
      </div>
      <div>
        <label>Ciudad:</label>
        <input v-model="form.ciudad" required />
      </div>
      <div>
        <label>Provincia:</label>
        <input v-model="form.provincia" required />
      </div>
      <div>
        <label>País:</label>
        <input v-model="form.pais" />
      </div>
      <div>
        <label>Instrucciones:</label>
        <textarea v-model="form.instrucciones_entrega"></textarea>
      </div>
      <button type="submit">{{ editMode ? 'Actualizar' : 'Guardar' }}</button>
      <button type="button" @click="resetForm" v-if="editMode">Cancelar</button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';

const API_URL = 'http://localhost:3000/direcciones';
const token = localStorage.getItem('token'); // token JWT guardado

const direcciones = ref([]);
const editMode = ref(false);
const form = reactive({
  id: null,
  calle: '',
  altura: '',
  ciudad: '',
  provincia: '',
  pais: 'Argentina',
  latitud: '',
  longitud: '',
  instrucciones_entrega: ''
});

// Función para decodificar JWT
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

// Función genérica fetch con JWT
const fetchJWT = async (url, options = {}) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    }
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || 'Error en la petición');
  }
  return res.json();
};

// Cargar todas las direcciones
const loadDirecciones = async () => {
  try {
    direcciones.value = await fetchJWT(API_URL);
  } catch (err) {
    console.error(err);
    alert('Error al cargar las direcciones');
  }
};

// Crear o actualizar dirección
const saveDireccion = async () => {
  try {
    // Construir payload con usuario_id del JWT
    const payload = {
      calle: form.calle,
      altura: form.altura,
      ciudad: form.ciudad,
      provincia: form.provincia,
      pais: form.pais,
      instrucciones_entrega: form.instrucciones_entrega,
      usuario_id: parseJwt(token)?.sub // ajusta según tu JWT
    };

    // Solo enviar lat/lng si son válidos
    if (form.latitud !== '' && form.latitud != null) payload.latitud = Number(form.latitud);
    if (form.longitud !== '' && form.longitud != null) payload.longitud = Number(form.longitud);

    if (editMode.value) {
      await fetchJWT(`${API_URL}/${form.id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });
    } else {
      await fetchJWT(API_URL, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    }

    resetForm();
    loadDirecciones();
  } catch (err) {
    console.error(err);
    alert('Error al guardar la dirección: ' + err.message);
  }
};

// Cargar datos de la dirección a editar
const editDireccion = (dir) => {
  editMode.value = true;
  Object.assign(form, dir);
};

// Eliminar dirección
const deleteDireccion = async (id) => {
  if (!confirm('¿Deseás eliminar esta dirección?')) return;
  try {
    await fetchJWT(`${API_URL}/${id}`, { method: 'DELETE' });
    loadDirecciones();
  } catch (err) {
    console.error(err);
    alert('Error al eliminar la dirección');
  }
};

// Resetear formulario
const resetForm = () => {
  editMode.value = false;
  Object.assign(form, {
    id: null,
    calle: '',
    altura: '',
    ciudad: '',
    provincia: '',
    pais: 'Argentina',
    latitud: '',
    longitud: '',
    instrucciones_entrega: ''
  });
};

onMounted(() => {
  loadDirecciones();
});
</script>

<style scoped>
.container { max-width: 800px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; }
.direccion { border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; border-radius: 5px; }
form div { margin-bottom: 10px; }
label { display: inline-block; width: 120px; }
input, textarea { width: calc(100% - 130px); padding: 5px; }
button { margin: 5px; padding: 5px 10px; }
</style>
