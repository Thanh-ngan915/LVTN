/**
 * LiveStream Service Integration
 * Frontend code để tích hợp với livestream service
 */

// ==========================================
// LIVESTREAM API UTILITY FUNCTIONS
// ==========================================

const LIVESTREAM_API_BASE = 'http://localhost:8080/api/livestream';

/**
 * Tạo phòng livestream
 * @param {Object} roomData - Thông tin phòng
 * @param {string} userId - ID của host
 * @param {string} username - Username của host
 * @returns {Promise<Object>} Thông tin phòng đã tạo
 */
async function createLivestream(roomData, userId, username) {
  try {
    const response = await fetch(`${LIVESTREAM_API_BASE}/rooms/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'userId': userId,
        'username': username
      },
      body: JSON.stringify(roomData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to create room');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating livestream:', error);
    throw error;
  }
}

/**
 * Lấy access token để tham gia phòng
 * @param {string} roomName - Tên phòng
 * @param {number} userId - ID của user
 * @param {string} username - Username
 * @returns {Promise<Object>} Token response
 */
async function getJoinToken(roomName, userId, username) {
  try {
    const response = await fetch(`${LIVESTREAM_API_BASE}/rooms/${roomName}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'userId': userId,
        'username': username
      },
      body: JSON.stringify({ userId, username })
    });
    
    if (!response.ok) {
      throw new Error('Failed to get join token');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting join token:', error);
    throw error;
  }
}

/**
 * Lấy danh sách phòng đang hoạt động
 * @returns {Promise<Array>} Danh sách phòng
 */
