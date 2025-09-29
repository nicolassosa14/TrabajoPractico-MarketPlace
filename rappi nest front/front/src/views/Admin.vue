<<template>
  <div v-if="isAdmin" class="create-user-page">
    <h1>Crear Usuario</h1>

    <form @submit.prevent="handleCreateUser">
      <div>
        <label>Nombre:</label>
        <input v-model="form.nombre" type="text" required />
      </div>

      <div>
        <label>Apellido:</label>
        <input v-model="form.apellido" type="text" required />
      </div>

      <div>
        <label>Email:</label>
        <input v-model="form.email" type="email" required />
      </div>

      <div>
        <label>Contraseña:</label>
        <input v-model="form.password" type="password" required minlength="4" />
      </div>

      <div>
        <label>Rol:</label>
        <select v-model="form.tipoUsuario" required>
          <option value="VENDOR">Vendor</option>
          <option value="DRIVER">Driver</option>
        </select>
      </div>

      <button type="submit" :disabled="loading">
        <span v-if="!loading">Crear Usuario</span>
        <span v-else>Creando...</span>
      </button>

      <p v-if="message" :class="{ error: error }">{{ message }}</p>
    </form>
  </div>

  <div v-else>
    <p>No tienes permisos para acceder a esta página.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const form = ref({
  nombre: "",
  apellido: "",
  email: "",
  password: "",
  tipoUsuario: "VENDOR", // valor por defecto
});

const loading = ref(false);
const message = ref("");
const error = ref(false);
const isAdmin = ref(false);

onMounted(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    return router.push("/login");
  }

  try {
    // decodificamos el JWT sin librería externa
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.role !== "ADMIN") {
      return router.push("/"); // no es admin, fuera
    }
    isAdmin.value = true;
  } catch (err) {
    console.error("Token inválido", err);
    router.push("/login");
  }
});

const handleCreateUser = async () => {
  loading.value = true;
  message.value = "";
  error.value = false;

  try {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3000/admin/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form.value),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Error creando usuario");
    }

    await res.json();
    message.value = "Usuario creado correctamente!";
    error.value = false;

    form.value = {
      nombre: "",
      apellido: "",
      email: "",
      password: "",
      tipoUsuario: "VENDOR",
    };
  } catch (err) {
    console.error(err);
    message.value = err.message || "Error al crear usuario";
    error.value = true;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.create-user-page {
  max-width: 400px;
  margin: 50px auto;
  padding: 30px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

form div {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: 500;
  margin-bottom: 5px;
}

input, select {
  width: 100%;
  padding: 8px 12px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

button {
  padding: 10px 20px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

p.error {
  color: red;
}
</style>
