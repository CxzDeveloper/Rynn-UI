module.exports = function (app) {
    const axios = require("axios");

    app.get("/search/shinigami", async (req, res) => {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ status: false, error: "Query is required" });
        }

        try {
            const response = await axios.get("https://api.shngm.io/v1/manga/list", {
                params: {
                    page: 1,
                    page_size: 24,
                    genre_include_mode: "or",
                    genre_exclude_mode: "or",
                    sort: "popularity",
                    sort_order: "desc",
                    q: q
                }
            });

            if (response.data.retcode === 0 && response.data.data) {
                const result = response.data.data.map(manga => ({
                    manga_id: manga.manga_id,
                    title: manga.title,
                    description: manga.description,
                    country: manga.country_id,
                    genre: manga.taxonomy.Genre.map(g => g.name),
                    author: manga.taxonomy.Author.map(a => a.name),
                    type: manga.taxonomy.Format.map(f => f.name),
                    user_rate: manga.user_rate,
                    view_count: manga.view_count,
                    cover: manga.cover_image_url,
                    total_chapter: manga.latest_chapter_number,
                    release: manga.release_year,
                    rank: manga.rank
                }));

                res.status(200).json({ status: true, result });
            } else {
                res.status(404).json({ status: false, error: "Data tidak ditemukan" });
            }
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
};
