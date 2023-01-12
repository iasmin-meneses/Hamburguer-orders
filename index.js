const express = require('express') //avisando que quero usar o express
const app = express() // colocando o express numa variável
const port = 3000 // variável para armazenar a porta
const uuid = require('uuid') // chamando a biblioteca uuid

app.use(express.json())//avisar ao express que esta requisiçao vai vir através de um json

const orders = [] //crio o array que vai receber os pedidos

const checkuserID = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex(user => user.id === id)
    if (index < 0) {
        return response.status(404).json({ error: "User not found" })
    }
    request.userIndex = index //estou criando um dado na requisição e dizendo que é = ao index
    request.userId = id

    next()
}

const checkMethod = (request, response, next) => {
    const method = request.method
    const url = request.url
    console.log(`Method: ${method}, \n URL: ${url}`)
    next()
}

app.post('/order', checkMethod, (request, response) => {
    const { order, clientName, price, status } = request.body
    const pedido = { id: uuid.v4(), order, clientName, price, status }

    orders.push(pedido)

    return response.status(201).json({ pedido })
})


app.get('/order', checkMethod, (request, response) => {
    return response.json({ orders })
})

app.put('/order/:id', checkuserID, checkMethod, (request, response) => {
    const { order, clientName, price, status } = request.body
    const id = request.userId
    const index = request.userIndex

    const updatedOrder = { id, order, clientName, price, status }

    orders[index] = updatedOrder

    return response.json({ updatedOrder })
})

app.delete('/order/:id', checkuserID, checkMethod, (request, response) => {
    const id = request.userId
    const index = request.userIndex

    orders.splice(index, 1)

    return response.status(204).json()
})

app.get('/order/:id', checkuserID, checkMethod, (request, response) => {
    const id = request.userId
    const index = request.userIndex

    const found = orders[index]

    return response.json({ found })
})


app.patch('/order/:id', checkuserID, checkMethod, (request, response) => {
    const { status } = request.body
    const id = request.userId
    const index = request.userIndex
    const founded = orders[index]

    order = founded.order
    clientName = founded.clientName
    price = founded.price

    const updatedStatus = { id, order, clientName, price, status }

    orders[index] = updatedStatus

    return response.json({ updatedStatus })
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})