async function getActiveRooms() {
  try {
    const response = await fetch(`${LIVESTREAM_API_BASE}/rooms`);
    
    if (!response.ok) {
      throw new Error('Failed to get active rooms');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting active rooms:', error);
    throw error;
  }
}

/**
 * Kết thúc phòng livestream
 * @param {string} roomName - Tên phòng
 * @param {number} userId - ID của host
 * @returns {Promise<Object>} Response
 */
async function endLivestream(roomName, userId) {
  try {
    const response = await fetch(`${LIVESTREAM_API_BASE}/rooms/${roomName}/end`, {
      method: 'POST',
      headers: {
        'userId': userId
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to end livestream');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error ending livestream:', error);
    throw error;
  }
}

/**
 * Leave phòng livestream
 * @param {string} roomName - Tên phòng
 * @param {number} userId - ID của user
 * @returns {Promise<Object>} Response
 */
async function leaveLivestream(roomName, userId) {
  try {
    const response = await fetch(`${LIVESTREAM_API_BASE}/rooms/${roomName}/leave`, {
      method: 'POST',
      headers: {
        'userId': userId
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to leave livestream');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error leaving livestream:', error);
    throw error;
  }
}

/**
 * Lấy danh sách participants trong phòng
 * @param {number} roomId - ID của phòng
 * @returns {Promise<Array>} Danh sách participants
 */
async function getParticipants(roomId) {
  try {
    const response = await fetch(`${LIVESTREAM_API_BASE}/participants/rooms/${roomId}`);
    
    if (!response.ok) {
      throw new Error('Failed to get participants');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting participants:', error);
    throw error;
  }
}

/**
 * Kiểm tra xem user có phải host
 * @param {number} roomId - ID của phòng
 * @param {number} userId - ID của user
 * @returns {Promise<Object>} {isHost: boolean}
 */
async function isRoomHost(roomId, userId) {
  try {
    const response = await fetch(
      `${LIVESTREAM_API_BASE}/participants/rooms/${roomId}/is-host/${userId}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to check host status');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error checking host status:', error);
    throw error;
  }
}

// ==========================================
// LIVEKIT INTEGRATION
// ==========================================

/**
 * LiveKit room setup và management class
 */
class LiveKitRoom {
  constructor(livekitUrl, token, roomName) {
    this.livekitUrl = livekitUrl;
    this.token = token;
    this.roomName = roomName;
    this.room = null;
    this.mainParticipant = null;
    this.participants = new Map();
  }

  /**
   * Connect to LiveKit room
   */
  async connect(videoElement, audioElement) {
    try {
      // Import LiveKit library (nên add vào HTML)
      // <script src="https://cdn.jsdelivr.net/npm/livekit-client@latest"></script>
      
      // Tạo local participant tracks
      const video = videoElement;
      const audio = audioElement;

      // Connect to room
      this.room = await LiveKit.Room.create({
        audio: audio,
        video: video
      });

      // Setup event listeners
      this.room.on(LiveKit.RoomEvent.ParticipantConnected, (participant) => {
        this.onParticipantConnected(participant);
      });

      this.room.on(LiveKit.RoomEvent.ParticipantDisconnected, (participant) => {
        this.onParticipantDisconnected(participant);
      });

      this.room.on(LiveKit.RoomEvent.TrackSubscribed, (track, publication, participant) => {
        this.onTrackSubscribed(track, publication, participant);
      });

      this.room.on(LiveKit.RoomEvent.TrackUnsubscribed, (track, publication, participant) => {
        this.onTrackUnsubscribed(track, publication, participant);
      });

      // Connect to LiveKit server
      await this.room.connect(this.livekitUrl, this.token);

      console.log('Connected to LiveKit room:', this.roomName);
      return this.room;
    } catch (error) {
      console.error('Error connecting to LiveKit:', error);
      throw error;
    }
  }

  /**
   * Khi participant kết nối
   */
  onParticipantConnected(participant) {
    console.log('Participant connected:', participant.name);
    this.participants.set(participant.sid, participant);
    
    // Emit event để update UI
    window.dispatchEvent(new CustomEvent('participant-joined', {
      detail: { participant }
    }));
  }

  /**
   * Khi participant ngắt kết nối
   */
  onParticipantDisconnected(participant) {
    console.log('Participant disconnected:', participant.name);
    this.participants.delete(participant.sid);
    
    // Emit event để update UI
    window.dispatchEvent(new CustomEvent('participant-left', {
      detail: { participant }
    }));
  }

  /**
   * Khi track được subscribe
   */
  onTrackSubscribed(track, publication, participant) {
    console.log('Track subscribed:', track.kind);
    
    if (track.kind === 'video') {
      // Attach video track to video element
      const videoElement = document.createElement('video');
      videoElement.id = `video-${participant.sid}`;
      videoElement.autoplay = true;
      videoElement.playsinline = true;
      LiveKit.Participant.attachVisualElement(track, videoElement);
      
      window.dispatchEvent(new CustomEvent('track-subscribed', {
        detail: { track, participant, videoElement }
      }));
    } else if (track.kind === 'audio') {
      // Attach audio track
      const audioElement = document.createElement('audio');
      audioElement.id = `audio-${participant.sid}`;
      audioElement.autoplay = true;
      LiveKit.Participant.attachAudioElement(track, audioElement);
    }
  }

  /**
   * Khi track được unsubscribe
   */
  onTrackUnsubscribed(track, publication, participant) {
    console.log('Track unsubscribed:', track.kind);
    
    if (track.kind === 'video') {
      const videoElement = document.getElementById(`video-${participant.sid}`);
      if (videoElement) {
        videoElement.remove();
      }
    }
  }

  /**
   * Bật/tắt camera
   */
  async toggleCamera(enabled) {
    if (this.room) {
      await this.room.localParticipant.setCameraEnabled(enabled);
      console.log('Camera:', enabled ? 'enabled' : 'disabled');
    }
  }

  /**
   * Bật/tắt microphone
   */
  async toggleMicrophone(enabled) {
    if (this.room) {
      await this.room.localParticipant.setMicrophoneEnabled(enabled);
      console.log('Microphone:', enabled ? 'enabled' : 'disabled');
    }
  }

  /**
   * Disconnect from room
   */
  async disconnect() {
    if (this.room) {
      await this.room.disconnect();
      console.log('Disconnected from room');
    }
  }

  /**
   * Lấy danh sách participants
   */
  getParticipants() {
    return Array.from(this.participants.values());
  }
}

// ==========================================
// EXAMPLE USAGE
// ==========================================

/*
// 1. HOST START LIVESTREAM
const hostId = 1;
const hostUsername = 'host_user';

const roomData = {
  title: 'My Livestream',
  description: 'Selling products',
  thumbnail: 'https://example.com/thumbnail.jpg',
  maxViewers: 1000
};

const room = await createLivestream(roomData, hostId, hostUsername);
console.log('Room created:', room);

// 2. GET TOKEN TO JOIN
const tokenData = await getJoinToken(room.roomName, hostId, hostUsername);
console.log('Token:', tokenData.token);

// 3. CONNECT TO LIVESTREAM
const livekit = new LiveKitRoom(
  tokenData.livekitUrl,
  tokenData.token,
  room.roomName
);

const videoElement = document.getElementById('local-video');
const audioElement = document.getElementById('local-audio');
await livekit.connect(videoElement, audioElement);

// 4. CONTROL MEDIA (HOST ONLY)
document.getElementById('camera-btn').addEventListener('click', () => {
  livekit.toggleCamera(true); // Only host can enable
});

document.getElementById('mic-btn').addEventListener('click', () => {
  livekit.toggleMicrophone(true); // Only host can enable
});

// 5. END LIVESTREAM (HOST ONLY)
document.getElementById('end-btn').addEventListener('click', async () => {
  await endLivestream(room.roomName, hostId);
  await livekit.disconnect();
});

// 6. VIEWER JOIN
const viewerId = 2;
const viewerName = 'viewer_user';
const viewerToken = await getJoinToken(room.roomName, viewerId, viewerName);

const viewerLivekit = new LiveKitRoom(
  viewerToken.livekitUrl,
  viewerToken.token,
  room.roomName
);

const viewerVideoElement = document.getElementById('viewer-video');
await viewerLivekit.connect(viewerVideoElement, null);

// 7. VIEWER LEAVE
document.getElementById('leave-btn').addEventListener('click', async () => {
  await leaveLivestream(room.roomName, viewerId);
  await viewerLivekit.disconnect();
});

// 8. GET ACTIVE ROOMS
const activeRooms = await getActiveRooms();
console.log('Active rooms:', activeRooms);
*/
