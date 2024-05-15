import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const users = [];

const checkUserID = (request, response, next) => {
    const { id } = request.params;
    const index = users.findIndex(user => user.id === id);
    if (index < 0) {
        return response.status(404).json({ error: "User not found" });
    }
    request.userIndex = index;
    request.userID = id;
    next();
};

app.get('/users', (request, response) => {
    return response.json(users);
});

app.post('/users', (request, response) => {
    const { name, age } = request.body;
    const user = { id: uuidv4(), name, age };
    users.push(user);
    return response.status(201).json(user);
});

app.put('/users/:id', checkUserID, (request, response) => {
    const index = request.userIndex;
    const { name, age } = request.body;
    const updateUser = { id: request.userID, name, age };
    users[index] = updateUser;
    return response.json(updateUser);
});

app.delete('/users/:id', checkUserID, (request, response) => {
    const index = request.userIndex;
    users.splice(index, 1);
    return response.status(204).json();
});

app.listen(port, () => {
    console.log(`🚀 server started on port ${port}`);
});