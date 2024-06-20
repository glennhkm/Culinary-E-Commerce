const { PrismaClient } = require("@prisma/client");
const bcrypt = require('bcryptjs');
const { id } = require("date-fns/locale");

const database = new PrismaClient();

const main = async () => {
    try {
        await database.users.createMany({
            data: [
                {
                    "fullName": "Admin",
                    "email": "admin@gmail.com",
                    "phoneNumber": "082284282780",
                    "password": await bcrypt.hash("admin", 10),
                    "address": "Lamdingin",
                    "role": "ADMIN"
                },
                {
                    "fullName": "Fasha",
                    "email": "fasha@gmail.com",
                    "phoneNumber": "082234328546",
                    "password": await bcrypt.hash("123", 10),
                    "address": "Lhoknga"
                },  
            ]   
        })
        await database.dashboard.createMany({
            data: [
                {
                    "id": "1",
                    "title": "Pengguna",
                    "value": 1
                },
                {
                    "id": "2",
                    "title": "Produk",
                    "value": 0
                },
                {
                    "id": "3",
                    "title": "Produk Terjual",
                    "value": 0
                },
                {
                    "id": "4",
                    "title": "Jumlah Pendapatan",
                    "value": 0
                }
            ]
        });
        await database.paymentMethod.createMany({
            data: [
                {
                    "id": "1",
                    "method": "Bank BRI",
                    "noRekening": "2513312738"
                },
                {
                    "id": "2",
                    "method": "Bank BNI",
                    "noRekening": "3422312346"
                },
                {
                    "id": "3",
                    "method": "COD",
                    "noRekening": ""
                },
                {
                    "id": "4",
                    "method": "Bank BCA",
                    "noRekening": "1234567890"
                },
                {
                    "id": "5",
                    "method": "DANA",
                    "noRekening": "0812317231"
                },
                {
                    "id": "6",
                    "method": "Gopay",
                    "noRekening": "2344218734"
                },
            ]
        });
        await database.productCategories.createMany({
            data: [
                {
                    id: "1",
                    categoryName: "Makanan",
                    description: "Hidangan khas Aceh dengan rempah-rempah kaya, menggabungkan rasa pedas dan gurih dari bahan-bahan segar seperti daging dan sayuran."                    
                },                    
                {
                    id: "2",
                    categoryName: "Minuman",
                    description: "Minuman beraroma kuat yang menggabungkan kopi, teh, susu, dan rempah-rempah, mencerminkan kekayaan budaya kuliner Aceh."                    
                },                    
            ]
        });
        console.log('Success');
    } catch (error) {
        console.log('Failed', error);
    } finally {
        await database.$disconnect();
    }
}

main();