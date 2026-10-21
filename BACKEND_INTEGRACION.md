# 🔧 Ejemplos de Integración Backend - CodeIgniter 4

Esta es una referencia de cómo implementar los endpoints esperados en tu backend CodeIgniter 4.

---

## 1. Modelo: BusinessModel.php

```php
<?php

namespace App\Models;

use CodeIgniter\Model;

class BusinessModel extends Model
{
    protected $table = 'businesses';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $allowedFields = ['name', 'phone', 'email', 'address', 'status', 'user_id'];
    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';

    public function getWithPagination($page = 1, $limit = 10, $filters = [])
    {
        $builder = $this->builder();

        // Filtro por búsqueda
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $builder->like('name', $search)
                    ->orLike('email', $search)
                    ->orLike('phone', $search);
        }

        // Filtro por estado
        if (!empty($filters['status'])) {
            $builder->where('status', $filters['status']);
        }

        $total = $builder->countAllResults(false);
        $offset = ($page - 1) * $limit;
        
        $data = $builder->limit($limit)
                        ->offset($offset)
                        ->get()
                        ->getResultArray();

        $pages = ceil($total / $limit);

        return [
            'data' => $data,
            'total' => $total,
            'page' => (int)$page,
            'pages' => (int)$pages
        ];
    }

    public function getStats()
    {
        return [
            'businesses_total' => $this->countAll(),
            'businesses_active' => $this->where('status', 'active')->countAllResults(),
            'users_total' => 0, // TODO: implementar conteo de usuarios
            'pending_appointments' => 0 // TODO: implementar conteo de citas
        ];
    }
}
```

---

## 2. Controlador: AdminController.php

