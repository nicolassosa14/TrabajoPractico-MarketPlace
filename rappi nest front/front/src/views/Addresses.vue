<template>
  <div class="direcciones-page">
    <!-- Header consistente -->
    <header class="header">
      <div class="container">
        <nav class="navbar">
          <div class="logo">
            <i class="fas fa-utensils"></i>
            <span>FoodExpress</span>
          </div>
          
          <div class="auth-buttons">
            <router-link to="/profile" class="btn btn-profile">Mi Perfil</router-link>
          </div>
        </nav>
      </div>
    </header>

    <!-- Contenido principal -->
    <main class="direcciones-main">
      <div class="container">
        <div class="direcciones-card">
          <div class="direcciones-header">
            <h1>Mis Direcciones</h1>
            <p>Gestiona tus direcciones de entrega</p>
          </div>

          <!-- Lista de direcciones -->
          <div v-if="direcciones.length" class="direcciones-list">
            <div v-for="dir in direcciones" :key="dir.id" class="direccion-item">
              <div class="direccion-info">
                <div class="direccion-header">
                  <h3>{{ dir.calle }} {{ dir.altura }}</h3>
                  <div class="direccion-actions">
                    <button @click="editDireccion(dir)" class="btn-edit">
                      <i class="fas fa-edit"></i> Editar
                    </button>
                    <button @click="deleteDireccion(dir.id)" class="btn-delete">
                      <i class="fas fa-trash"></i> Eliminar
                    </button>
                  </div>
                </div>
                <p class="direccion-details">
                  {{ dir.ciudad }}, {{ dir.provincia }}, {{ dir.pais }}
                </p>
                <p v-if="dir.instrucciones_entrega" class="direccion-instructions">
                  <i class="fas fa-info-circle"></i> {{ dir.instrucciones_entrega }}
                </p>
              </div>
            </div>
          </div>
          
          <div v-else class="no-direcciones">
            <i class="fas fa-map-marker-alt"></i>
            <p>No tenés direcciones cargadas</p>
          </div>

          <!-- Formulario crear/editar -->
          <div class="form-section">
            <h2>{{ editMode ? 'Editar Dirección' : 'Agregar Nueva Dirección' }}</h2>
            <form @submit.prevent="saveDireccion" class="direccion-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="calle">Calle</label>
                  <div class="input-container">
                    <i class="fas fa-road input-icon"></i>
                    <input 
                      id="calle"
                      v-model="form.calle" 
                      type="text" 
                      placeholder="Nombre de la calle"
                      required 
                    />
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="altura">Altura</label>
                  <div class="input-container">
                    <i class="fas fa-hashtag input-icon"></i>
                    <input 
                      id="altura"
                      v-model="form.altura" 
                      type="number" 
                      placeholder="Número"
                      required 
                    />
                  </div>
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="ciudad">Ciudad</label>
                  <div class="input-container">
                    <i class="fas fa-city input-icon"></i>
                    <input 
                      id="ciudad"
                      v-model="form.ciudad" 
                      type="text" 
                      placeholder="Tu ciudad"
                      required 
                    />
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="provincia">Provincia</label>
                  <div class="input-container">
                    <i class="fas fa-map input-icon"></i>
                    <input 
                      id="provincia"
                      v-model="form.provincia" 
                      type="text" 
                      placeholder="Tu provincia"
                      required 
                    />
                  </div>
                </div>
              </div>
              
              <div class="form-group">
                <label for="pais">País</label>
                <div class="input-container">
                  <i class="fas fa-globe-americas input-icon"></i>
                  <input 
                    id="pais"
                    v-model="form.pais" 
                    type="text" 
                    placeholder="País"
                  />
                </div>
              </div>
              
              <div class="form-group">
                <label for="instrucciones">Instrucciones de entrega</label>
                <div class="input-container">
                  <i class="fas fa-sticky-note input-icon"></i>
                  <textarea 
                    id="instrucciones"
                    v-model="form.instrucciones_entrega" 
                    placeholder="Instrucciones adicionales para el repartidor"
                    rows="3"
                  ></textarea>
                </div>
              </div>
              
              <div class="form-buttons">
                <button type="submit" class="btn-submit">
                  {{ editMode ? 'Actualizar Dirección' : 'Guardar Dirección' }}
                </button>
                <button v-if="editMode" type="button" @click="resetForm" class="btn-cancel">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer consistente -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-column">
            <div class="logo">
              <i class="fas fa-utensils"></i>
              <span>FoodExpress</span>
            </div>
            <p>La mejor plataforma de delivery de comida. Rápido, seguro y delicioso.</p>
          </div>
          
          <div class="footer-column">
            <h3>Contacto</h3>
            <ul>
              <li><i class="fas fa-map-marker-alt"></i> Calle Principal 123, Ciudad</li>
              <li><i class="fas fa-phone"></i> +1 234 567 890</li>
              <li><i class="fas fa-envelope"></i> info@foodexpress.com</li>
            </ul>
          </div>
        </div>
        
        <div class="copyright">
          <p>&copy; 2023 FoodExpress. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';

