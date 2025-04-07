import { Pool, types } from 'pg';
import 'dotenv/config';

// Cấu hình parser cho các loại timestamp
types.setTypeParser(types.builtins.TIMESTAMPTZ, (val) => {
	// Trả về thời gian dưới dạng string (giữ nguyên như trong DB)
	// hoặc có thể chuyển thành Date object với múi giờ VN
	return val; // Trả về nguyên bản "2025-04-07 03:30:33.271312+07"
	// Hoặc nếu muốn chuyển thành Date object:
	// return new Date(val + '+0700');
});

types.setTypeParser(types.builtins.TIMESTAMP, (val) => {
	// Xử lý timestamp không có timezone
	return val; // hoặc new Date(val + '+0700');
});

const pool = new Pool({
	user: process.env.DB_USERNAME,
	database: process.env.DB,
	password: process.env.DB_PASSWORD,
	host: process.env.DB_HOST,
	port: +(process.env.DB_PORT || 5432),
	// Thêm cấu hình timezone
	connectionString: process.env.DB_URL // Nếu có connection string
	// Thêm option để không chuyển đổi timezone
	// types: {
	//   getTypeParser: () => (val) => val // Trả về nguyên bản
	// }
});

// Hoặc thiết lập timezone cho mỗi kết nối
pool.on('connect', (client) => {
	client.query("SET TIME ZONE 'Asia/Ho_Chi_Minh';");
});

export default pool;