```php
<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\BusinessModel;
use CodeIgniter\HTTP\ResponseInterface;

class AdminController extends BaseController
{
    protected $businessModel;

    public function __construct()
    {
        $this->businessModel = new BusinessModel();
    }

    /**
     * GET /api/admin/stats
     * Obtiene estadísticas del sistema
     */
    public function getStats(): ResponseInterface
    {
        // Verificar autenticación y rol
        $this->verifyAuth('superadmin');

        try {
            $stats = $this->businessModel->getStats();
            return $this->response->setJSON($stats);
        } catch (\Exception $e) {
            return $this->response->setStatusCode(500)->setJSON([
                'message' => 'Error al obtener estadísticas',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * GET /api/admin/businesses
     * Obtiene lista de negocios con paginación y filtros
     */
    public function listBusinesses(): ResponseInterface
    {
        // Verificar autenticación y rol
        $this->verifyAuth('superadmin');

        try {
            $page = $this->request->getVar('page') ?? 1;
            $limit = $this->request->getVar('limit') ?? 10;
            $filters = [
                'search' => $this->request->getVar('search'),
                'status' => $this->request->getVar('status')
            ];

            $result = $this->businessModel->getWithPagination($page, $limit, $filters);
            
            return $this->response->setJSON($result);
        } catch (\Exception $e) {
            return $this->response->setStatusCode(500)->setJSON([
                'message' => 'Error al obtener negocios',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * GET /api/admin/businesses/:id
     * Obtiene detalles de un negocio
     */
    public function getBusiness($id): ResponseInterface
    {
        $this->verifyAuth('superadmin');

        try {
            $business = $this->businessModel->find($id);
            
            if (!$business) {
                return $this->response->setStatusCode(404)->setJSON([
                    'message' => 'Negocio no encontrado'
                ]);
            }

            return $this->response->setJSON($business);
        } catch (\Exception $e) {
            return $this->response->setStatusCode(500)->setJSON([
                'message' => 'Error al obtener negocio',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * POST /api/admin/businesses
     * Crea un nuevo negocio
     */
    public function createBusiness(): ResponseInterface
    {
        $this->verifyAuth('superadmin');

        try {
            $data = $this->request->getJSON(true);

            // Validación
            $rules = [
                'name' => 'required|string|min_length[3]|max_length[255]',
                'phone' => 'required|string|min_length[7]',
                'email' => 'required|valid_email',
                'address' => 'required|string|min_length[5]',
                'status' => 'in_list[active,inactive]'
            ];

            if (!$this->validate($rules)) {
                return $this->response->setStatusCode(400)->setJSON([
                    'message' => 'Validación fallida',
                    'errors' => $this->validator->getErrors()
                ]);
            }

            // Crear negocio
            $businessData = [
                'name' => $data['name'],
                'phone' => $data['phone'],
                'email' => $data['email'],
                'address' => $data['address'],
                'status' => $data['status'] ?? 'active',
                'user_id' => auth()->id() // Usuario autenticado
            ];

            $id = $this->businessModel->insert($businessData);
            $business = $this->businessModel->find($id);

            return $this->response->setStatusCode(201)->setJSON($business);
        } catch (\Exception $e) {
            return $this->response->setStatusCode(500)->setJSON([
                'message' => 'Error al crear negocio',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * PUT /api/admin/businesses/:id
     * Actualiza un negocio
     */
    public function updateBusiness($id): ResponseInterface
    {
        $this->verifyAuth('superadmin');

        try {
            $business = $this->businessModel->find($id);
            
            if (!$business) {
                return $this->response->setStatusCode(404)->setJSON([
                    'message' => 'Negocio no encontrado'
                ]);
            }

            $data = $this->request->getJSON(true);

            // Actualizar solo campos permitidos
            $updateData = [];
            $allowedFields = ['name', 'phone', 'email', 'address', 'status'];
            
            foreach ($allowedFields as $field) {
                if (isset($data[$field])) {
                    $updateData[$field] = $data[$field];
                }
            }

            $this->businessModel->update($id, $updateData);
            $updated = $this->businessModel->find($id);

            return $this->response->setJSON($updated);
        } catch (\Exception $e) {
            return $this->response->setStatusCode(500)->setJSON([
                'message' => 'Error al actualizar negocio',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * DELETE /api/admin/businesses/:id
     * Elimina un negocio
     */
    public function deleteBusiness($id): ResponseInterface
    {
        $this->verifyAuth('superadmin');

        try {
            $business = $this->businessModel->find($id);
            
            if (!$business) {
                return $this->response->setStatusCode(404)->setJSON([
                    'message' => 'Negocio no encontrado'
                ]);
            }

            $this->businessModel->delete($id);

            return $this->response->setJSON([
                'message' => 'Negocio eliminado correctamente'
            ]);
        } catch (\Exception $e) {
            return $this->response->setStatusCode(500)->setJSON([
                'message' => 'Error al eliminar negocio',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Middleware para verificar autenticación y rol
     */
    private function verifyAuth($requiredRole = 'superadmin')
    {
        // 1. Verificar token Bearer
        $authHeader = $this->request->getHeader('Authorization');
        
        if (!$authHeader) {
            return $this->response->setStatusCode(401)->setJSON([
                'message' => 'Token no proporcionado'
            ]);
        }

        $token = str_replace('Bearer ', '', (string)$authHeader);

        try {
            // TODO: Validar JWT token
            $user = $this->validateJWT($token);
        } catch (\Exception $e) {
            return $this->response->setStatusCode(401)->setJSON([
                'message' => 'Token inválido'
            ]);
        }

        // 2. Verificar rol
        if ($user['role'] !== $requiredRole) {
            return $this->response->setStatusCode(403)->setJSON([
                'message' => 'No tienes permisos para acceder a esta sección'
            ]);
        }

        return $user;
    }

    /**
     * Valida JWT token
     * TODO: Implementar con Firebase JWT o similar
     */
    private function validateJWT($token)
    {
        // Implementar validación real aquí
        // Por ahora, retorna datos del usuario desde token decodificado
        return [
            'id' => 1,
            'role' => 'superadmin',
            'email' => 'admin@example.com'
        ];
    }
}
```

---

## 3. Rutas: Config/Routes.php

```php
<?php

namespace Config;

$routes = Services::routes();
$routes->setAutoRoute(false);

$routes->group('api', ['namespace' => 'App\Controllers\Api'], function ($routes) {
    // Auth endpoints
    $routes->post('auth/login', 'AuthController::login');
    $routes->post('auth/logout', 'AuthController::logout');

    // Admin endpoints (protegidos)
    $routes->group('admin', function ($routes) {
        $routes->get('stats', 'AdminController::getStats');
        
        $routes->get('businesses', 'AdminController::listBusinesses');
        $routes->get('businesses/(:num)', 'AdminController::getBusiness/$1');
        $routes->post('businesses', 'AdminController::createBusiness');
        $routes->put('businesses/(:num)', 'AdminController::updateBusiness/$1');
        $routes->delete('businesses/(:num)', 'AdminController::deleteBusiness/$1');
    });
});

return $routes;
```

