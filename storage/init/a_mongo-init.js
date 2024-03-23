print('======================== Starting init +++++++++++++++++++++++++++++++')

db.createUser({
  user: "user1",
  pwd: "user1",
  roles: [{
    role: "readWrite",
    db: "claudia"
  }]
})

//use 'claudia';
//db.use("claudia")
db.response.insertOne({id:0, text: 'hola mundo'})
