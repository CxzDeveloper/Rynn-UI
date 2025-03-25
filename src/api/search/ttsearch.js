const axios = require("axios");

module.exports = function (app) {
    app.get("/search/tiktok", async (req, res) => {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ status: false, error: "Query is required" });
        }

        try {
            const { data } = await axios.get("https://www.tikwm.com/api/feed/search", {
                params: { keyword: q, count: 10 },
                headers: {
                    "User-Agent": "Mozilla/5.0",
                    "Referer": "https://www.tikwm.com/",
                },
            });

            if (!data || !data.data) {
                return res.status(500).json({ status: false, error: "Gagal mengambil data TikTok." });
            }

            const results = data.data.map(video => ({
                title: video.title || video.desc,
                author: video.author.nickname,
                username: video.author.unique_id,
                thumbnail: video.cover,
                videoUrl: video.play,
                videoUrlHD: video.wmplay,
                likes: video.digg_count,
                comments: video.comment_count,
                shares: video.share_count,
            }));

            res.status(200).json({ status: true, result: results });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
};
