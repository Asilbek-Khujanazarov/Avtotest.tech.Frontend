const express = require('express')
const path = require('path')

const app = express()

// Dist papkasidan static fayllarni tarqatish
app.use(express.static(path.resolve(__dirname, 'dist/auto-test.frontend')))

// Qaysi yo'nalishga kirmang, index.html qaytarib bergin
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist/auto-test.frontend', 'index.html'))
})

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Server is up on port ${port}`))
