const express = require('express')
const uuid = require('uuid')
const port = 3000

const app = express()
app.use(express.json())

const orders = []

const checkorderId = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex (order => order.id === id)

    if (index < 0) {
        return response.status(400).json({messager: "user not found"})
    }

    request.orderIndex = index
    request.orderId = id

    next()
}

const checkOrderURL = (request, response, next) => {
    console.log(`Método = ${request.method}, URL: ${request.url}`)

    next()
}


app.get('/order/:id', checkorderId, checkOrderURL, (request, response) => {

  const index = request.orderIndex

  const orderById = orders[index]

  return response.json(orderById)
})

app.get('/orders', checkOrderURL, (request, response) => {
    return response.json(orders)
})

app.post('/orders', checkOrderURL, (request, response) => {
    const { order, clientName, price, status } = request.body
    const orderId = { id: uuid.v4(), order, clientName, price, status }

    orders.push(orderId)

    return response.status(201).json(orders)
})

app.put('/orders/:id', checkorderId, checkOrderURL, (request, response) => {

    const {order, clientName, price, status} = request.body
    const index = request.orderIndex
    const id = request.orderId
    
    const updateOrder = {id, order, clientName, price, status }

    orders [index] = updateOrder
    
    //console.log(index)

    return response.json(updateOrder)

})

app.delete('/orders/:id', checkorderId, checkOrderURL, (request, response) => {
    
    const index = request.orderIndex

    orders.splice(index, 1)

    return response.status(204).json()

}) 



app.listen(3000, () => {
    console.log(`🚀 Server started on port ${port}`) 
})

