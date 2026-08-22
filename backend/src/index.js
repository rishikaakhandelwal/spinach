require('dotenv').config({ path: "./.env" })

connectDB()
    .then(() => {
        app.on('error', (error) => {
            console.log('errr: ', error)
            throw error
        })
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is listening at port http://localhost:${process.env.PORT}`)
        })
    })
    .catch((err) => {
        console.log("MongoDB connection failed !, ", err)
    }) 