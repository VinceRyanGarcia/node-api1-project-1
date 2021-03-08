// Imports
const express = require('express')
const User = require('./users/model')

// Instance of Express App
const server = express()

server.use(express.json())

// [POST]| /api/users | Creates a user using the information inside the request 
server.post('/api/users', (req, res) => {
    const newUser = req.body

if (!newUser.name || !newUser.bio) {
    res.status(400).json({ message: 'Please provide name and bio for the user'})
} else {
    User.insert(newUser)
    .then(user => {
        res.status(201).json({message:"created"})
    })
    .catch(err => {
        res.status(500).json({ message:"There was an error while saving the user to the database"})
    })
}
})

// [GET] | /api/users | Returns an array
server.get('/api/users', (req, res) => {
    User.find()
    .then(users => {
        res.status(200).json(users)
    })
    .catch(err => {
        res.status(500).json({ message:"The user could not be removed" })
    })
})

// [GET] | /api/users/:id | Returns the user object with the specific `id`
server.get( '/api/users/:id', ( req, res ) => {
    const { id } = req.params;

    User.findById( id )
        .then( user => {
            if( !user ){
                res.status( 404 ).json( { message: "The user with the specified ID does not exist" } )
            }else{
                res.json( user );
            }
        })
        .catch( err => res.status( 500 ).json( { message: "The user information could not be retrieved" } ) );
})

// [DELETE] | /api/users/:id | Removes the user with the specified `id` and returns the deleted
server.delete ('/api/users/:id', (req,res) => {
    const {id} = req.params;
    User.remove(id)
        .then ( User => {
            if( !User ){
                res.status(404).json( {message: "The user with the specified ID does not exist" })
            }else{
                res.status(200).json( { message:`User Deleted.`, data: user })
            }
        })
        .catch ( err => res.status(500).json( { message: "The user could not be removed"  }))
})

// [PUT] | /api/users/:id | Update the user with the specified `id` using data from `request body`
server.put( '/api/users/:id', ( req, res ) => {
    const { id } = req.params;
    const updates = req.body;

    User.update( id, updates )
        .then( user => {
            if( !updates.name || !updates.bio ){
                res.status( 400 ).json( { message: "Please provide name and bio for the user" } )
            }else{
                if( !user ){
                    res.status( 404 ).json( { message: "The user with the specified ID does not exist" } )
                }else{
                    res.status( 200 ).json( user );
                }
            }
        })
        .catch( err => res.status( 500 ).json( { message: "The user information could not be modified" } ) 
        );
})

// Endpoints
module.exports = server;