<template>
  <div class="login-page">
    <!-- Header consistente con la página principal -->
    <header class="header">
      <div class="container">
        <nav class="navbar">
          <div class="logo">
            <i class="fas fa-utensils"></i>
            <span>FoodExpress</span>
          </div>
          
          <div class="auth-buttons">
            <router-link to="/register" class="btn btn-register">Crear Cuenta</router-link>
          </div>
        </nav>
      </div>
    </header>

    <!-- Contenido principal del login -->
    <main class="login-main">
      <div class="container">
        <div class="login-card">
          <div class="login-header">
            <h1>Iniciar Sesión</h1>
            <p>Accede a tu cuenta para realizar pedidos</p>
          </div>

          <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-group">
              <label for="email">Correo Electrónico</label>
              <input 
                id="email"
                v-model="form.email" 
                type="email" 
                placeholder="tu@email.com"
                required 
              />
              <i class="fas fa-envelope input-icon"></i>
            </div>

            <div class="form-group">
              <label for="password">Contraseña</label>
              <input 
                id="password"
                v-model="form.password" 
                type="password" 
                placeholder="Ingresa tu contraseña"
                required 
              />
              <i class="fas fa-lock input-icon"></i>
            </div>


            <button type="submit" class="btn-login-submit" :disabled="loading">
              <span v-if="!loading">Ingresar a mi cuenta</span>
              <span v-else class="loading-text">
                <i class="fas fa-spinner fa-spin"></i> Ingresando...
              </span>
            </button>

            <div class="register-link">
              ¿No tienes una cuenta? 
              <router-link to="/register">Regístrate aquí</router-link>
            </div>
          </form>

          <div v-if="message" class="message" :class="{ 'error': message, 'success': false }">
            <i class="fas fa-exclamation-circle"></i>
            {{ message }}
          </div>
        </div>

        <div class="login-features">
          <div class="feature">
            <i class="fas fa-shipping-fast"></i>
            <h3>Envío Rápido</h3>
            <p>Recibe tus pedidos en 30 minutos o menos</p>
          </div>
          <div class="feature">
            <i class="fas fa-utensils"></i>
            <h3>+500 Restaurantes</h3>
            <p>La mayor variedad de tu ciudad</p>
          </div>
          <div class="feature">
            <i class="fas fa-lock"></i>
            <h3>Pago Seguro</h3>
            <p>Transacciones 100% protegidas</p>
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
import { ref } from "vue";
import { useRouter } from "vue-router";

// Formularios y estados
const form = ref({ email: "", password: "" });
const rememberMe = ref(false);
const message = ref("");
const loading = ref(false);
const router = useRouter();

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

// Función de login
const handleLogin = async () => {
  loading.value = true;
  message.value = "";

  try {
    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form.value),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Credenciales incorrectas");
    }

    const data = await res.json();

    // Guardar token
    localStorage.setItem("token", data.access_token);

    // Guardar user solo si quieres persistir info extra
    if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

    if (rememberMe.value) {
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("rememberMe");
    }

    // Obtener rol desde el token JWT
    const payload = parseJwt(data.access_token);
    const role = (payload?.role || "CLIENT").toUpperCase();

    // Redirección según rol
    switch (role) {
      case "ADMIN":
        router.push("/admin");
        break;
      case "VENDOR":
        router.push("/vendor");
        break;
      case "DRIVER":
        router.push("/driver");
        break;
      default:
        router.push("/client");
    }
  } catch (err) {
    console.error(err);
    message.value = err.message || "Error al iniciar sesión";
  } finally {
    loading.value = false;
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

.login-page {
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

.btn-register {
  background-color: #e74c3c;
  color: white;
}

.btn-register:hover {
  background-color: #c0392b;
  transform: translateY(-2px);
}

/* Main Content */
.login-main {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 40px 0;
}

.login-main .container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.login-card {
  background: white;
  border-radius: 15px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  font-size: 32px;
  color: #333;
  margin-bottom: 10px;
}

.login-header p {
  color: #666;
  font-size: 16px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
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

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
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

.forgot-password {
  color: #e74c3c;
  text-decoration: none;
  font-size: 14px;
}

.forgot-password:hover {
  text-decoration: underline;
}

.btn-login-submit {
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

.btn-login-submit:hover:not(:disabled) {
  background: #c0392b;
  transform: translateY(-2px);
}

.btn-login-submit:disabled {
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

.login-divider {
  display: flex;
  align-items: center;
  margin: 20px 0;
  color: #999;
}

.login-divider::before,
.login-divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: #ddd;
}

.login-divider span {
  padding: 0 15px;
  font-size: 14px;
}

.social-login {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.btn-social {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.btn-google:hover {
  border-color: #db4437;
  color: #db4437;
}

.btn-facebook:hover {
  border-color: #4267B2;
  color: #4267B2;
}

.register-link {
  text-align: center;
  color: #666;
  font-size: 14px;
}

.register-link a {
  color: #e74c3c;
  text-decoration: none;
  font-weight: 500;
}

.register-link a:hover {
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

/* Features Section */
.login-features {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.feature {
  text-align: center;
  padding: 30px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.feature i {
  font-size: 40px;
  color: #e74c3c;
  margin-bottom: 15px;
}

.feature h3 {
  margin-bottom: 10px;
  color: #333;
}

.feature p {
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
  .login-main .container {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .login-card {
    padding: 30px 20px;
  }
  
  .social-login {
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
