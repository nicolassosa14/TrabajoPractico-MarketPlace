<template>
  <div class="profile-page">
    <!-- Header consistente -->
    <header class="header">
      <div class="container">
        <nav class="navbar">
          <div class="logo">
            <i class="fas fa-utensils"></i>
            <span>FoodExpress</span>
          </div>
          
          <div class="auth-buttons">
            <button class="btn btn-logout" @click="logout">Cerrar Sesión</button>
          </div>
        </nav>
      </div>
    </header>

    <!-- Contenido principal del perfil -->
    <main class="profile-main">
      <div class="container">
        <div class="profile-header">
          <div class="avatar">
            <i class="fas fa-user-circle"></i>
          </div>
          <div class="profile-info">
            <h1>Mi Perfil</h1>
            <p>Gestiona tu información personal y preferencias</p>
          </div>
        </div>

        <div class="profile-card">
          <div v-if="loading" class="loading-container">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Cargando tu información...</p>
          </div>
          
          <div v-else>
            <form @submit.prevent="updateProfile" class="profile-form">
              <h2>Información Personal</h2>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="nombre">Nombre *</label>
                  <input 
                    id="nombre"
                    v-model="form.nombre" 
                    type="text" 
                    placeholder="Tu nombre"
                    required 
                  />
                  <i class="fas fa-user input-icon"></i>
                </div>

                <div class="form-group">
                  <label for="apellido">Apellido</label>
                  <input 
                    id="apellido"
                    v-model="form.apellido" 
                    type="text" 
                    placeholder="Tu apellido"
                  />
                  <i class="fas fa-user input-icon"></i>
                </div>
              </div>

              <div class="form-group">
                <label for="email">Correo Electrónico *</label>
                <input 
                  id="email"
                  v-model="form.email" 
                  type="email" 
                  placeholder="tu@email.com"
                  required 
                />
                <i class="fas fa-envelope input-icon"></i>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="cod_area">Código de Área *</label>
                  <input 
                    id="cod_area"
                    v-model="form.cod_area" 
                    type="text" 
                    placeholder="Ej: 54"
                    required 
                    maxlength="4"
                    @input="formatAreaCode"
                  />
                  <i class="fas fa-phone input-icon"></i>
                  <div class="hint">Solo números (ej: 54, 1, 34)</div>
                </div>

                <div class="form-group">
                  <label for="num_telefono">Teléfono</label>
                  <input 
                    id="num_telefono"
                    v-model="form.num_telefono" 
                    type="text" 
                    placeholder="Número de teléfono"
                    @input="formatPhoneNumber"
                  />
                  <i class="fas fa-mobile-alt input-icon"></i>
                </div>
              </div>

              <div class="password-section">
                <h3>Cambiar Contraseña</h3>
                <p class="section-description">Deja en blanco si no deseas cambiar la contraseña</p>
                
                <div class="form-group">
                  <label for="password">Nueva Contraseña</label>
                  <input 
                    id="password"
                    v-model="form.password" 
                    type="password" 
                    placeholder="Nueva contraseña"
                  />
                  <i class="fas fa-lock input-icon"></i>
                  <div class="password-strength" v-if="form.password">
                    <div class="strength-bar" :class="passwordStrength"></div>
                    <span class="strength-text">{{ strengthText }}</span>
                  </div>
                </div>
              </div>

              <div class="form-actions">
                <button type="button" class="btn-cancel" @click="resetForm">
                  Cancelar
                </button>
                <button type="submit" class="btn-save" :disabled="saving">
                  <span v-if="!saving">Guardar Cambios</span>
                  <span v-else class="loading-text">
                    <i class="fas fa-spinner fa-spin"></i> Guardando...
                  </span>
                </button>
              </div>
            </form>

            <div v-if="message" class="message" :class="{ 'error': message.includes('Error'), 'success': message.includes('correctamente') }">
              <i :class="message.includes('Error') ? 'fas fa-exclamation-circle' : 'fas fa-check-circle'"></i>
              {{ message }}
            </div>
          </div>
        </div>

        <div class="profile-actions">
          <h2>Acciones Rápidas</h2>
          <div class="actions-grid">
            <div class="action-card" @click="$router.push('/orders')">
              <i class="fas fa-shopping-bag"></i>
              <h3>Mis Pedidos</h3>
              <p>Revisa tu historial de pedidos</p>
            </div>
            <div class="action-card" @click="$router.push('/favorites')">
              <i class="fas fa-heart"></i>
              <h3>Favoritos</h3>
              <p>Tus restaurantes y platos favoritos</p>
            </div>
            <div class="action-card" @click="$router.push('/addresses')">
              <i class="fas fa-map-marker-alt"></i>
              <h3>Direcciones</h3>
              <p>Gestiona tus direcciones de entrega</p>
            </div>
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
            <div class="social-icons">
              <a href="#"><i class="fab fa-facebook-f"></i></a>
              <a href="#"><i class="fab fa-twitter"></i></a>
              <a href="#"><i class="fab fa-instagram"></i></a>
            </div>
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

