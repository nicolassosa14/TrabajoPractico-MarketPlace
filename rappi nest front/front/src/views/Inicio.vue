<template>
  <div class="home-page">
    <!-- Header -->
    <header class="header">
      <div class="container">
        <nav class="navbar">
          <div class="logo">
            <i class="fas fa-utensils"></i>
            <span>FoodExpress</span>
          </div>
          
          <div class="auth-buttons">
            <router-link to="/login" class="btn btn-login">Iniciar Sesión</router-link>
            <router-link to="/register" class="btn btn-register">Registrarse</router-link>
          </div>
        </nav>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1>La mejor comida a tu puerta</h1>
          <p>Descubre los restaurantes más populares de tu ciudad y recibe tu pedido en minutos</p>
          
          <div class="search-bar">
            <input type="text" placeholder="¿Qué quieres comer hoy?" v-model="searchQuery">
            <button @click="redirectToLogin">Buscar</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="container">
        <h2 class="section-title">¿Por qué elegir FoodExpress?</h2>
        
        <div class="features-grid">
          <div class="feature-card" v-for="feature in features" :key="feature.id">
            <div class="feature-icon">
              <i :class="feature.icon"></i>
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Popular Restaurants -->
    <section class="restaurants">
      <div class="container">
        <h2 class="section-title">Restaurantes Populares</h2>
        
        <div class="restaurants-grid">
          <div 
            class="restaurant-card" 
            v-for="restaurant in filteredRestaurants" 
            :key="restaurant.id"
            @click="redirectToLogin"
          >
            <div class="restaurant-image" :style="{ backgroundImage: `url(${restaurant.image})` }"></div>
            <div class="restaurant-info">
              <h3>{{ restaurant.name }}</h3>
              <div class="rating">
                <i 
                  v-for="n in 5" 
                  :key="n" 
                  :class="n <= restaurant.rating ? 'fas fa-star' : (n - 0.5 <= restaurant.rating ? 'fas fa-star-half-alt' : 'far fa-star')"
                ></i>
                <span>{{ restaurant.rating.toFixed(1) }}</span>
              </div>
              <p>{{ restaurant.cuisine }} • {{ restaurant.priceRange }} • {{ restaurant.deliveryTime }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-column">
            <h3>FoodExpress</h3>
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
  name: 'HomePage',
  data() {
    return {
      searchQuery: '',
      features: [
        {
          id: 1,
          icon: 'fas fa-shipping-fast',
          title: 'Envío Rápido',
          description: 'Entregamos tu pedido en 30 minutos o menos, garantizado.'
        },
        {
          id: 2,
          icon: 'fas fa-utensils',
          title: 'Variedad de Opciones',
          description: 'Más de 500 restaurantes asociados con todo tipo de cocina.'
        },
        {
          id: 3,
          icon: 'fas fa-lock',
          title: 'Pago Seguro',
          description: 'Múltiples métodos de pago con total seguridad.'
        }
      ],
      restaurants: [
        {
          id: 1,
          name: 'La Trattoria',
          cuisine: 'Italiana',
          priceRange: '$$',
          deliveryTime: '25-35 min',
          rating: 4.5,
          image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
          id: 2,
          name: 'Sushi Palace',
          cuisine: 'Japonesa',
          priceRange: '$$$',
          deliveryTime: '30-40 min',
          rating: 4.0,
          image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
          id: 3,
          name: 'Burger House',
          cuisine: 'Americana',
          priceRange: '$',
          deliveryTime: '15-25 min',
          rating: 5.0,
          image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        }
      ]
    }
  },
  computed: {
    filteredRestaurants() {
      if (!this.searchQuery) return this.restaurants;
      
      const query = this.searchQuery.toLowerCase();
      return this.restaurants.filter(restaurant => 
        restaurant.name.toLowerCase().includes(query) || 
        restaurant.cuisine.toLowerCase().includes(query)
      );
    }
  },
  methods: {
    redirectToLogin() {
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
  background-color: #f9f9f9;
  color: #333;
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
  position: sticky;
  top: 0;
  z-index: 100;
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

.btn-register {
  background-color: #e74c3c;
  color: white;
}

.btn-register:hover {
  background-color: #c0392b;
  transform: translateY(-2px);
}

/* Hero Section */
.hero {
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80');
  background-size: cover;
  background-position: center;
  color: white;
  padding: 100px 0;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero h1 {
  font-size: 48px;
  margin-bottom: 20px;
}

.hero p {
  font-size: 20px;
  margin-bottom: 30px;
  line-height: 1.6;
}

.search-bar {
  display: flex;
  max-width: 600px;
  margin: 0 auto;
  background: white;
  border-radius: 50px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.search-bar input {
  flex: 1;
  padding: 15px 20px;
  border: none;
  outline: none;
  font-size: 16px;
}

.search-bar button {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0 25px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
}

/* Features Section */
.features {
  padding: 80px 0;
  background-color: white;
}

.section-title {
  text-align: center;
  margin-bottom: 50px;
  font-size: 36px;
  color: #333;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.feature-card {
  background: #f9f9f9;
  border-radius: 10px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-10px);
}

.feature-icon {
  font-size: 40px;
  color: #e74c3c;
  margin-bottom: 20px;
}

.feature-card h3 {
  margin-bottom: 15px;
  font-size: 22px;
}

/* Popular Restaurants */
.restaurants {
  padding: 80px 0;
  background-color: #f5f5f5;
}

.restaurants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}

.restaurant-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s;
  cursor: pointer;
}

.restaurant-card:hover {
  transform: translateY(-5px);
}

.restaurant-image {
  height: 180px;
  background-size: cover;
  background-position: center;
}

.restaurant-info {
  padding: 20px;
}

.restaurant-info h3 {
  margin-bottom: 10px;
}

.rating {
  color: #f39c12;
  margin-bottom: 10px;
}

.rating i {
  margin-right: 2px;
}

.rating span {
  margin-left: 5px;
  color: #333;
}

/* Footer */
.footer {
  background-color: #2c3e50;
  color: white;
  padding: 50px 0 20px;
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
}

.footer-column a {
  color: #bdc3c7;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-column a:hover {
  color: #e74c3c;
}

.social-icons {
  display: flex;
  gap: 15px;
  margin-top: 20px;
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
  
  .hero h1 {
    font-size: 36px;
  }
  
  .hero p {
    font-size: 18px;
  }
  
  .auth-buttons {
    flex-direction: column;
    width: 100%;
    max-width: 200px;
  }
  
  .btn {
    width: 100%;
    text-align: center;
  }
}
</style>