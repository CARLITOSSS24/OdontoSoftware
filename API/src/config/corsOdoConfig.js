import cors from "cors";

const corsOptions = {
    origin: [
        'http://localhost:5173'
    ],
    methods: 'GET,POST,PATCH,DELETE',
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true
};

export default cors(corsOptions);