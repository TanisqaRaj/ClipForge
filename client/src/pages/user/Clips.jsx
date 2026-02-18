import { useState, useEffect } from 'react';
import toast from '../../utils/toast';
import { getVideoUrl, formatDuration } from '../../utils/videoUrl';
import { getEmotionColor } from '../../utils/helpers';

function Clips() {
  const [clips, setClips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingClip, setEditingClip] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchClips();
  }, []);

  const fetchClips = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('No authentication token found');
        toast.error('Please log in again');
        return;
      }

      console.log('📥 Fetching clips from database...');
      
      const response = await fetch('http://localhost:5000/api/clips/my-clips', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Clips response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Loaded ${data.clips.length} clips from database`);
        console.log('Sample clip data:', data.clips[0]);
        setClips(data.clips);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Failed to load clips:', errorData);
        toast.error(`Failed to load clips: ${errorData.error || response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching clips:', error);
      toast.error(`Failed to load clips: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClip = (clip) => {
    setEditingClip(clip.id);
    setEditTitle(clip.title);
  };

  const handleSaveEdit = async (clipId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:5000/api/clips/${clipId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: editTitle })
      });

      if (response.ok) {
        toast.success('Clip updated successfully!');
        setEditingClip(null);
        fetchClips(); // Reload clips
      } else {
        toast.error('Failed to update clip');
      }
    } catch (error) {
      console.error('Error updating clip:', error);
      toast.error('Failed to update clip');
    }
  };

  const handleDeleteClip = async (clipId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:5000/api/clips/${clipId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success('Clip deleted successfully!');
        setShowDeleteConfirm(null);
        fetchClips(); // Reload clips
      } else {
        toast.error('Failed to delete clip');
      }
    } catch (error) {
      console.error('Error deleting clip:', error);
      toast.error('Failed to delete clip');
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Clips</h1>
        <div className="text-sm text-gray-600">
          {clips.length} {clips.length === 1 ? 'clip' : 'clips'} generated
        </div>
      </div>

      {clips.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <div className="text-6xl mb-4">✂️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No clips yet</h3>
          <p className="text-gray-500 mb-6">Process a video to generate viral clips</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clips.map((clip) => (
            <div key={clip.id} className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
              <div className="aspect-video bg-gray-900 relative">
                <video 
                  key={clip.id || clip.file_path}
                  src={(() => {
                    const url = getVideoUrl(clip.file_path);
                    console.log('🎥 Rendering video:', {
                      clipId: clip.id,
                      clipTitle: clip.title,
                      dbFilePath: clip.file_path,
                      constructedUrl: url
                    });
                    return url;
                  })()}
                  className="w-full h-full object-cover"
                  controls
                  preload="metadata"
                  onLoadStart={() => {
                    console.log('✅ Video loading started:', clip.id);
                  }}
                  onError={(e) => {
                    console.error('❌ Video load error:', {
                      clipId: clip.id,
                      filePath: clip.file_path,
                      attemptedUrl: e.target.src,
                      error: e
                    });
                    
                    // Try to fetch the URL to see the actual error
                    fetch(e.target.src)
                      .then(r => console.log('Fetch test status:', r.status))
                      .catch(err => console.error('Fetch test error:', err));
                  }}
                  onLoadedMetadata={(e) => {
                    console.log('✅ Video loaded successfully:', {
                      clipId: clip.id,
                      duration: e.target.duration,
                      videoWidth: e.target.videoWidth,
                      videoHeight: e.target.videoHeight
                    });
                  }}
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                  {formatDuration(clip.duration)}
                </div>
                {clip.viral_score && (
                  <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 rounded text-xs font-semibold">
                    🔥 {(clip.viral_score * 10 * 10).toFixed(0)}%
                  </div>
                )}
              </div>
              
              <div className="p-4">
                {editingClip === clip.id ? (
                  <div className="mb-3">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 mb-2"
                      placeholder="Clip title"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(clip.id)}
                        className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingClip(null)}
                        className="flex-1 px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <h3 className="font-semibold text-gray-900 mb-2">{clip.title}</h3>
                )}
                
                {clip.video_title && (
                  <p className="text-xs text-gray-500 mb-2">From: {clip.video_title}</p>
                )}
                
                {clip.emotion && (
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold mb-3 ${getEmotionColor(clip.emotion)}`}>
                    {clip.emotion}
                  </span>
                )}
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>{clip.start_time}s - {clip.end_time}s</span>
                  <span>{new Date(clip.created_at).toLocaleDateString()}</span>
                </div>
                
                {showDeleteConfirm === clip.id ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                    <p className="text-sm text-red-800 mb-2">Delete this clip?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteClip(clip.id)}
                        className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                      >
                        Yes, Delete
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(null)}
                        className="flex-1 px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <a 
                      href={getVideoUrl(clip.file_path)}
                      download={`${clip.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.mp4`}
                      onClick={(e) => {
                        e.preventDefault();
                        const url = getVideoUrl(clip.file_path);
                        fetch(url)
                          .then(response => response.blob())
                          .then(blob => {
                            const blobUrl = window.URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = blobUrl;
                            link.download = `${clip.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.mp4`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            window.URL.revokeObjectURL(blobUrl);
                            toast.success('Downloading clip...');
                          })
                          .catch(error => {
                            console.error('Download error:', error);
                            toast.error('Failed to download clip');
                          });
                      }}
                      className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm text-center"
                    >
                      Download
                    </a>
                    <button 
                      onClick={() => handleEditClip(clip)}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => {
                        const url = getVideoUrl(clip.file_path);
                        if (navigator.share) {
                          navigator.share({
                            title: clip.title,
                            text: `Check out this viral clip!`,
                            url: url
                          }).catch(err => console.log('Share error:', err));
                        } else {
                          navigator.clipboard.writeText(url);
                          toast.success('Clip URL copied to clipboard!');
                        }
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
                      title="Share"
                    >
                      📤
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(clip.id)}
                      className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition text-sm"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Clips;