---

## 4. Estructura de Tabla SQL

```sql
CREATE TABLE businesses (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  address TEXT NOT NULL,
  status ENUM('active', 'inactive') DEFAULT 'active',
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_status (status),
  INDEX idx_user_id (user_id)
);
```

---

## 5. CORS Configuration

En el archivo `.env` o `Config/Cors.php`:

```php
<?php

namespace Config;

class Cors extends \CodeIgniter\Config\BaseConfig
{
    public $allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://tudominio.com'
    ];

    public $allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

    public $allowedHeaders = [
        'Authorization',
        'Content-Type',
        'Accept'
    ];

    public $exposedHeaders = ['Authorization'];
    public $maxAge = 7200;
    public $allowCredentials = true;
}
```

---

## 6. Respuesta de Login (Actualizada)

```php
public function login()
{
    $email = $this->request->getPost('email');
    $password = $this->request->getPost('password');

    // Validar credenciales...

    $user = $userModel->where('email', $email)->first();

    // Generar JWT token
    $token = $this->generateJWT($user);

    return $this->response->setJSON([
        'token' => $token,
        'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'phone' => $user['phone'],
            'role' => $user['role'] // 'superadmin', 'admin', 'user'
        ]
    ]);
}
```

---

## 7. Instalación de JWT (Recomendado)

```bash
composer require firebase/php-jwt
```

Uso:

```php
use Firebase\JWT\JWT;

class JWTHelper
{
    public static function generate($userId, $role)
    {
        $key = getenv('JWT_SECRET_KEY');
        $payload = [
            'iat' => time(),
            'exp' => time() + 86400, // 24 horas
            'iss' => 'tu-dominio.com',
            'sub' => $userId,
            'role' => $role
        ];
        
        return JWT::encode($payload, $key, 'HS256');
    }

    public static function validate($token)
    {
        $key = getenv('JWT_SECRET_KEY');
        return JWT::decode($token, $key, ['HS256']);
    }
}
```

---

## ✅ Checklist de Implementación

- [ ] Crear tabla `businesses` en MySQL
- [ ] Crear `BusinessModel.php`
- [ ] Crear `AdminController.php`
- [ ] Registrar rutas en `Config/Routes.php`
- [ ] Implementar validación de JWT
- [ ] Configurar CORS
- [ ] Agregar campo `role` a tabla `users`
- [ ] Actualizar endpoint de login para retornar `role`
- [ ] Testear cada endpoint con Postman/cURL
- [ ] Verificar que retorna 403 si usuario no es superadmin

---

## 🧪 Testing con cURL

```bash
# 1. Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'

# 2. Obtener estadísticas
curl -X GET http://localhost:8080/api/admin/stats \
  -H "Authorization: Bearer TOKEN_AQUI"

# 3. Crear negocio
curl -X POST http://localhost:8080/api/admin/businesses \
  -H "Authorization: Bearer TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Barbería Test",
    "phone": "+52 81 1234 5678",
    "email": "test@barberia.mx",
    "address": "Calle Principal 100",
    "status": "active"
  }'

# 4. Actualizar negocio
curl -X PUT http://localhost:8080/api/admin/businesses/1 \
  -H "Authorization: Bearer TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Barbería Test (Actualizada)",
    "status": "inactive"
  }'

# 5. Eliminar negocio
curl -X DELETE http://localhost:8080/api/admin/businesses/1 \
  -H "Authorization: Bearer TOKEN_AQUI"
```

---

## 📚 Referencias

- CodeIgniter 4 Models: https://codeigniter4.github.io/userguide/models/index.html
- CodeIgniter 4 Controllers: https://codeigniter4.github.io/userguide/controllers/index.html
- Firebase JWT: https://github.com/firebase/php-jwt
- CORS: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

---

**Nota:** Este es un ejemplo base. Adapta según tu estructura actual de CodeIgniter 4 y requísitos de seguridad.
