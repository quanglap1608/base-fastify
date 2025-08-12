# Fastify API

API REST hiệu suất cao được xây dựng bằng Fastify, TypeScript và PostgreSQL. Dự án này cung cấp nền tảng vững chắc để xây dựng các dịch vụ web có thể mở rộng với trải nghiệm phát triển tuyệt vời.

## ✨ Tính năng chính

- **Fastify Framework**: Framework web hiệu suất cao cho Node.js
- **TypeScript**: Đảm bảo an toàn kiểu dữ liệu và các tính năng JavaScript hiện đại
- **PostgreSQL**: Cơ sở dữ liệu quan hệ mạnh mẽ với Drizzle ORM
- **Docker Support**: Hỗ trợ phát triển và triển khai bằng container
- **Cấu hình linh hoạt**: Quản lý cấu hình môi trường linh hoạt
- **Ghi log có cấu trúc**: Ghi log dựa trên Pino với định dạng đẹp
- **Di chuyển cơ sở dữ liệu**: Quản lý schema tự động với Drizzle Kit
- **Kiểm tra sức khỏe**: Endpoint kiểm tra sức khỏe tích hợp

## 📋 Yêu cầu hệ thống

- Node.js 18+ 
- Docker và Docker Compose
- PostgreSQL (nếu chạy locally không dùng Docker)

## 🚀 Cài đặt

### Cách 1: Sử dụng Docker (Khuyến nghị)

1. **Clone repository**
   ```bash
   git clone <địa-chỉ-repository>
   cd fastify-api
   ```

2. **Khởi động ứng dụng với Docker Compose**
   ```bash
   docker-compose up --build -d
   ```

3. **Chạy di chuyển cơ sở dữ liệu**
   ```bash
   docker-compose exec app npm run db:migrate
   ```

API sẽ có sẵn tại `http://localhost:8080`

### Cách 2: Phát triển local

1. **Clone repository**
   ```bash
   git clone <địa-chỉ-repository>
   cd fastify-api
   ```

2. **Cài đặt dependencies**
   ```bash
   npm install
   ```

3. **Thiết lập biến môi trường**
   ```bash
   cp .env.example .env
   # Chỉnh sửa .env với cấu hình cơ sở dữ liệu của bạn
   ```

4. **Khởi động PostgreSQL** (nếu không dùng Docker)
   ```bash
   # Khởi động PostgreSQL instance của bạn
   # Cập nhật DATABASE_URL trong .env
   ```

5. **Chạy di chuyển cơ sở dữ liệu**
   ```bash
   npm run db:migrate
   ```

6. **Khởi động server phát triển**
   ```bash
   npm run dev
   ```

## ⚙️ Cấu hình

### Biến môi trường

Tạo file `.env` trong thư mục gốc:

```env
NODE_ENV=development
PORT=8080
DATABASE_URL=postgresql://fastify_user:fastify_password@localhost:5432/fastify_db
PINO_LOG_LEVEL=info
```

### Cấu hình Docker

Ứng dụng được cấu hình chạy trên cổng **8080** trong Docker. Bạn có thể thay đổi ánh xạ cổng trong `docker-compose.yaml`:

```yaml
ports:
  - "127.0.0.1:8080:8080"
```

## 📚 API Endpoints

### Kiểm tra sức khỏe
- **GET** `/` - Endpoint kiểm tra sức khỏe
  ```json
  {
    "message": "Health check passed"
  }
  ```

### API Bài viết
- **GET** `/api/posts` - Lấy tất cả bài viết
  - Tham số truy vấn:
    - `limit` (tùy chọn): Số lượng bài viết trả về (mặc định: 10)
  
- **GET** `/api/posts/:id` - Lấy bài viết theo ID
  - Tham số đường dẫn:
    - `id`: UUID của bài viết

## 🗄️ Cấu trúc cơ sở dữ liệu

### Bảng Posts
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(256) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🛠️ Phát triển

### Các lệnh có sẵn

```bash
# Phát triển
npm run dev          # Khởi động server phát triển với hot reload
npm run build        # Build TypeScript thành JavaScript
npm run start        # Khởi động server production

# Cơ sở dữ liệu
npm run db:generate  # Tạo file migration mới
npm run db:migrate   # Chạy di chuyển cơ sở dữ liệu
npm run db:studio    # Mở Drizzle Studio (giao diện cơ sở dữ liệu)
```

### Cấu trúc dự án

