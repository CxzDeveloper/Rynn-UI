const axios = require('axios');

module.exports = function(app) {
    app.get('/search/tiktok', async (req, res) => {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ status: false, error: 'Query is required' });
        }

        try {
            const response = await axios.get('https://tikwm.com/api/feed/search', {
                params: { keyword: q }
            });

            console.log('TikWM API Response:', response.data); // Log hasil API

            if (!response.data || !response.data.data) {
                return res.status(500).json({ status: false, error: 'Invalid response from TikWM' });
            }

            const results = response.data.data.map(video => ({
                title: video.title || video.desc,
                author: video.author.nickname,
                username: video.author.unique_id,
                thumbnail: video.cover,
                videoUrl: video.play,
                videoUrlHD: video.wmplay,
                likes: video.digg_count,
                comments: video.comment_count,
                shares: video.share_count
            }));

            res.status(200).json({ status: true, result: results });
        } catch (error) {
            console.error('API Error:', error.response ? error.response.data : error.message);
            res.status(500).json({ status: false, error: error.message });
        }
    });
};
