import cors from "cors";

const corsOptions = {
    origin: [
        'https://odonto-software.vercel.app/'
    ],
    methods: 'GET,POST,PATCH,DELETE',
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true
};

export default cors(corsOptions);