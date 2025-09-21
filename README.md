# Sentiment Lens - Phân tích Cảm xúc Mạng Xã hội

Một ứng dụng web full-stack được thiết kế để phân tích cảm xúc của các cuộc thảo luận công khai trên các nền tảng mạng xã hội. Dự án này cho phép người dùng nhập một chủ đề, và ứng dụng sẽ tự động tìm các cuộc thảo luận liên quan, thu thập bình luận, và cung cấp một báo cáo phân tích cảm xúc chi tiết.

## Quá trình Phát triển

Dự án này được phát triển theo một quy trình lặp và tinh chỉnh, thể hiện sự tiến hóa của một ý tưởng từ khái niệm ban đầu đến một sản phẩm tập trung hơn:

1.  **Ý tưởng ban đầu:** Xây dựng một công cụ phân tích cảm xúc chung cho một chủ đề bất kỳ.
2.  **Làm rõ:** Chúng ta nhanh chóng nhận ra rằng việc phân tích các **bình luận** dưới các bài đăng sẽ cho kết quả sâu sắc hơn là chỉ phân tích các bài đăng.
3.  **Cải tiến logic:** Thay vì tìm kiếm chung chung, chúng ta đã triển khai một logic thông minh hơn để tự động tìm các **subreddit liên quan** đến chủ đề, sau đó mới tìm các bài đăng phổ biến trong các subreddit đó.
4.  **Giải quyết vấn đề thực tế:** Chúng ta đã gỡ lỗi các vấn đề về kết nối API, xử lý các giới hạn của mô hình AI (cắt ngắn văn bản), và xử lý các trường hợp ngoại lệ như subreddit riêng tư.
5.  **Tương lai:** Chúng ta đã thảo luận về các cải tiến trong tương lai như cung cấp log trạng thái thời gian thực cho người dùng và chuyển đổi sang một mô hình phân tích tập trung vào URL duy nhất.

## Công nghệ sử dụng

-   **Frontend:** React, Tailwind CSS
-   **Backend:** Node.js, Express.js
-   **Cơ sở dữ liệu:** PostgreSQL (chạy trong Docker)
-   **Nguồn dữ liệu:** Reddit API
-   **Phân tích Cảm xúc:** Hugging Face Inference API
-   **Môi trường:** Docker, Docker Compose

## Hướng dẫn Cài đặt và Chạy dự án

### Yêu cầu

-   [Node.js](https://nodejs.org/) (phiên bản 18.x trở lên)
-   [Docker](https://www.docker.com/products/docker-desktop/) và Docker Compose
-   Tài khoản Reddit và Hugging Face để lấy API keys.

### Các bước cài đặt

1.  **Clone kho lưu trữ này:**
    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```

2.  **Cấu hình Backend:**
    -   Tạo một file tên là `.env` trong thư mục `backend`.
    -   Sao chép và dán nội dung sau vào file đó, thay thế các giá trị placeholder bằng thông tin của bạn:
        ```env
        # PostgreSQL Credentials
        DB_USER=sentiment_admin
        DB_PASSWORD=mysecretpassword
        DB_DATABASE=sentiment_app
        DB_HOST=localhost
        DB_PORT=5432

        # Reddit API Credentials
        REDDIT_CLIENT_ID=YOUR_REDDIT_CLIENT_ID
        REDDIT_CLIENT_SECRET=YOUR_REDDIT_CLIENT_SECRET

        # Hugging Face API Token
        HUGGINGFACE_API_TOKEN=YOUR_HUGGINGFACE_API_TOKEN
        ```

3.  **Cấu hình Frontend:**
    -   Tạo một file tên là `.env` trong thư mục `frontend`.
    -   Thêm dòng sau vào file:
        ```env
        REACT_APP_API_BASE_URL=http://localhost:3001/api/v1
        ```

4.  **Cấu hình Docker:**
    -   Mở file `docker-compose.yml` ở thư mục gốc.
    -   Đảm bảo rằng `POSTGRES_USER` và `POSTGRES_PASSWORD` khớp với những gì bạn đã đặt trong file `.env` của backend.

5.  **Khởi động Cơ sở dữ liệu:**
    -   Mở terminal trong thư mục gốc của dự án và chạy:
        ```bash
        docker-compose up -d
        ```

6.  **Chạy Database Migration:**
    -   Sau khi container Docker đã chạy, thực hiện các lệnh sau để tạo các bảng trong database:
        ```bash
        # Copy a migration file into the container
        docker cp "backend/migrations/001_initial_schema.sql" clonefromgpt-db-1:/tmp/001_initial_schema.sql

        # Run the migration
        docker exec clonefromgpt-db-1 psql -U sentiment_admin -d sentiment_app -f /tmp/001_initial_schema.sql
        ```

7.  **Cài đặt các gói phụ thuộc:**
    -   Mở một terminal và điều hướng đến thư mục `backend`:
        ```bash
        cd backend
        npm install
        ```
    -   Mở một terminal **khác** và điều hướng đến thư mục `frontend`:
        ```bash
        cd frontend
        npm install
        ```

### Chạy ứng dụng

1.  **Khởi động Backend:**
    -   Trong terminal của `backend`, chạy:
        ```bash
        npm start
        ```

2.  **Khởi động Frontend:**
    -   Trong terminal của `frontend`, chạy:
        ```bash
        npm start
        ```

3.  Mở trình duyệt của bạn và truy cập `http://localhost:3000`.
