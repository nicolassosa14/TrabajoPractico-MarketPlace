<template>
  <div class="admin-page">
    <!-- Header consistente -->
    <header class="header">
      <div class="container">
        <nav class="navbar">
          <div class="logo">
            <i class="fas fa-utensils"></i>
            <span>FoodExpress</span>
          </div>
          
          <div class="auth-buttons">
            <button @click="handleLogout" class="btn btn-logout">
              <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
            </button>
          </div>
        </nav>
      </div>
    </header>

    <!-- Contenido principal -->
    <main class="admin-main" v-if="isAdmin">
      <div class="container">
        <div class="admin-header">
          <h1>Gestión de Usuarios</h1>
          <p>Administra los usuarios del sistema FoodExpress</p>
        </div>

        <div class="admin-actions">
          <button @click="openCreateModal" class="btn btn-primary">
            <i class="fas fa-plus"></i> Crear Nuevo Usuario
          </button>
        </div>

        <div class="users-table-container">
          <table class="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.nombre }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <span class="role-badge" :class="user.role.toLowerCase()">
                    {{ user.role }}
                  </span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button @click="openEditModal(user)" class="btn-action btn-edit" title="Editar">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button @click="deleteUser(user.id)" class="btn-action btn-delete" title="Eliminar">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Modal Crear / Editar -->
        <div v-if="showModal" class="modal-overlay" @click="closeModal">
          <div class="modal" @click.stop>
            <div class="modal-header">
              <h2>{{ editingUser ? 'Editar Usuario' : 'Crear Usuario' }}</h2>
              <button @click="closeModal" class="btn-close">
                <i class="fas fa-times"></i>
              </button>
            </div>
            
            <form @submit.prevent="handleSubmit" class="modal-form">
              <div class="form-group">
                <label for="nombre">Nombre:</label>
                <input 
                  id="nombre"
                  v-model="form.nombre" 
                  type="text" 
                  placeholder="Ingresa el nombre completo"
                  required 
                />
                <i class="fas fa-user input-icon"></i>
              </div>

              <div class="form-group">
                <label for="email">Email:</label>
                <input 
                  id="email"
                  v-model="form.email" 
                  type="email" 
                  placeholder="ejemplo@correo.com"
                  required 
                />
                <i class="fas fa-envelope input-icon"></i>
              </div>

              <div class="form-group">
                <label for="password">Contraseña:</label>
                <input 
                  id="password"
                  v-model="form.password" 
                  type="password" 
                  :placeholder="editingUser ? 'Dejar vacío para mantener actual' : 'Ingresa una contraseña'"
                  :required="!editingUser" 
                  minlength="4"
                />
                <i class="fas fa-lock input-icon"></i>
                <small v-if="editingUser">Déjalo vacío si no quieres cambiar la contraseña</small>
              </div>

              <div class="form-group">
                <label for="rol">Rol:</label>
                <select id="rol" v-model="form.rol" required>
                  <option value="vendor">Vendor</option>
                  <option value="driver">Driver</option>
                </select>
                <i class="fas fa-user-tag input-icon"></i>
              </div>

              <div class="modal-actions">
                <button type="submit" class="btn btn-primary" :disabled="loading">
                  <span v-if="!loading">
                    <i class="fas fa-save"></i> {{ editingUser ? 'Actualizar' : 'Crear' }}
                  </span>
                  <span v-else class="loading-text">
                    <i class="fas fa-spinner fa-spin"></i> Guardando...
                  </span>
                </button>
                <button type="button" @click="closeModal" class="btn btn-secondary">
                  <i class="fas fa-times"></i> Cancelar
                </button>
              </div>
            </form>
            
            <div v-if="message" class="message" :class="{ 'error': error, 'success': !error }">
              <i class="fas" :class="error ? 'fa-exclamation-circle' : 'fa-check-circle'"></i>
              {{ message }}
            </div>
          </div>
        </div>
      </div>
    </main>

    <div v-else class="no-permission">
      <div class="container">
        <div class="no-permission-content">
          <i class="fas fa-lock"></i>
          <h2>Acceso Restringido</h2>
          <p>No tienes permisos para acceder a esta página.</p>
          <router-link to="/" class="btn btn-primary">
            <i class="fas fa-home"></i> Volver al Inicio
          </router-link>
        </div>
      </div>
    </div>

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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const isAdmin = ref(false);
const users = ref([]);
const showModal = ref(false);
const editingUser = ref(null);
const form = ref({
  nombre: '',
  email: '',
  password: '',
  rol: 'vendor', // minúsculas
});
const loading = ref(false);
const message = ref('');
const error = ref(false);

const token = localStorage.getItem('token');

onMounted(() => {
  if (!token) return router.push('/login');

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.role !== 'ADMIN') return router.push('/');
    isAdmin.value = true;
    fetchUsers();
  } catch (err) {
    console.error('Token inválido', err);
    router.push('/login');
  }
});

// -------------------------
// Fetch lista de usuarios
// -------------------------
const fetchUsers = async () => {
  try {
    const res = await fetch('http://localhost:3000/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Error cargando usuarios');
    users.value = await res.json();
  } catch (err) {
    console.error(err);
  }
};

// -------------------------
// Abrir modal crear
// -------------------------
const openCreateModal = () => {
  editingUser.value = null;
  form.value = { nombre: '', email: '', password: '', rol: 'vendor' };
  message.value = '';
  error.value = false;
  showModal.value = true;
};

