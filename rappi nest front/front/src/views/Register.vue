<template>
  <div class="register-page">
    <!-- Header consistente -->
    <header class="header">
      <div class="container">
        <nav class="navbar">
          <div class="logo">
            <i class="fas fa-utensils"></i>
            <span>FoodExpress</span>
          </div>
          
          <div class="auth-buttons">
            <router-link to="/login" class="btn btn-login">Iniciar Sesión</router-link>
          </div>
        </nav>
      </div>
    </header>

    <!-- Contenido principal del registro -->
    <main class="register-main">
      <div class="container">
        <div class="register-card">
          <div class="register-header">
            <h1>Crear Cuenta</h1>
            <p>Únete a FoodExpress y disfruta de la mejor comida</p>
          </div>

          <form @submit.prevent="registerUser" class="register-form">
            <div class="form-row">
              <div class="form-group">
                <label for="nombre">Nombre *</label>
                <input 
                  id="nombre"
                  v-model="nombre" 
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
                  v-model="apellido" 
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
                v-model="email" 
                type="email" 
                placeholder="tu@email.com"
                required 
              />
              <i class="fas fa-envelope input-icon"></i>
            </div>

            <div class="form-group">
              <label for="password">Contraseña *</label>
              <input 
                id="password"
                v-model="password" 
                type="password" 
                placeholder="Crea una contraseña segura"
                required 
              />
              <i class="fas fa-lock input-icon"></i>
              <div class="password-strength">
                <div class="strength-bar" :class="passwordStrength"></div>
                <span class="strength-text">{{ strengthText }}</span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="cod_area">Código de Área *</label>
                <input 
                  id="cod_area"
                  v-model="cod_area" 
                  type="text" 
                  placeholder="Ej: +54"
                  required 
                  maxlength="5"
                  @input="formatAreaCode"
                />
                <i class="fas fa-phone input-icon"></i>
                <div class="hint">Formato: +número (ej: +54, +1, +34)</div>
              </div>

              <div class="form-group">
                <label for="num_telefono">Teléfono</label>
                <input 
                  id="num_telefono"
                  v-model="num_telefono" 
                  type="text" 
                  placeholder="Número de teléfono"
                  @input="formatPhoneNumber"
                />
                <i class="fas fa-mobile-alt input-icon"></i>
              </div>
            </div>

            <div class="form-options">
              <label class="checkbox-label">
                <input type="checkbox" v-model="acceptTerms" required />
                <span class="checkmark"></span>
                Acepto los <a href="#">términos y condiciones</a> y la <a href="#">política de privacidad</a>
              </label>
            </div>

            <div class="form-options">
              <label class="checkbox-label">
                <input type="checkbox" v-model="newsletter" />
                <span class="checkmark"></span>
                Deseo recibir ofertas y novedades por email
              </label>
            </div>

            <button type="submit" class="btn-register-submit" :disabled="loading">
              <span v-if="!loading">Crear mi cuenta</span>
              <span v-else class="loading-text">
                <i class="fas fa-spinner fa-spin"></i> Registrando...
              </span>
            </button>

            <div class="login-link">
              ¿Ya tienes una cuenta? 
              <router-link to="/login">Inicia sesión aquí</router-link>
            </div>
          </form>

          <div v-if="message" class="message" :class="{ 'error': message, 'success': false }">
            <i class="fas fa-exclamation-circle"></i>
            {{ message }}
          </div>
        </div>

        <div class="register-benefits">
          <h2>Beneficios de registrarte</h2>
          <div class="benefits-grid">
            <div class="benefit">
              <i class="fas fa-bolt"></i>
              <h3>Pedidos Express</h3>
              <p>Guarda tus datos y realiza pedidos en segundos</p>
            </div>
            <div class="benefit">
              <i class="fas fa-gift"></i>
              <h3>Ofertas Exclusivas</h3>
              <p>Recibe descuentos especiales para miembros</p>
            </div>
            <div class="benefit">
              <i class="fas fa-history"></i>
              <h3>Historial de Pedidos</h3>
              <p>Accede a tu historial y repite tus pedidos favoritos</p>
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
export default {
  name: "Register",
  data() {
    return {
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      cod_area: '',
      num_telefono: '',
      acceptTerms: false,
      newsletter: false,
      loading: false,
      message: ''
    };
  },
  computed: {
    passwordStrength() {
      if (this.password.length === 0) return 'empty';
      if (this.password.length < 6) return 'weak';
      if (this.password.length < 8) return 'medium';
      return 'strong';
    },
    strengthText() {
      switch (this.passwordStrength) {
        case 'empty': return '';
        case 'weak': return 'Débil';
        case 'medium': return 'Media';
        case 'strong': return 'Fuerte';
        default: return '';
      }
    }
  },
  methods: {
    formatAreaCode() {
      // Asegurar que empiece con + y solo tenga números después
      if (this.cod_area && !this.cod_area.startsWith('+')) {
        this.cod_area = '+' + this.cod_area.replace(/[^\d]/g, '');
      } else if (this.cod_area) {
        this.cod_area = '+' + this.cod_area.substring(1).replace(/[^\d]/g, '');
      }
      
      // Limitar a 5 caracteres máximo (incluyendo el +)
      if (this.cod_area.length > 5) {
        this.cod_area = this.cod_area.substring(0, 5);
      }
    },
    
    formatPhoneNumber() {
      // Remover cualquier carácter que no sea número
      this.num_telefono = this.num_telefono.replace(/[^\d]/g, '');
      
      // Limitar a 15 dígitos
      if (this.num_telefono.length > 15) {
        this.num_telefono = this.num_telefono.substring(0, 15);
      }
    },
    
    async registerUser() {
      this.loading = true;
      this.message = '';

      // Validar formato del código de área
      if (this.cod_area && !/^\+\d{1,4}$/.test(this.cod_area)) {
        this.message = 'El código de área debe tener el formato +número (ej: +54)';
        this.loading = false;
        return;
      }

      const payload = {
        nombre: this.nombre,
        apellido: this.apellido,
        email: this.email,
        password: this.password,
        num_telefono: this.num_telefono,
        cod_area: this.cod_area
      };

      try {
        const res = await fetch('http://localhost:3000/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errorData = await res.json();
          this.message = 'Error: ' + (errorData.message || 'Error en el registro');
          return;
        }

        // Registro exitoso
        this.message = '¡Registro exitoso! Redirigiendo...';
        
        // Redirigir después de un breve delay
        setTimeout(() => {
          this.$router.push('/profile');
        }, 1500);

      } catch (error) {
        console.error(error);
        this.message = 'Error de conexión. Intenta nuevamente.';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.register-page {
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

.btn-login {
  background-color: transparent;
  color: #e74c3c;
  border: 2px solid #e74c3c;
}

.btn-login:hover {
  background-color: #e74c3c;
  color: white;
}

/* Main Content */
.register-main {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 40px 0;
}

.register-main .container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: start;
}

.register-card {
  background: white;
  border-radius: 15px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-header h1 {
  font-size: 32px;
  color: #333;
  margin-bottom: 10px;
}

.register-header p {
  color: #666;
  font-size: 16px;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
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

.form-options {
  margin-bottom: 10px;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  font-size: 14px;
  line-height: 1.4;
}

.checkbox-label input {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #ddd;
  border-radius: 4px;
  margin-right: 8px;
  position: relative;
  transition: all 0.3s;
  flex-shrink: 0;
  margin-top: 2px;
}

.checkbox-label input:checked + .checkmark {
  background-color: #e74c3c;
  border-color: #e74c3c;
}

.checkbox-label input:checked + .checkmark:after {
  content: "✓";
  position: absolute;
  color: white;
  font-size: 12px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.checkbox-label a {
  color: #e74c3c;
  text-decoration: none;
}

.checkbox-label a:hover {
  text-decoration: underline;
}

.btn-register-submit {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 10px;
}

.btn-register-submit:hover:not(:disabled) {
  background: #c0392b;
  transform: translateY(-2px);
}

.btn-register-submit:disabled {
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

.login-link {
  text-align: center;
  color: #666;
  font-size: 14px;
  margin-top: 20px;
}

.login-link a {
  color: #e74c3c;
  text-decoration: none;
  font-weight: 500;
}

.login-link a:hover {
  text-decoration: underline;
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

/* Benefits Section */
.register-benefits {
  padding: 20px;
}

.register-benefits h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 24px;
}

.benefits-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.benefit {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.benefit i {
  font-size: 24px;
  color: #e74c3c;
  margin-top: 5px;
}

.benefit h3 {
  margin-bottom: 5px;
  color: #333;
  font-size: 18px;
}

.benefit p {
  color: #666;
  line-height: 1.5;
  font-size: 14px;
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
  .register-main .container {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .register-card {
    padding: 30px 20px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .benefits-grid {
    grid-template-columns: 1fr;
  }
  
  .benefit {
    flex-direction: column;
    text-align: center;
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