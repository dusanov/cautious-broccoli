print('======================== Starting init +++++++++++++++++++++++++++++++')

db.createUser({
  user: "user1",
  pwd: "user1",
  roles: [{
    role: "readWrite",
    db: "claudia"
  }]
})

db.responses.insertOne({
    id:0, 
    name: 'hola_user',
    content: "p  Hola, eso es #{name} conectado !"
})