// -------------------------
// Abrir modal editar
// -------------------------
const openEditModal = (user) => {
  editingUser.value = user;
  form.value = { 
    nombre: user.nombre, 
    email: user.email, 
    password: '',        
    rol: user.role.toLowerCase() // minúsculas
  };
  message.value = '';
  error.value = false;
  showModal.value = true;
};

// -------------------------
// Cerrar modal
// -------------------------
const closeModal = () => {
  showModal.value = false;
  message.value = '';
  error.value = false;
};

// -------------------------
// Crear o actualizar usuario
// -------------------------
const handleSubmit = async () => {
  loading.value = true;
  message.value = '';
  error.value = false;

  try {
    const url = editingUser.value
      ? `http://localhost:3000/admin/users/${editingUser.value.id}`
      : 'http://localhost:3000/admin/users';
    const method = editingUser.value ? 'PATCH' : 'POST';

    // Construir payload dinámicamente
    const payload = {
      nombre: form.value.nombre,
      email: form.value.email,
      rol: form.value.rol, // minúsculas
      ...(form.value.password ? { password: form.value.password } : {}) // solo si existe
    };

    console.log('Enviando payload:', payload);

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || 'Error al guardar usuario');
    }

    message.value = editingUser.value ? 'Usuario actualizado!' : 'Usuario creado!';
    setTimeout(() => {
      closeModal();
      fetchUsers();
    }, 1500);
  } catch (err) {
    console.error(err);
    message.value = err.message;
    error.value = true;
  } finally {
    loading.value = false;
  }
};

// -------------------------
// Eliminar usuario
// -------------------------
const deleteUser = async (id) => {
  if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;

  try {
    const res = await fetch(`http://localhost:3000/admin/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Error eliminando usuario');
    fetchUsers();
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

// -------------------------
// Cerrar sesión
// -------------------------
const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/login');
};
</script>


<style scoped>
/* Los estilos se mantienen igual */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.admin-page {
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-logout {
  background-color: #e74c3c;
  color: white;
}

.btn-logout:hover {
  background-color: #c0392b;
  transform: translateY(-2px);
}

.btn-primary {
  background-color: #e74c3c;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #c0392b;
  transform: translateY(-2px);
}

.btn-secondary {
  background-color: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background-color: #7f8c8d;
  transform: translateY(-2px);
}

.btn:disabled {
  cursor: not-allowed;
  background: #ccc;
  transform: none;
}

/* Main Content */
.admin-main {
  flex: 1;
  padding: 40px 0;
}

.admin-header {
  text-align: center;
  margin-bottom: 30px;
}

.admin-header h1 {
  font-size: 32px;
  color: #333;
  margin-bottom: 10px;
}

.admin-header p {
  color: #666;
  font-size: 16px;
}

.admin-actions {
  margin-bottom: 30px;
}

.users-table-container {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th,
.users-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.users-table th {
  font-weight: 600;
  color: #333;
  background-color: #f8f9fa;
}

.users-table tr:hover {
  background-color: #f8f9fa;
}

.role-badge {
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.role-badge.vendor {
  background-color: #e1f5fe;
  color: #0288d1;
}

.role-badge.driver {
  background-color: #e8f5e9;
  color: #388e3c;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.btn-action {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-edit {
  background-color: #3498db;
  color: white;
}

.btn-edit:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
}

.btn-delete {
  background-color: #e74c3c;
  color: white;
}

.btn-delete:hover {
  background-color: #c0392b;
  transform: translateY(-2px);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background: white;
  border-radius: 15px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  font-size: 24px;
  color: #333;
}

.btn-close {
  background: none;
  border: none;
  font-size: 20px;
  color: #95a5a6;
  cursor: pointer;
  transition: color 0.3s;
}

.btn-close:hover {
  color: #e74c3c;
}

.modal-form {
  padding: 25px;
}

.form-group {
  position: relative;
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 15px 15px 15px 45px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #e74c3c;
  box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2);
}

.input-icon {
  position: absolute;
  left: 15px;
  top: 40px;
  color: #999;
  font-size: 18px;
}

.form-group small {
  display: block;
  margin-top: 5px;
  color: #7f8c8d;
  font-size: 12px;
}

.modal-actions {
  display: flex;
  gap: 15px;
  margin-top: 25px;
}

.modal-actions .btn {
  flex: 1;
}

.loading-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.message {
  margin: 15px 25px;
  padding: 12px 15px;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.message.error {
  background: #ffeaea;
  color: #d63031;
  border: 1px solid #ffcccc;
}

.message.success {
  background: #eaffea;
  color: #00b894;
  border: 1px solid #ccffcc;
}

/* No Permission */
.no-permission {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 40px 0;
}

.no-permission-content {
  text-align: center;
  max-width: 500px;
  margin: 0 auto;
  padding: 40px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.no-permission-content i {
  font-size: 60px;
  color: #e74c3c;
  margin-bottom: 20px;
}

.no-permission-content h2 {
  font-size: 28px;
  color: #333;
  margin-bottom: 15px;
}

.no-permission-content p {
  color: #666;
  margin-bottom: 25px;
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

.social-icons {
  display: flex;
  gap: 15px;
}

.social-icons a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #34495e;
  border-radius: 50%;
  transition: background 0.3s;
  color: white;
}

.social-icons a:hover {
  background: #e74c3c;
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
  .navbar {
    flex-direction: column;
    gap: 15px;
  }
  
  .auth-buttons {
    width: 100%;
    justify-content: center;
  }
  
  .users-table-container {
    padding: 20px;
  }
  
  .users-table {
    min-width: 600px;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 5px;
  }
  
  .btn-action {
    width: 32px;
    height: 32px;
  }
}
</style>