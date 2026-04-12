// File: my-app/app/livestream/page.tsx
// Example Livestream Component for Next.js Frontend

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Room as LiveKitRoom, LocalParticipant, RemoteParticipant } from 'livekit-client';
import * as LiveKit from 'livekit-client';
import styles from './livestream.module.css';

interface Room {
  id: number;
  roomName: string;
  title: string;
  hostName: string;
  currentViewers: number;
  status: string;
}

interface TokenData {
  token: string;
  livekitUrl: string;
  role: 'HOST' | 'VIEWER';
}

export default function LivestreamPage() {
  const [viewMode, setViewMode] = useState<'host' | 'viewer'>('viewer');
  const [isRoomHost, setIsRoomHost] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [roomTitle, setRoomTitle] = useState('');
  const [roomDescription, setRoomDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const livekitRef = useRef<LiveKitRoom | null>(null);
  const localParticipantRef = useRef<LocalParticipant | null>(null);
  const retryCountRef = useRef(0);
  const maxRetriesRef = useRef(3); // Stop polling after 3 consecutive failures

  // Cleanup LiveKit connection khi rời phòng
  useEffect(() => {
    return () => {
      if (livekitRef.current) {
        livekitRef.current.disconnect();
        livekitRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  // Lấy danh sách phòng hoạt động
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    let isMounted = true;

    const poll = async () => {
      if (!isMounted) return;
      await fetchActiveRooms();
      
      // Delay mặc định là 5s, nếu lỗi nhiều thì giãn ra 10s để đỡ spam
      let delay = 5000;
      if (retryCountRef.current >= maxRetriesRef.current) {
        delay = 10000;
      }
      
      timeoutId = setTimeout(poll, delay);
    };

    poll();
    
    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const fetchActiveRooms = async () => {
    try {
      const response = await fetch('/api/livestream/rooms', {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setRooms(data || []);
        retryCountRef.current = 0; // Reset retry count on success
        setError(null);
      } else {
        retryCountRef.current++;
        console.error('API returned status:', response.status);
        setError(`⚠️ API Error (${response.status}). Ensure livestream service is running on port 8086`);
      }
    } catch (error) {
      retryCountRef.current++;
      console.error('Error fetching rooms:', error);
      if (retryCountRef.current === 1) {
        // Only show error on first failure to avoid spam
        setError('🔴 Backend offline: Ensure port 8086 service is running\nStarting livestream service...');
      }
    }
  };

  // HOST: Tạo phòng
  const handleCreateRoom = async () => {
    if (!roomTitle) {
      alert('Vui lòng nhập tiêu đề phòng');
      return;
    }

    setLoading(true);
    try {
      const userId = '1'; // Lấy từ local storage/context
      const username = 'host_user'; // Lấy từ local storage/context

      const roomData = {
        title: roomTitle,
        description: roomDescription,
        maxViewers: 1000
      };

      const response = await fetch(
        '/api/livestream/rooms/create',
        {
          method: 'POST',
          headers: {
            'userId': userId,
            'username': username,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(roomData)
        }
      );

      if (response.ok) {
        const room = await response.json();
        setCurrentRoom(room);
        await joinRoom(room.roomName, userId, username, true);
      } else {
        alert('Lỗi tạo phòng');
      }
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Lỗi tạo phòng');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (room: Room) => {
    const userId = Math.floor(Math.random() * 10000).toString(); // Thay userId ngẫu nhiên cho viewer để tránh trùng 
    const username = 'viewer_' + userId;

    setLoading(true);
    try {
      setCurrentRoom(room);
      await joinRoom(room.roomName, userId, username, false);
    } catch (e) {
      setCurrentRoom(null);
    } finally {
      setLoading(false);
    }
  };

  // Kết nối phòng
  const joinRoom = async (
    roomName: string,
    userId: string,
    username: string,
    isRoomHost: boolean
  ) => {
    try {
      setError(null);
      // Lấy token từ API
      const response = await fetch(
        `/api/livestream/rooms/${roomName}/join`,
        {
          method: 'POST',
          headers: {
            'userId': userId,
            'username': username,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId, username })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get token');
      }

      const tokenData = await response.json() as TokenData;
      setTokenData(tokenData);

      // Kết nối LiveKit
      const room = new LiveKit.Room();
      livekitRef.current = room;

      // Thiết lập video/audio options
      const connectOptions = {
        autoSubscribe: true,
        audio: isRoomHost,
        video: isRoomHost ? { resolution: { width: 640, height: 480 } } : false,
      };

      // Đặt state isRoomHost
      setIsRoomHost(isRoomHost);

      // Nghe sự kiện Track Subscribed cho viewer
      room.on(LiveKit.RoomEvent.TrackSubscribed, (track, publication, participant) => {
        if (videoRef.current) {
          track.attach(videoRef.current);
        }
      });

      // Kết nối đến server
      await room.connect(tokenData.livekitUrl, tokenData.token, connectOptions);

      // Lấy local participant
      localParticipantRef.current = room.localParticipant;

      // Nếu là host, bật camera và mic mặc định
      if (isRoomHost) {
        try {
          await room.localParticipant.setCameraEnabled(true);
          await room.localParticipant.setMicrophoneEnabled(true);
          setCameraOn(true);
          setMicOn(true);
          
          // Gắn local video cho host sau khi đã bật camera
          const videoTrackMap = room.localParticipant.videoTrackPublications;
          if (videoTrackMap && videoTrackMap.size > 0 && videoRef.current) {
            const firstTrack = Array.from(videoTrackMap.values())[0];
            if (firstTrack.track) {
              firstTrack.track.attach(videoRef.current);
            } else if (firstTrack.videoTrack) {
              firstTrack.videoTrack.attach(videoRef.current);
            }
          }
        } catch (permError) {
          setError('Không thể truy cập camera hoặc microphone: ' + (permError as Error).message);
          console.error('Permission error:', permError);
        }
      }

      // Nghe sự kiện thay đổi participants
      room.on(LiveKit.RoomEvent.ParticipantConnected, () => {
        const participants = Array.from(room.remoteParticipants.values());
        setParticipants(participants);
      });

      room.on(LiveKit.RoomEvent.ParticipantDisconnected, () => {
        const participants = Array.from(room.remoteParticipants.values());
        setParticipants(participants);
      });

      // Fetch participants
      if (currentRoom) {
        fetchParticipants(currentRoom.id);
      }
    } catch (error) {
      console.error('Error joining room:', error);
      setError('Lỗi tham gia phòng: ' + (error as Error).message);
      alert('Lỗi tham gia phòng');
    }
  };

  // Lấy danh sách participants
  const fetchParticipants = async (roomId: number) => {
    try {
      const response = await fetch(
        `/api/livestream/participants/rooms/${roomId}`
      );
      if (response.ok) {
        const data = await response.json();
        setParticipants(data);
      }
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  // HOST: Bật/tắt camera
  const toggleCamera = async () => {
    try {
      if (!livekitRef.current || !livekitRef.current.localParticipant) {
        setError('Phòng chưa được kết nối');
        return;
      }

      const newState = !cameraOn;
      await livekitRef.current.localParticipant.setCameraEnabled(newState);
      setCameraOn(newState);
      setError(null);
    } catch (error) {
      const errorMsg = (error as Error).message;
      console.error('Error toggling camera:', error);
      setError('Lỗi bật/tắt camera: ' + errorMsg);
    }
  };

  // HOST: Bật/tắt mic
  const toggleMicrophone = async () => {
    try {
      if (!livekitRef.current || !livekitRef.current.localParticipant) {
        setError('Phòng chưa được kết nối');
        return;
      }

      const newState = !micOn;
      await livekitRef.current.localParticipant.setMicrophoneEnabled(newState);
      setMicOn(newState);
      setError(null);
    } catch (error) {
      const errorMsg = (error as Error).message;
      console.error('Error toggling microphone:', error);
      setError('Lỗi bật/tắt microphone: ' + errorMsg);
    }
  };

  // HOST: Kết thúc livestream
  const handleEndLivestream = async () => {
    if (!currentRoom || !isRoomHost) {
      alert('Chỉ host mới có thể kết thúc phòng');
      return;
    }

    setLoading(true);
    try {
      const userId = '1';
      const response = await fetch(
        `/api/livestream/rooms/${currentRoom.roomName}/end`,
        {
          method: 'POST',
          headers: {
            'userId': userId
          }
        }
      );

      if (response.ok) {
        alert('Kết thúc livestream thành công');
        setCurrentRoom(null);
        setTokenData(null);
        setCameraOn(false);
        setMicOn(false);
        setRoomTitle('');
        setRoomDescription('');
        setIsRoomHost(false);
        fetchActiveRooms();
      } else {
        alert('Lỗi kết thúc phòng');
      }
    } catch (error) {
      console.error('Error ending livestream:', error);
      alert('Lỗi kết thúc phòng');
    } finally {
      setLoading(false);
    }
  };

  // Rời phòng
  const handleLeaveRoom = async () => {
    if (!currentRoom) return;

    setLoading(true);
    try {
      const userId = isRoomHost ? '1' : '2';
      const response = await fetch(
        `/api/livestream/rooms/${currentRoom.roomName}/leave`,
        {
          method: 'POST',
          headers: {
            'userId': userId
          }
        }
      );

      // Disconnect từ LiveKit
      if (livekitRef.current) {
        await livekitRef.current.disconnect();
        livekitRef.current = null;
      }

      if (response.ok) {
        setCurrentRoom(null);
        setTokenData(null);
        setCameraOn(false);
        setMicOn(false);
        setIsRoomHost(false);
        setParticipants([]);
        setError(null);
        fetchActiveRooms();
      } else {
        alert('Lỗi rời phòng');
      }
    } catch (error) {
      console.error('Error leaving room:', error);
      alert('Lỗi rời phòng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Livestream Commerce</h1>

      {error && (
        <div style={{ 
          backgroundColor: '#fee', 
          color: '#c33', 
          padding: '10px', 
          marginBottom: '10px',
          borderRadius: '4px',
          border: '1px solid #fcc'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Không có phòng hiện tại */}
      {!currentRoom && (
        <div className={styles.content}>
          <div className={styles.section}>
            <h2>Tạo Phòng Livestream</h2>
            {/* Mode chọn - HOST hoặc VIEWER */}
            <div className={styles.modeSelector}>
              <label>
                <input
                  type="radio"
                  name="mode"
                  value="host"
                  checked={viewMode === 'host'}
                  onChange={() => setViewMode('host')}
                  disabled={loading}
                />
                Host (Bán Hàng)
              </label>
              <label>
                <input
                  type="radio"
                  name="mode"
                  value="viewer"
                  checked={viewMode === 'viewer'}
                  onChange={() => setViewMode('viewer')}
                  disabled={loading}
                />
                Viewer (Xem Hàng)
              </label>
            </div>

            {/* Form tạo phòng */}
            {viewMode === 'host' && (
              <div className={styles.form}>
                <input
                  type="text"
                  placeholder="Tiêu đề phòng"
                  value={roomTitle}
                  onChange={(e) => setRoomTitle(e.target.value)}
                  disabled={loading}
                />
                <textarea
                  placeholder="Mô tả phòng (tuỳ chọn)"
                  value={roomDescription}
                  onChange={(e) => setRoomDescription(e.target.value)}
                  disabled={loading}
                  rows={3}
                />
                <button
                  onClick={handleCreateRoom}
                  disabled={loading || !roomTitle}
                  className={styles.primaryBtn}
                >
                  {loading ? 'Đang tạo...' : 'Tạo Phòng Livestream'}
                </button>
              </div>
            )}
          </div>

          {/* Danh sách phòng */}
          <div className={styles.section}>
            <h2>Phòng Livestream Đang Hoạt Động ({rooms.length})</h2>
            <div className={styles.roomsList}>
              {rooms.length === 0 ? (
                <p>Không có phòng nào đang hoạt động</p>
              ) : (
                rooms.map((room) => (
                  <div key={room.id} className={styles.roomCard}>
                    <h3>{room.title}</h3>
                    <p>Chủ phòng: {room.hostName}</p>
                    <p>Viewers: {room.currentViewers}</p>
                    <p>Status: {room.status}</p>
                    <button
                      onClick={() => handleJoinRoom(room)}
                      disabled={loading || viewMode === 'host'}
                      className={styles.secondaryBtn}
                    >
                      {loading ? 'Đang tham gia...' : 'Tham Gia'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Đang livestream */}
      {currentRoom && tokenData && (
        <div className={styles.liveContainer}>
          <div className={styles.videoSection} ref={videoContainerRef}>
            <video
              ref={videoRef}
              autoPlay
              muted={isRoomHost}
              playsInline
              className={styles.videoElement}
              style={{ width: '100%', maxWidth: '600px', borderRadius: '8px' }}
            />
            <div className={styles.videoInfo}>
              <h2>{currentRoom.title}</h2>
              <p>Host: {currentRoom.hostName}</p>
              <p>Viewers: {currentRoom.currentViewers}</p>
              <p>Role: {tokenData.role}</p>
            </div>
          </div>

          {/* Controls */}
          <div className={styles.controls}>
            {isRoomHost && (
              <>
                <button
                  onClick={toggleCamera}
                  className={
                    cameraOn ? styles.activeBtn : styles.inactiveBtn
                  }
                >
                  📹 Camera: {cameraOn ? 'ON' : 'OFF'}
                </button>
                <button
                  onClick={toggleMicrophone}
                  className={micOn ? styles.activeBtn : styles.inactiveBtn}
                >
                  🎤 Mic: {micOn ? 'ON' : 'OFF'}
                </button>
                <button
                  onClick={handleEndLivestream}
                  disabled={loading}
                  className={styles.dangerBtn}
                >
                  {loading ? 'Đang kết thúc...' : 'Kết Thúc Livestream'}
                </button>
              </>
            )}
            {!isRoomHost && (
              <button
                onClick={handleLeaveRoom}
                disabled={loading}
                className={styles.secondaryBtn}
              >
                {loading ? 'Đang rời phòng...' : 'Rời Phòng'}
              </button>
            )}
          </div>

          {/* Participants List */}
          <div className={styles.participantsList}>
            <h3>Participants ({participants.length})</h3>
            <ul>
              {participants.map((p) => (
                <li key={p.id}>
                  {p.username} - {p.role} ({p.status})
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
