from flask import Flask, request, jsonify
from flask_cors import CORS
import yt_dlp

app = Flask(__name__)
# Enable CORS for all routes (allows Netlify/frontend origins)
CORS(app)

@app.route('/', methods=['GET'])
@app.route('/api', methods=['GET'])
def home():
    return jsonify({"status": "InstaBestDownloader API is online on Vercel!"})

# Accept BOTH POST (from downloader.js) and GET requests
@app.route('/api/download', methods=['POST', 'GET'])
def get_reel_data():
    reel_url = None

    # Handle incoming URL whether sent via POST JSON or GET query parameter
    if request.method == 'POST':
        data = request.get_json(silent=True) or {}
        reel_url = data.get('url')
    else:
        reel_url = request.args.get('url')

    if not reel_url:
        return jsonify({'success': False, 'error': 'Please provide an Instagram URL'}), 400

    ydl_opts = {
        'quiet': True,
        'skip_download': True,
        'format': 'best',
        'no_warnings': True,
        'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(reel_url, download=False)
            
            video_url = info.get('url')
            if not video_url and 'formats' in info and len(info['formats']) > 0:
                video_url = info['formats'][-1].get('url')

            return jsonify({
                'success': True,
                'author': info.get('uploader') or info.get('uploader_id') or '@instagram_creator',
                'caption': info.get('title') or info.get('description') or 'Downloaded via InstaBestDownloader',
                'thumbnail': info.get('thumbnail'),
                'videoUrl': video_url,
                'duration': f"0:{info.get('duration', 30)}"
            })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500