<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

// Función para decodificar JWT
function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error decodificando JWT:', e);
    return {};
  }
}

export default {
  name: 'Profile',
  setup() {
    const router = useRouter();
    const form = ref({
      nombre: '',
      apellido: '',
      email: '',
      cod_area: '',
      num_telefono: '',
      password: '',
    });

    const originalForm = ref({});
    const loading = ref(true);
    const saving = ref(false);
    const message = ref('');

    let userId = null;
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
    } else {
      try {
        const decoded = decodeJWT(token);
        userId = decoded.sub || decoded.userId || decoded.id;
      } catch (error) {
        console.error('Error decoding token:', error);
        router.push('/login');
      }
    }

    const formatAreaCode = () => {
      // Solo permitir números, eliminar cualquier carácter no numérico
      form.value.cod_area = form.value.cod_area.replace(/[^\d]/g, '');
      
      // Limitar a 4 dígitos máximo
      if (form.value.cod_area.length > 4) {
        form.value.cod_area = form.value.cod_area.substring(0, 4);
      }
    };

    const formatPhoneNumber = () => {
      form.value.num_telefono = form.value.num_telefono.replace(/[^\d]/g, '');
      
      if (form.value.num_telefono.length > 15) {
        form.value.num_telefono = form.value.num_telefono.substring(0, 15);
      }
    };

    const passwordStrength = computed(() => {
      if (form.value.password.length === 0) return 'empty';
      if (form.value.password.length < 6) return 'weak';
      if (form.value.password.length < 8) return 'medium';
      return 'strong';
    });

    const strengthText = computed(() => {
      switch (passwordStrength.value) {
        case 'empty': return '';
        case 'weak': return 'Débil';
        case 'medium': return 'Media';
        case 'strong': return 'Fuerte';
        default: return '';
      }
    });

    const loadProfile = async () => {
      loading.value = true;
      message.value = '';
      
      try {
        const res = await fetch(`http://localhost:3000/usuarios/profile/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!res.ok) {
          throw new Error('Error cargando perfil');
        }
        
        const data = await res.json();
        Object.assign(form.value, data);
        // Guardar copia original para resetear
        originalForm.value = { ...data };
        
      } catch (err) {
        console.error(err);
        message.value = 'Error cargando perfil';
      } finally {
        loading.value = false;
      }
    };

    const updateProfile = async () => {
      saving.value = true;
      message.value = '';

      // Validar que el código de área solo contenga números
      if (form.value.cod_area && !/^\d+$/.test(form.value.cod_area)) {
        message.value = 'El código de área debe contener solo números';
        saving.value = false;
        return;
      }

      // Crear payload solo con campos modificados o no vacíos
      const payload = {};
      Object.keys(form.value).forEach(key => {
        if (form.value[key] !== originalForm.value[key] && form.value[key] !== '') {
          payload[key] = form.value[key];
        }
      });

      // Si no hay cambios
      if (Object.keys(payload).length === 0) {
        message.value = 'No se detectaron cambios para guardar';
        saving.value = false;
        return;
      }

      try {
        const res = await fetch(`http://localhost:3000/usuarios/profile/${userId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || 'Error al actualizar');
        }
        
        message.value = 'Perfil actualizado correctamente';
        // Actualizar la copia original
        originalForm.value = { ...form.value };
        
      } catch (err) {
        console.error(err);
        message.value = err.message || 'Error al actualizar el perfil';
      } finally {
        saving.value = false;
      }
    };

    const resetForm = () => {
      form.value = { ...originalForm.value };
      message.value = '';
    };

    const logout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('rememberMe');
      router.push('/login');
    };

    onMounted(() => {
      loadProfile();
    });

    return { 
      form, 
      loading, 
      saving, 
      message, 
      updateProfile, 
      resetForm,
      logout,
      formatAreaCode,
      formatPhoneNumber,
      passwordStrength,
      strengthText
    };
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.profile-page {
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

.btn-logout {
  background-color: transparent;
  color: #e74c3c;
  border: 2px solid #e74c3c;
}

.btn-logout:hover {
  background-color: #e74c3c;
  color: white;
}

/* Main Content */
.profile-main {
  flex: 1;
  padding: 40px 0;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.avatar {
  font-size: 60px;
  color: #e74c3c;
}

.profile-info h1 {
  font-size: 32px;
  color: #333;
  margin-bottom: 5px;
}

.profile-info p {
  color: #666;
  font-size: 16px;
}

.profile-card {
  background: white;
  border-radius: 15px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
}

.loading-container {
  text-align: center;
  padding: 40px;
  color: #666;
}

.loading-container i {
  font-size: 40px;
  margin-bottom: 15px;
  color: #e74c3c;
}

.profile-form h2 {
  margin-bottom: 25px;
  color: #333;
  font-size: 24px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
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

.form-group input {
  width: 100%;
  padding: 15px 15px 15px 45px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s;
}

.form-group input:focus {
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

.hint {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
  font-style: italic;
}

.password-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #f0f0f0;
}

.password-section h3 {
  margin-bottom: 5px;
  color: #333;
}

.section-description {
  color: #666;
  font-size: 14px;
  margin-bottom: 20px;
}

.password-strength {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.strength-bar {
  height: 4px;
  border-radius: 2px;
  flex: 1;
  transition: all 0.3s;
}

.strength-bar.empty {
  background: #f0f0f0;
}

.strength-bar.weak {
  background: #e74c3c;
  width: 33%;
}

.strength-bar.medium {
  background: #f39c12;
  width: 66%;
}

.strength-bar.strong {
  background: #27ae60;
  width: 100%;
}

.strength-text {
  font-size: 12px;
  color: #666;
  min-width: 40px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
}

.btn-cancel {
  padding: 12px 25px;
  border: 2px solid #ddd;
  background: white;
  color: #666;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel:hover {
  border-color: #999;
  background: #f5f5f5;
}

.btn-save {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-save:hover:not(:disabled) {
  background: #c0392b;
  transform: translateY(-2px);
}

.btn-save:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.loading-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.message {
  margin-top: 20px;
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

/* Profile Actions */
.profile-actions {
  margin-top: 40px;
}

.profile-actions h2 {
  margin-bottom: 25px;
  color: #333;
  font-size: 24px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.action-card {
  background: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  cursor: pointer;
  text-align: center;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.action-card i {
  font-size: 40px;
  color: #e74c3c;
  margin-bottom: 15px;
}

.action-card h3 {
  margin-bottom: 10px;
  color: #333;
}

.action-card p {
  color: #666;
  line-height: 1.5;
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
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .profile-card {
    padding: 30px 20px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
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