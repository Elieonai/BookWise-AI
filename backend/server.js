require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

/* Sobe o Express localmente ou no Render. */
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