```
fastify-api/
├── src/
│   ├── db/                 # Cấu hình và schema cơ sở dữ liệu
│   │   ├── schema/         # Drizzle ORM schemas
│   │   └── index.ts        # Kết nối cơ sở dữ liệu
│   ├── routes/             # Xử lý route API
│   ├── services/           # Tầng logic nghiệp vụ
│   ├── utils/              # Các hàm tiện ích
│   ├── main.ts             # Điểm vào ứng dụng
│   └── server.ts           # Cấu hình server Fastify
├── migrations/             # File di chuyển cơ sở dữ liệu
├── docker-compose.yaml     # Cấu hình dịch vụ Docker
├── Dockerfile             # Cấu hình image Docker
└── drizzle.config.ts      # Cấu hình Drizzle ORM
```

### Thêm route mới

1. Tạo file route mới trong `src/routes/`
2. Export một hàm router đăng ký các route
3. Import và đăng ký router trong `src/server.ts`

Ví dụ:
```typescript
// src/routes/users.ts
export const usersRouter = (fastify: FastifyInstance) => {
  fastify.get("/users", getUsersHandler);
  fastify.post("/users", createUserHandler);
};

// src/server.ts
fastify.register(usersRouter, { prefix: "api/users" });
```

## 🐳 Lệnh Docker

```bash
# Build và khởi động dịch vụ
docker-compose up --build -d

# Xem log
docker-compose logs -f app

# Dừng dịch vụ
docker-compose down

# Build lại và khởi động
docker-compose up --build --force-recreate -d

# Truy cập shell container
docker-compose exec app sh
```

## 🔍 Quản lý cơ sở dữ liệu

### Drizzle Studio
Truy cập giao diện cơ sở dữ liệu để phát triển:
```bash
npm run db:studio
# hoặc với Docker
docker-compose exec app npm run db:studio
```

### Tạo migration
Khi bạn thay đổi schema:
```bash
npm run db:generate
```

### Chạy migration
```bash
npm run db:migrate
# hoặc với Docker
docker-compose exec app npm run db:migrate
```

## 🚀 Triển khai

### Triển khai Docker Production

1. **Build image production**
   ```bash
   docker build -t fastify-api:latest .
   ```

2. **Thiết lập biến môi trường production**
   ```bash
   export NODE_ENV=production
   export DATABASE_URL=your_production_db_url
   export PORT=8080
   ```

3. **Chạy container**
   ```bash
   docker run -d \
     --name fastify-api \
     -p 8080:8080 \
     -e NODE_ENV=production \
     -e DATABASE_URL=$DATABASE_URL \
     -e PORT=8080 \
     fastify-api:latest
   ```

### Cấu hình theo môi trường

- **Development**: Sử dụng `tsx` để hot reloading
- **Production**: Sử dụng JavaScript đã biên dịch với cài đặt tối ưu
- **Docker**: Bao gồm tất cả dependencies và bước build cần thiết

## 📊 Giám sát và ghi log

Ứng dụng sử dụng Pino để ghi log có cấu trúc với các mức log sau:
- `error`: Lỗi ứng dụng
- `warn`: Thông báo cảnh báo
- `info`: Thông tin chung (mặc định)
- `debug`: Thông tin debug
- `trace`: Thông tin trace chi tiết

### Định dạng log
```json
{
  "level": "INFO",
  "time": 1754981585311,
  "pid": 18,
  "hostname": "container-id",
  "msg": "Server listening at http://0.0.0.0:8080"
}
```

## 🤝 Đóng góp

1. Fork repository
2. Tạo branch tính năng (`git checkout -b feature/tính-năng-tuyệt-vời`)
3. Commit thay đổi (`git commit -m 'Thêm tính năng tuyệt vời'`)
4. Push lên branch (`git push origin feature/tính-năng-tuyệt-vời`)
5. Mở Pull Request

## 📝 Giấy phép

Dự án này được cấp phép theo ISC License.

## 🆘 Xử lý sự cố

### Vấn đề thường gặp

**Cổng đã được sử dụng**
```bash
# Kiểm tra cái gì đang sử dụng cổng
lsof -i :8080
# Tắt process hoặc thay đổi cổng trong docker-compose.yaml
```

**Vấn đề kết nối cơ sở dữ liệu**
```bash
# Kiểm tra PostgreSQL có đang chạy không
docker-compose ps postgres
# Xem log cơ sở dữ liệu
docker-compose logs postgres
```

**Lỗi migration**
```bash
# Reset cơ sở dữ liệu (CẢNH BÁO: Sẽ xóa tất cả dữ liệu)
docker-compose down -v
docker-compose up -d
docker-compose exec app npm run db:migrate
```

### Tìm kiếm trợ giúp

- Kiểm tra log: `docker-compose logs app`
- Xác minh biến môi trường được thiết lập đúng
- Đảm bảo cơ sở dữ liệu có thể truy cập và migration đã cập nhật
- Kiểm tra trạng thái container Docker: `docker-compose ps`