const API_URL = 'http://localhost:3000/direcciones';
const token = localStorage.getItem('token');

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
      usuario_id: parseJwt(token)?.sub
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
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.direcciones-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f9f9f9;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header */
.header {
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 24px;
  font-weight: 700;
  color: #e74c3c;
}

.logo i {
  font-size: 28px;
}

.auth-buttons {
  display: flex;
  gap: 15px;
}

.btn {
  padding: 10px 20px;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  font-size: 16px;
  text-decoration: none;
  display: inline-block;
}

.btn-profile {
  background-color: #e74c3c;
  color: white;
}

.btn-profile:hover {
  background-color: #c0392b;
  transform: translateY(-2px);
}

/* Main Content */
.direcciones-main {
  flex: 1;
  display: flex;
  align-items: flex-start;
  padding: 40px 0;
}

.direcciones-card {
  background: white;
  border-radius: 15px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.direcciones-header {
  text-align: center;
  margin-bottom: 30px;
}

.direcciones-header h1 {
  font-size: 32px;
  color: #333;
  margin-bottom: 10px;
}

.direcciones-header p {
  color: #666;
  font-size: 16px;
}

/* Lista de direcciones */
.direcciones-list {
  margin-bottom: 40px;
}

.direccion-item {
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 15px;
  transition: all 0.3s;
}

.direccion-item:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  border-color: #ddd;
}

.direccion-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.direccion-header h3 {
  font-size: 18px;
  color: #333;
  margin: 0;
}

.direccion-actions {
  display: flex;
  gap: 10px;
}

.btn-edit, .btn-delete {
  padding: 8px 15px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  display: flex;
  align-items: center;
  gap: 5px;
}

.btn-edit {
  background-color: transparent;
  color: #3498db;
  border: 1px solid #3498db;
}

.btn-edit:hover {
  background-color: #3498db;
  color: white;
}

.btn-delete {
  background-color: transparent;
  color: #e74c3c;
  border: 1px solid #e74c3c;
}

.btn-delete:hover {
  background-color: #e74c3c;
  color: white;
}

.direccion-details {
  color: #666;
  margin-bottom: 10px;
}

.direccion-instructions {
  color: #888;
  font-size: 14px;
  display: flex;
  align-items: flex-start;
  gap: 5px;
}

.direccion-instructions i {
  color: #e74c3c;
  margin-top: 2px;
}

/* Sin direcciones */
.no-direcciones {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.no-direcciones i {
  font-size: 50px;
  margin-bottom: 15px;
  color: #ddd;
}

.no-direcciones p {
  font-size: 18px;
}

/* Formulario */
.form-section {
  border-top: 1px solid #eee;
  padding-top: 30px;
}

.form-section h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

.direccion-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.input-container {
  position: relative;
}

.form-group input, .form-group textarea {
  width: 100%;
  padding: 15px 15px 15px 45px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s;
  resize: vertical;
}

.form-group input:focus, .form-group textarea:focus {
  outline: none;
  border-color: #e74c3c;
  box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2);
}

.input-icon {
  position: absolute;
  left: 15px;
  top: 15px;
  color: #999;
  font-size: 18px;
}

.form-buttons {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.btn-submit, .btn-cancel {
  padding: 15px 25px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.btn-submit {
  background: #e74c3c;
  color: white;
  flex: 1;
}

.btn-submit:hover {
  background: #c0392b;
  transform: translateY(-2px);
}

.btn-cancel {
  background: #f8f9fa;
  color: #666;
  border: 1px solid #ddd;
}

.btn-cancel:hover {
  background: #e9ecef;
}

/* Footer */
.footer {
  background-color: #2c3e50;
  color: white;
  padding: 50px 0 20px;
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 30px;
}

.footer-column h3 {
  margin-bottom: 20px;
  font-size: 20px;
}

.footer-column ul {
  list-style: none;
}

.footer-column ul li {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.footer-column a {
  color: #bdc3c7;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-column a:hover {
  color: #e74c3c;
}

.footer-column .logo {
  margin-bottom: 15px;
  color: white;
}

.footer-column p {
  color: #bdc3c7;
  margin-bottom: 20px;
  line-height: 1.6;
}

.copyright {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #34495e;
  color: #bdc3c7;
  font-size: 14px;
}

/* Responsive */
@media (max-width: 768px) {
  .direcciones-card {
    padding: 30px 20px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .direccion-header {
    flex-direction: column;
    gap: 10px;
  }
  
  .direccion-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .form-buttons {
    flex-direction: column;
  }
  
  .navbar {
    flex-direction: column;
    gap: 15px;
  }
  
  .auth-buttons {
    width: 100%;
    justify-content: center;
  }
}
</style>