module.exports = function (app) {
    const axios = require("axios");

    app.get("/random/hadits", async (req, res) => {
        try {
            const { data } = await axios.get("https://api.myquran.com/v2/hadits/arbain/semua");
            const datanya = data.data;
            const randomData = datanya[Math.floor(Math.random() * datanya.length)];

            res.json({
                status: true,
                result: {
                    sumber: "Scraper Hadits Arbain",
                    nomor: randomData.no,
                    judul: randomData.judul,
                    teks_arab: randomData.arab,
                    terjemahan: randomData.indo
                }
            });
        } catch (error) {
            res.status(500).json({ status: false, error: "Gagal mengambil data" });
        }
    });
};
