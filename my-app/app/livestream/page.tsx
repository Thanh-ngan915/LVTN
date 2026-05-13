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

  // Restore session on load
  useEffect(() => {
    const savedRoom = sessionStorage.getItem('livestream_room');
    const savedIsHost = sessionStorage.getItem('livestream_is_host') === 'true';
    
    if (savedRoom) {
      const room = JSON.parse(savedRoom);
      const storedUser = localStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : null;
      
      if (user) {
        console.log('Restoring livestream session...', room.roomName);
        setCurrentRoom(room);
        setIsRoomHost(savedIsHost);
        joinRoom(room.roomName, user.userId, user.username, savedIsHost);
      }
    }
  }, []);

  // Lấy danh sách phòng hoạt động
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    let isMounted = true;

    const poll = async () => {
      if (!isMounted) return;
      
      // Chỉ poll nếu không đang trong phòng
      if (!sessionStorage.getItem('livestream_room')) {
        await fetchActiveRooms();
      }
      
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

  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat to bottom
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // HOST: Tạo phòng
  const handleCreateRoom = async () => {
    if (!roomTitle) {
      alert('Vui lòng nhập tiêu đề phòng');
      return;
    }

    setLoading(true);
    try {
      // Lấy user info từ localStorage (từ phần trước đã sửa)
      const storedUser = localStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : { userId: '1', username: 'host_user' };
      
      const userId = user.userId;
      const username = user.username;

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
        setIsRoomHost(true);
        // Lưu session
        sessionStorage.setItem('livestream_room', JSON.stringify(room));
        sessionStorage.setItem('livestream_is_host', 'true');
        
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
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    
    const userId = user?.userId || Math.floor(Math.random() * 10000).toString();
    const username = user?.username || 'viewer_' + userId;

    setLoading(true);
    try {
      setCurrentRoom(room);
      setIsRoomHost(false);
      // Lưu session
      sessionStorage.setItem('livestream_room', JSON.stringify(room));
      sessionStorage.setItem('livestream_is_host', 'false');
      
      await joinRoom(room.roomName, userId, username, false);
    } catch (e) {
      setCurrentRoom(null);
      sessionStorage.removeItem('livestream_room');
      sessionStorage.removeItem('livestream_is_host');
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
      setChatMessages([]); // Clear chat when joining new room
      
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
        // Nếu không join được (ví dụ phòng đã kết thúc), xóa session
        sessionStorage.removeItem('livestream_room');
        sessionStorage.removeItem('livestream_is_host');
        setCurrentRoom(null);
        setIsRoomHost(false);
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

      // ✅ NGHE SỰ KIỆN CHAT REALTIME
      room.on(LiveKit.RoomEvent.DataReceived, (payload, participant) => {
        const decoder = new TextDecoder();
        const strData = decoder.decode(payload);
        try {
          const data = JSON.parse(strData);
          if (data.type === 'chat') {
            setChatMessages((prev) => [...prev, { 
              sender: participant?.identity || 'Khách', 
              text: data.text 
            }]);
          }
        } catch (e) {
          console.error('Lỗi giải mã tin nhắn:', e);
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

  // ✅ GỬI TIN NHẮN REALTIME
  const handleSendMessage = async () => {
    if (!chatInput.trim() || !livekitRef.current) return;

    try {
      const encoder = new TextEncoder();
      const data = JSON.stringify({
        type: 'chat',
        text: chatInput.trim()
      });
      const payload = encoder.encode(data);

      // Gửi cho tất cả mọi người trong phòng
      await livekitRef.current.localParticipant.publishData(payload, LiveKit.DataPacket_Kind.RELIABLE);

      // Hiển thị tin nhắn của chính mình
      setChatMessages((prev) => [...prev, { 
        sender: 'Tôi', 
        text: chatInput.trim() 
      }]);
      setChatInput('');
    } catch (error) {
      console.error('Lỗi gửi tin nhắn:', error);
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
      const storedUser = localStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : null;
      const userId = user?.userId || '1';

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
        setChatMessages([]);
        // Xóa session
        sessionStorage.removeItem('livestream_room');
        sessionStorage.removeItem('livestream_is_host');
        
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
      const storedUser = localStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : null;
      const userId = user?.userId || (isRoomHost ? '1' : '2');

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
        setChatMessages([]);
        setError(null);
        // Xóa session
        sessionStorage.removeItem('livestream_room');
        sessionStorage.removeItem('livestream_is_host');
        
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
        <div className={styles.errorBanner}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      {/* Không có phòng hiện tại */}
      {!currentRoom && (
        <div className={styles.content}>
          <div className={styles.section}>
            <h2>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
                <path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
              </svg>
              Bắt đầu Livestream
            </h2>
            
            {/* Mode chọn - HOST hoặc VIEWER */}
            <div className={styles.modeSelector}>
              <div 
                className={`${styles.modeOption} ${viewMode === 'host' ? styles.modeOptionActive : styles.modeOptionInactive}`}
                onClick={() => setViewMode('host')}
              >
                Host (Bán Hàng)
              </div>
              <div 
                className={`${styles.modeOption} ${viewMode === 'viewer' ? styles.modeOptionActive : styles.modeOptionInactive}`}
                onClick={() => setViewMode('viewer')}
              >
                Viewer (Xem Hàng)
              </div>
            </div>

            {/* Form tạo phòng */}
            {viewMode === 'host' && (
              <div className={styles.form}>
                <input
                  type="text"
                  placeholder="Tiêu đề buổi livestream..."
                  value={roomTitle}
                  onChange={(e) => setRoomTitle(e.target.value)}
                  disabled={loading}
                />
                <textarea
                  placeholder="Mô tả nội dung buổi bán hàng (ví dụ: Sale sập sàn 50%)..."
                  value={roomDescription}
                  onChange={(e) => setRoomDescription(e.target.value)}
                  disabled={loading}
                  rows={4}
                />
                <button
                  onClick={handleCreateRoom}
                  disabled={loading || !roomTitle}
                  className={styles.primaryBtn}
                >
                  {loading ? 'Đang khởi tạo...' : 'BẮT ĐẦU LIVESTREAM NGAY'}
                </button>
              </div>
            )}

            {viewMode === 'viewer' && (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ marginBottom: '20px', opacity: 0.5 }}>
                  <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                </svg>
                <p>Chọn một phòng bên phải để bắt đầu xem và mua sắm!</p>
              </div>
            )}
          </div>

          {/* Danh sách phòng */}
          <div className={styles.section}>
            <h2>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              Đang diễn ra ({rooms.length})
            </h2>
            <div className={styles.roomsList}>
              {rooms.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
                  <p>Hiện chưa có ai livestream. Hãy là người đầu tiên!</p>
                </div>
              ) : (
                rooms.map((room) => (
                  <div key={room.id} className={styles.roomCard}>
                    <span className={styles.badge}>Live</span>
                    <h3>{room.title}</h3>
                    <p>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                      {room.hostName}
                    </p>
                    <p>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                      </svg>
                      {room.currentViewers} người đang xem
                    </p>
                    <button
                      onClick={() => handleJoinRoom(room)}
                      disabled={loading || viewMode === 'host'}
                      className={styles.secondaryBtn}
                      style={{ marginTop: '15px', width: '100%' }}
                    >
                      {loading ? 'Đang vào...' : 'Tham Gia Ngay'}
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
          <div className={styles.mainLive}>
            <div className={styles.videoSection} ref={videoContainerRef}>
              <video
                ref={videoRef}
                autoPlay
                muted={isRoomHost}
                playsInline
                className={styles.videoElement}
              />
              
              <div className={styles.videoOverlay}>
                <div className={styles.videoHeader}>
                  <div className={styles.liveBadge}>LIVE</div>
                  <div className={styles.viewerCount}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                    {currentRoom.currentViewers}
                  </div>
                </div>

                <div className={styles.videoFooter}>
                  <div className={styles.hostInfo}>
                    <div className={styles.hostAvatar}>
                      {currentRoom.hostName.charAt(0).toUpperCase()}
                    </div>
                    <div className={styles.hostDetails}>
                      <h2>{currentRoom.title}</h2>
                      <p>@{currentRoom.hostName}</p>
                    </div>
                  </div>

                  <div className={styles.controls}>
                    {isRoomHost && (
                      <>
                        <button
                          onClick={toggleCamera}
                          className={`${styles.controlBtn} ${cameraOn ? styles.controlBtnActive : ''}`}
                          title="Bật/Tắt Camera"
                        >
                          {cameraOn ? (
                             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                          ) : (
                             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 16l3 3 3-3"/><path d="M2 2l20 20"/><path d="M23 7l-7 5 7 5V7z"/><path d="M1 5h11"/><path d="M1 19h11"/></svg>
                          )}
                        </button>
                        <button
                          onClick={toggleMicrophone}
                          className={`${styles.controlBtn} ${micOn ? styles.controlBtnActive : ''}`}
                          title="Bật/Tắt Mic"
                        >
                          {micOn ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                          ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                          )}
                        </button>
                        <button
                          onClick={handleEndLivestream}
                          className={`${styles.controlBtn} ${styles.controlBtnDanger}`}
                          title="Kết thúc Livestream"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>
                        </button>
                      </>
                    )}
                    {!isRoomHost && (
                      <button
                        onClick={handleLeaveRoom}
                        className={`${styles.controlBtn} ${styles.controlBtnDanger}`}
                        title="Rời phòng"
                      >
                         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(30, 41, 59, 0.4)', borderRadius: '20px' }}>
               <h3 style={{ marginBottom: '10px' }}>Mô tả</h3>
               <p style={{ color: '#94a3b8' }}>{currentRoom.description || 'Không có mô tả cho buổi livestream này.'}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className={styles.sidebar}>
            {/* Realtime Chat */}
            <div className={styles.chatBox}>
              <div className={styles.chatHeader}>Trò chuyện trực tiếp</div>
              <div className={styles.chatMessages} ref={chatMessagesRef}>
                <div className={styles.message}><span className={styles.sender}>Hệ thống:</span> Chào mừng bạn đến với buổi livestream!</div>
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={styles.message}>
                    <span className={styles.sender}>{msg.sender}:</span> {msg.text}
                  </div>
                ))}
              </div>
              <div className={styles.chatInput}>
                <input 
                  type="text" 
                  placeholder="Gửi tin nhắn..." 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button 
                  className={styles.primaryBtn} 
                  style={{ padding: '8px 15px' }}
                  onClick={handleSendMessage}
                >
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polyline points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </button>
              </div>
            </div>

            {/* Product Showcase */}
            <div className={styles.section} style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '15px' }}>Sản phẩm đang bán</h3>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '15px' }}>
                <div style={{ width: '60px', height: '60px', background: '#333', borderRadius: '10px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
                   <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1" style={{ margin: 'auto' }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>Áo Hoodie Unisex Premium</div>
                  <div style={{ fontSize: '0.9rem', color: '#60a5fa', fontWeight: '800' }}>299.000đ</div>
                </div>
                <button className={styles.primaryBtn} style={{ padding: '6px 12px', fontSize: '0.75rem' }}>MUA</button>
              </div>
            </div>

            {/* Participants */}
            <div className={styles.participantsSection}>
              <h3>Người xem ({participants.length})</h3>
              <div className={styles.participantsList}>
                {participants.map((p) => (
                  <div key={p.id} className={styles.participantItem}>
                    <span className={styles.participantDot}></span>
                    {p.username} {p.role === 'HOST' && <strong style={{ color: '#ef4444' }}>(Host)</strong>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
